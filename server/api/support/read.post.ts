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
  const body = await readBody<{ conversationId?: string }>(event)
  const conversationId = body?.conversationId?.trim()

  if (!conversationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Conversation id is required',
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

  const [conversationsResponse, messagesResponse] = await Promise.all([
    // unread_admin may not exist if Flutter's migration ran first — fail silently
    fetch(`${supabaseUrl}/rest/v1/conversations?id=eq.${conversationId}`, {
      method: 'PATCH',
      headers: serviceHeaders,
      body: JSON.stringify({ unread_admin: 0 }),
    }).catch(() => null),
    fetch(`${supabaseUrl}/rest/v1/messages?conversation_id=eq.${conversationId}&is_read=eq.false&sender_id=neq.${userId}`, {
      method: 'PATCH',
      headers: serviceHeaders,
      body: JSON.stringify({ is_read: true }),
    }),
  ])

  // Ignore unread_admin PATCH failure — column may not exist yet (see sql/add-support-columns.sql)
  if (conversationsResponse && !conversationsResponse.ok) {
    const errorBody = await conversationsResponse.text()
    const parsed = (() => { try { return JSON.parse(errorBody) } catch { return null } })()
    // Only throw on unexpected errors, not missing-column (42703)
    if (parsed?.code !== '42703') {
      throw createError({
        statusCode: conversationsResponse.status,
        statusMessage: parsed?.message || conversationsResponse.statusText,
      })
    }
  }

  if (!messagesResponse.ok) {
    const errorBody = await messagesResponse.text()
    throw createError({
      statusCode: messagesResponse.status,
      statusMessage: errorBody || messagesResponse.statusText,
    })
  }

  return { ok: true }
})