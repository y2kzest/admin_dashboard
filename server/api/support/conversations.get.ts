import { createError, parseCookies, type H3Event } from 'h3'

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
  const authData = await authResponse.json() as Record<string, any>

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
  const adminData = await adminResponse.json() as Array<Record<string, any>> | Record<string, any>

  if (!adminResponse.ok) {
    throw createError({ statusCode: adminResponse.status, statusMessage: (adminData as any)?.message || adminResponse.statusText })
  }
  if (!Array.isArray(adminData) || adminData.length === 0) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }

  return { supabaseUrl, serviceHeaders, userId: authData.id as string }
}

function getPublicStorageUrl(supabaseUrl: string, bucket: string, path: string) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

export default eventHandler(async (event) => {
  const { supabaseUrl, serviceHeaders, userId } = await requireSupportAdmin(event)

  const conversationsResponse = await fetch(
    `${supabaseUrl}/rest/v1/conversations?select=*&seller_id=eq.${userId}&order=last_message_time.desc`,
    { headers: serviceHeaders },
  )
  const rows = await conversationsResponse.json() as Array<Record<string, any>> | Record<string, any>

  if (!conversationsResponse.ok) {
    throw createError({
      statusCode: conversationsResponse.status,
      statusMessage: (rows as any)?.message || conversationsResponse.statusText,
    })
  }

  const conversationRows = Array.isArray(rows) ? rows : []
  const buyerIds = [...new Set(conversationRows.map(row => row.buyer_id).filter(Boolean))] as string[]

  let profileMap = new Map<string, Record<string, any>>()
  let authProfileMap = new Map<string, Record<string, any>>()

  if (buyerIds.length) {
    const buyerFilter = buyerIds.join(',')
    const [profilesResponse, authProfilesResponse] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/profile?select=*&user_id=in.(${buyerFilter})`, { headers: serviceHeaders }),
      fetch(`${supabaseUrl}/rest/v1/profiles?select=*&id=in.(${buyerFilter})`, { headers: serviceHeaders }),
    ])

    const profiles = await profilesResponse.json() as Array<Record<string, any>> | Record<string, any>
    const authProfiles = await authProfilesResponse.json() as Array<Record<string, any>> | Record<string, any>

    if (!profilesResponse.ok) {
      throw createError({ statusCode: profilesResponse.status, statusMessage: (profiles as any)?.message || profilesResponse.statusText })
    }
    if (!authProfilesResponse.ok) {
      throw createError({ statusCode: authProfilesResponse.status, statusMessage: (authProfiles as any)?.message || authProfilesResponse.statusText })
    }

    profileMap = new Map((Array.isArray(profiles) ? profiles : []).map((row: any) => [row.user_id, row]))
    authProfileMap = new Map((Array.isArray(authProfiles) ? authProfiles : []).map((row: any) => [row.id, row]))
  }

  const conversations = conversationRows.map((row) => {
    const profile = profileMap.get(row.buyer_id) ?? {}
    const authProfile = authProfileMap.get(row.buyer_id) ?? {}

    let avatarUrl = profile.avatar_url ?? null
    if (avatarUrl && !String(avatarUrl).startsWith('http') && !String(avatarUrl).startsWith('data:')) {
      avatarUrl = getPublicStorageUrl(supabaseUrl, 'Avatars', String(avatarUrl))
    }

    return {
      id: row.id,
      buyer_id: row.buyer_id,
      buyer_name: profile.name || authProfile.full_name || 'Buyer',
      buyer_email: authProfile.email || profile.email || '',
      buyer_avatar: avatarUrl,
      last_message: row.last_message,
      last_message_time: row.last_message_time || row.last_message_at || row.created_at || null,
      unread_admin: row.unread_admin ?? 0,
    }
  })

  return { conversations }
})