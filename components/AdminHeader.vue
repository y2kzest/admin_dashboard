<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">

    <!-- Left: hamburger (mobile) + page title -->
    <div class="flex items-center gap-3">
      <!-- Mobile hamburger -->
      <button
        class="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        @click="sidebarOpen = !sidebarOpen"
        aria-label="Toggle sidebar"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Page breadcrumb -->
      <div>
        <h1 class="text-base font-bold text-slate-800 leading-none">{{ pageTitle }}</h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ pageSubtitle }}</p>
      </div>
    </div>

    <!-- Right: notifications + profile -->
    <div class="flex items-center gap-2">

      <!-- Notifications -->
      <div class="relative" ref="notifRef">
        <button
          @click="toggleNotif"
          class="relative h-9 w-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span v-if="unseenCount > 0" class="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-[#F9B023] rounded-full text-[9px] font-bold text-slate-900 flex items-center justify-center ring-2 ring-white">
            {{ unseenCount > 9 ? '9+' : unseenCount }}
          </span>
        </button>

        <Transition name="dropdown">
          <div v-if="notifOpen" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-slate-800">Notifications</span>
                <span v-if="unseenCount > 0" class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#2A4BA0] text-white">{{ unseenCount }}</span>
              </div>
              <button @click="markAllSeen" class="text-xs text-[#2A4BA0] hover:text-[#153075] font-semibold transition-colors">Mark all read</button>
            </div>

            <div class="overflow-y-auto max-h-[320px]">
              <div v-if="notifLoading" class="py-10 flex flex-col items-center gap-2 text-slate-400">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                <span class="text-xs">Loading...</span>
              </div>
              <div v-else-if="headerNotifications.length === 0" class="py-10 text-center text-xs text-slate-400">No notifications yet</div>
              <div
                v-for="notif in headerNotifications"
                :key="notif.id"
                @click="handleNotifClick(notif)"
                class="px-4 py-3 border-b border-slate-50 last:border-0 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                :class="!seenIds.has(notif.id) ? 'bg-blue-50/40' : ''"
              >
                <div class="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" :class="getNotifIconBg(notif.type)">
                  <svg class="w-4 h-4" :class="getNotifIconColor(notif.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="notif.type === 'vendor_application'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path v-else-if="notif.type === 'vendor_approved'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path v-else-if="notif.type === 'new_product'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l12 6"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-slate-700 truncate">{{ notif.title }}</p>
                  <p class="text-xs text-slate-500 truncate mt-0.5">{{ notif.message }}</p>
                  <p class="text-[10px] text-slate-400 mt-1">{{ formatNotifDate(notif.created_at) }}</p>
                </div>
                <div v-if="!seenIds.has(notif.id)" class="h-2 w-2 rounded-full bg-[#2A4BA0] flex-shrink-0 mt-1.5"></div>
              </div>
            </div>

            <div class="px-4 py-2.5 border-t border-slate-100 bg-slate-50 text-center">
              <NuxtLink to="/notifications" @click="notifOpen = false" class="text-xs text-[#2A4BA0] hover:text-[#153075] font-semibold transition-colors">
                View all notifications →
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Profile dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          :aria-expanded="dropdownOpen"
        >
          <div class="h-8 w-8 rounded-xl overflow-hidden bg-[#2A4BA0] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            <img v-if="adminAvatarUrl" :src="adminAvatarUrl" class="h-full w-full object-cover" alt="Admin" />
            <span v-else>{{ userInitials }}</span>
          </div>
          <span class="hidden sm:block text-sm font-semibold text-slate-700">{{ userName }}</span>
          <svg class="hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            <div class="px-4 py-3.5 border-b border-slate-100 bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl overflow-hidden bg-[#2A4BA0] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  <img v-if="adminAvatarUrl" :src="adminAvatarUrl" class="h-full w-full object-cover" alt="Admin" />
                  <span v-else>{{ userInitials }}</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-slate-800 truncate">{{ userName }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ userEmail }}</p>
                </div>
              </div>
            </div>
            <div class="py-1.5">
              <button @click="goToSettings" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <span>Settings &amp; Profile</span>
              </button>
            </div>
            <div class="border-t border-slate-100 py-1.5">
              <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSupabaseClient, useSupabaseUser, navigateTo, useRoute } from '#imports'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

const sidebarOpen = useState<boolean>('sidebarOpen', () => true)

// ── Profile ──
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
// Shared across header + settings so saving an avatar updates the UI instantly
const adminAvatarUrl = useState<string | null>('admin-avatar-url', () => null)

const userName = computed(() =>
  (user.value?.user_metadata?.display_name as string | undefined)
  || (user.value?.user_metadata?.full_name as string | undefined)
  || 'Admin'
)
const userEmail = computed(() => user.value?.email ?? '')
const userInitials = computed(() => {
  const name = userName.value.trim()
  const parts = name.split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
})

async function loadAdminAvatar() {
  try {
    const uid = user.value?.id
    if (!uid) { adminAvatarUrl.value = null; return }
    const { data } = await supabase
      .from('profile')
      .select('avatar_url')
      .eq('user_id', uid)
      .maybeSingle()
    const url = data?.avatar_url as string | null
    if (!url) { adminAvatarUrl.value = null; return }
    if (url.startsWith('data:') || url.startsWith('http')) { adminAvatarUrl.value = url; return }
    const { data: storageData } = supabase.storage.from('avatars').getPublicUrl(url)
    adminAvatarUrl.value = storageData?.publicUrl || null
  } catch { /* silent */ }
}

// ── Page titles ──
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: "Welcome back, here's what's happening" },
  '/vendor-management': { title: 'Vendor Management', subtitle: 'Monitor and manage all registered sellers' },
  '/product-management': { title: 'Product Management', subtitle: 'Review and manage all product listings' },
  '/orders': { title: 'Orders', subtitle: 'Monitor all marketplace transactions' },
  '/users': { title: 'User Management', subtitle: 'Manage buyers and sellers on the platform' },
  '/pickup-schedules': { title: 'Pickup Schedules', subtitle: 'Manage delivery and pickup scheduling' },
  '/notifications': { title: 'Notifications', subtitle: 'System messages and platform alerts' },
  '/settings': { title: 'System Settings', subtitle: 'Configure platform preferences and admin profile' },
  '/support': { title: 'Buyer Support', subtitle: 'Respond to help requests from buyers' },
}

