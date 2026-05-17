import { createError, parseCookies, readBody, type H3Event } from 'h3'

function getEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw createError({ statusCode: 500, statusMessage: `Missing ${name}` })
  }
  return value
}

function readSessionFromCookies(event: H3Event) {
  const cookies = parseCookies(event)
  const authCookieKey = Object.keys(cookies).find(key => key.includes('auth-token'))
  if (!authCookieKey) return null

  const baseKey = authCookieKey.replace(/\.\d+$/, '')
  const chunkKeys = Object.keys(cookies)
    .filter(key => key === baseKey || key.startsWith(`${baseKey}.`))
    .sort((left, right) => {
      const leftIndex = Number(left.split('.').pop() ?? -1)
      const rightIndex = Number(right.split('.').pop() ?? -1)
      return leftIndex - rightIndex
    })

  const rawValue = chunkKeys.map(key => cookies[key]).join('')
  const decodedValue = decodeURIComponent(rawValue)
  const json = decodedValue.startsWith('base64-')
    ? Buffer.from(decodedValue.slice(7), 'base64').toString('utf8')
    : decodedValue

  return JSON.parse(json) as { access_token?: string }
}

async function requireSupportAdmin(event: H3Event) {
  const supabaseUrl = getEnv('SUPABASE_URL')
  const anonKey = getEnv('SUPABASE_KEY')
  const serviceKey = getEnv('SUPABASE_SERVICE_KEY')
  const session = readSessionFromCookies(event)

  if (!session?.access_token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${session.access_token}`,
    },
  })
  const authData = await authResponse.json()

  if (!authResponse.ok || !authData?.id) {
    throw createError({ statusCode: 401, statusMessage: authData?.message || 'Unauthorized' })
  }

  const serviceHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  }
  const adminResponse = await fetch(
    `${supabaseUrl}/rest/v1/user_roles?select=role&user_id=eq.${authData.id}&role=eq.admin&limit=1`,
    { headers: serviceHeaders },
  )
  const adminData = await adminResponse.json()

  if (!adminResponse.ok) {
    throw createError({ statusCode: adminResponse.status, statusMessage: adminData?.message || adminResponse.statusText })
  }
  if (!Array.isArray(adminData) || adminData.length === 0) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  return { supabaseUrl, serviceHeaders, userId: authData.id }
}

export default eventHandler(async (event) => {
  const { supabaseUrl, serviceHeaders, userId } = await requireSupportAdmin(event)
  const body = await readBody<{ conversationId?: string; content?: string }>(event)

  const conversationId = body?.conversationId?.trim()
  const content = body?.content?.trim()

  if (!conversationId || !content) {
    throw createError({
      statusCode: 400,
      statusMessage: 'conversationId and content are required',
    })
  }

  const conversationResponse = await fetch(
    `${supabaseUrl}/rest/v1/conversations?select=id&id=eq.${conversationId}&seller_id=eq.${userId}&limit=1`,
    { headers: serviceHeaders },
  )
  const conversationData = await conversationResponse.json() as Array<{ id: string }>

  if (!conversationResponse.ok) {
    throw createError({
      statusCode: conversationResponse.status,
      statusMessage: (conversationData as any)?.message || conversationResponse.statusText,
    })
  }

  if (!Array.isArray(conversationData) || conversationData.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Conversation not found',
    })
  }

  const now = new Date().toISOString()

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/messages`, {
    method: 'POST',
    headers: {
      ...serviceHeaders,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      conversation_id: conversationId,
      sender_id: userId,
      content,
      is_read: false,
    }),
  })
  const insertData = await insertResponse.json() as Array<Record<string, any>>

  if (!insertResponse.ok || !Array.isArray(insertData) || insertData.length === 0) {
    throw createError({
      statusCode: insertResponse.status,
      statusMessage: (insertData as any)?.message || insertResponse.statusText,
    })
  }

  // Use last_message_at — the column Flutter created; last_message_time may not exist
  const updateResponse = await fetch(`${supabaseUrl}/rest/v1/conversations?id=eq.${conversationId}`, {
    method: 'PATCH',
    headers: serviceHeaders,
    body: JSON.stringify({
      last_message: content,
      last_message_at: now,
    }),
  })
  const updateData = await updateResponse.text()

  if (!updateResponse.ok) {
    throw createError({
      statusCode: updateResponse.status,
      statusMessage: updateData || updateResponse.statusText,
    })
  }

  return { message: insertData[0] }
})