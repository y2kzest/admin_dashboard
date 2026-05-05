import { createError, getQuery, parseCookies, type H3Event } from 'h3'

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
  const query = getQuery(event)
  const conversationId = String(query.conversationId || '')

  if (!conversationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'conversationId is required',
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

  const messagesResponse = await fetch(
    `${supabaseUrl}/rest/v1/messages?select=*&conversation_id=eq.${conversationId}&order=created_at.asc`,
    { headers: serviceHeaders },
  )
  const data = await messagesResponse.json()

  if (!messagesResponse.ok) {
    throw createError({
      statusCode: messagesResponse.status,
      statusMessage: data?.message || messagesResponse.statusText,
    })
  }

  return { messages: data ?? [] }
})