const pageTitle = computed(() => {
  const match = Object.keys(pageTitles).find(k => route.path.startsWith(k))
  return match ? pageTitles[match].title : 'Admin'
})
const pageSubtitle = computed(() => {
  const match = Object.keys(pageTitles).find(k => route.path.startsWith(k))
  return match ? pageTitles[match].subtitle : ''
})

// ── Notifications ──
const notifOpen = ref(false)
const notifRef = ref<HTMLElement | null>(null)
const notifLoading = ref(false)
const headerNotifications = ref<{ id: string; type: string; title: string; message: string; created_at: string }[]>([])
const seenIds = ref<Set<string>>(new Set())

const unseenCount = computed(() => headerNotifications.value.filter(n => !seenIds.value.has(n.id)).length)

function loadSeen() {
  try {
    const raw = localStorage.getItem('admin_seen_notifs')
    if (raw) seenIds.value = new Set(JSON.parse(raw) as string[])
  } catch { /* ignore */ }
}

function saveSeen() {
  try { localStorage.setItem('admin_seen_notifs', JSON.stringify([...seenIds.value])) } catch { /* ignore */ }
}

function markAllSeen() {
  headerNotifications.value.forEach(n => seenIds.value.add(n.id))
  saveSeen()
}

function handleNotifClick(notif: { id: string; type: string }) {
  seenIds.value.add(notif.id)
  saveSeen()
  notifOpen.value = false
  if (notif.type === 'vendor_application' || notif.type === 'vendor_approved') navigateTo('/vendor-management')
  else if (notif.type === 'new_product') navigateTo('/product-management')
  else navigateTo('/notifications')
}

function getNotifIconBg(type: string): string {
  if (type === 'vendor_application') return 'bg-amber-50'
  if (type === 'vendor_approved') return 'bg-emerald-50'
  if (type === 'new_product') return 'bg-indigo-50'
  return 'bg-slate-50'
}

function getNotifIconColor(type: string): string {
  if (type === 'vendor_application') return 'text-amber-500'
  if (type === 'vendor_approved') return 'text-emerald-500'
  if (type === 'new_product') return 'text-[#2A4BA0]'
  return 'text-slate-400'
}

function formatNotifDate(dateStr: string): string {
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function fetchHeaderNotifs() {
  notifLoading.value = true
  const results: { id: string; type: string; title: string; message: string; created_at: string }[] = []
  try {
    const { data: pendingVendors } = await supabase
      .from('seller_profiles').select('id, store_name, full_name, created_at')
      .eq('approval_status', 'pending').order('created_at', { ascending: false }).limit(5)
    for (const v of pendingVendors || []) {
      results.push({ id: `vendor-pending-${v.id}`, type: 'vendor_application', title: 'New Vendor Application', message: `${v.store_name || v.full_name || 'A vendor'} is requesting approval`, created_at: v.created_at })
    }

    const since7d = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
    const { data: approvedVendors } = await supabase
      .from('seller_profiles').select('id, store_name, full_name, created_at')
      .eq('approval_status', 'approved').gte('created_at', since7d).order('created_at', { ascending: false }).limit(3)
    for (const v of approvedVendors || []) {
      results.push({ id: `vendor-approved-${v.id}`, type: 'vendor_approved', title: 'Vendor Approved', message: `${v.store_name || v.full_name || 'A vendor'} has been approved`, created_at: v.created_at })
    }

    try {
      const { data: newProducts } = await supabase
        .from('product').select('id, name, created_at').gte('created_at', since7d)
        .order('created_at', { ascending: false }).limit(5)
      for (const p of (newProducts || [])) {
        if (!p.created_at) continue
        results.push({ id: `product-${p.id}`, type: 'new_product', title: 'New Product Listed', message: `"${p.name}" was added to the marketplace`, created_at: p.created_at })
      }
    } catch { /* product table may not have created_at */ }

    try {
      const { data: generalNotifs } = await supabase
        .from('notifications').select('id, title, message, type, created_at')
        .order('created_at', { ascending: false }).limit(5)
      for (const n of (generalNotifs || [])) {
        results.push({ id: `notif-${n.id}`, type: n.type || 'system', title: n.title || 'Notification', message: n.message || '', created_at: n.created_at })
      }
    } catch { /* table may not exist */ }

    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    headerNotifications.value = results.slice(0, 15)
  } catch { /* silent */ } finally {
    notifLoading.value = false
  }
}

function toggleNotif() {
  notifOpen.value = !notifOpen.value
  if (notifOpen.value) fetchHeaderNotifs()
}

function toggleDropdown() { dropdownOpen.value = !dropdownOpen.value }
function goToSettings() { dropdownOpen.value = false; navigateTo('/settings') }

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) dropdownOpen.value = false
  if (notifRef.value && !notifRef.value.contains(e.target as Node)) notifOpen.value = false
}

onMounted(() => {
  loadSeen()
  if (!adminAvatarUrl.value) loadAdminAvatar()
  document.addEventListener('mousedown', handleClickOutside)
  fetchHeaderNotifs()
})
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

async function handleLogout() {
  dropdownOpen.value = false
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    await navigateTo('/login')
  } catch (err: any) { console.error('Error logging out:', err.message) }
}
</script>

<style scoped>
.dropdown-enter-active, .dropdown-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
