<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Notifications & Messages</h1>
      <div class="flex gap-2">
        <button @click="markAllRead" :disabled="unreadCount === 0" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
          Mark all read
        </button>
        <button @click="fetchNotifications" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Refresh
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-slate-500 mb-1">Total</p>
        <p class="text-xl font-bold text-slate-800">{{ notifications.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-red-100 shadow-sm p-4">
        <p class="text-xs text-red-400 mb-1">Unread</p>
        <p class="text-xl font-bold text-red-600">{{ unreadCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-orange-400 mb-1">Complaints</p>
        <p class="text-xl font-bold text-orange-600">{{ countByType('complaint') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-sky-400 mb-1">System</p>
        <p class="text-xl font-bold text-sky-600">{{ countByType('system') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search notifications..." class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
      </div>
      <select v-model="typeFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All Types</option>
        <option value="complaint">Complaints</option>
        <option value="system">System</option>
        <option value="order">Order</option>
        <option value="info">Info</option>
        <option value="message">Messages</option>
      </select>
      <select v-model="readFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All</option>
        <option value="unread">Unread</option>
        <option value="read">Read</option>
      </select>
    </div>

    <!-- Setup Banner -->
    <div v-if="tableNotFound" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 mb-4">
      <strong>Notifications table not found.</strong> Run the provided SQL migration in your Supabase project to enable notification tracking.
    </div>

    <!-- Notification List -->
    <div v-if="loading" class="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
      <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
      Loading notifications...
    </div>
    <div v-else-if="error && !tableNotFound" class="bg-white rounded-xl border border-slate-100 shadow-sm flex items-center justify-center py-16 text-red-500 text-sm">{{ error }}</div>

    <div v-else class="space-y-2">
      <div v-if="filteredNotifications.length === 0" class="bg-white rounded-xl border border-slate-100 shadow-sm py-12 text-center text-sm text-slate-400">
        {{ tableNotFound ? 'Run the SQL migration to create the notifications table.' : 'No notifications found.' }}
      </div>
      <div
        v-for="notif in filteredNotifications"
        :key="notif.id"
        class="bg-white rounded-xl border shadow-sm px-5 py-4 flex items-start gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
        :class="!notif.is_read && !notif.read ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100'"
        @click="openNotif(notif)"
      >
        <!-- Type Icon -->
        <div class="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0" :class="getTypeIconBg(notif.type)">
          <svg class="w-5 h-5" :class="getTypeIconColor(notif.type)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="notif.type === 'complaint'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            <path v-else-if="notif.type === 'order'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            <path v-else-if="notif.type === 'message'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <p class="text-sm font-semibold text-slate-700 truncate">{{ notif.title || notif.subject || 'Notification' }}</p>
              <span v-if="!notif.is_read && !notif.read" class="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="getTypeClass(notif.type)">
                {{ notif.type || 'system' }}
              </span>
              <span class="text-xs text-slate-400">{{ formatDate(notif.created_at) }}</span>
            </div>
          </div>
          <p class="text-sm text-slate-500 mt-0.5 line-clamp-2">{{ notif.message || notif.body || notif.content || '' }}</p>
          <p v-if="notif.user_id || notif.sender_id" class="text-xs text-slate-400 mt-1">
            From: {{ notif.sender_name || notif.user_id?.slice(0, 8) || '—' }}
          </p>
        </div>

        <button
          v-if="!notif.is_read && !notif.read"
          @click.stop="markRead(notif)"
          class="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 font-medium transition-colors flex-shrink-0"
        >
          Mark read
        </button>
      </div>
    </div>

    <!-- Notification Detail Modal -->
    <Teleport to="body">
      <div v-if="detailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="detailModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-semibold text-slate-800">Notification</h3>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="getTypeClass(selectedNotif?.type)">
                {{ selectedNotif?.type || 'system' }}
              </span>
            </div>
            <button @click="detailModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div v-if="selectedNotif" class="px-6 py-5 space-y-3">
            <div>
              <p class="text-xs text-slate-400 mb-1">Title</p>
              <p class="text-base font-semibold text-slate-800">{{ selectedNotif.title || selectedNotif.subject || 'Notification' }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 mb-1">Message</p>
              <p class="text-sm text-slate-700 leading-relaxed">{{ selectedNotif.message || selectedNotif.body || selectedNotif.content || '(No content)' }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-slate-50">
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Sent by</p>
                <p class="font-medium text-slate-700">{{ selectedNotif.sender_name || selectedNotif.user_id?.slice(0, 8) || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Date</p>
                <p class="font-medium text-slate-700">{{ formatDate(selectedNotif.created_at) }}</p>
              </div>
              <div v-if="selectedNotif.reference_id">
                <p class="text-xs text-slate-400 mb-0.5">Reference</p>
                <p class="font-mono text-xs text-slate-600">{{ selectedNotif.reference_id }}</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              v-if="selectedNotif && (!selectedNotif.is_read && !selectedNotif.read)"
              @click="selectedNotif && markRead(selectedNotif); detailModal = false"
              class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Mark as Read
            </button>
            <button @click="detailModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast.show" class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-600 text-white">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth-admin'],
})

const supabase = useSupabaseClient()

const notifications = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const tableNotFound = ref(false)
const search = ref('')
const typeFilter = ref('')
const readFilter = ref('')
const detailModal = ref(false)
const selectedNotif = ref<any>(null)
const toast = ref({ show: false, message: '' })
let toastTimer: ReturnType<typeof setTimeout> | null = null
let channel: any = null

const unreadCount = computed(() => notifications.value.filter(n => !n.is_read && !n.read).length)

const filteredNotifications = computed(() => {
  let result = notifications.value
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(n =>
      (n.title || '').toLowerCase().includes(q) ||
      (n.subject || '').toLowerCase().includes(q) ||
      (n.message || '').toLowerCase().includes(q) ||
      (n.body || '').toLowerCase().includes(q)
    )
  }
  if (typeFilter.value) result = result.filter(n => (n.type || '') === typeFilter.value)
  if (readFilter.value === 'unread') result = result.filter(n => !n.is_read && !n.read)
  if (readFilter.value === 'read') result = result.filter(n => n.is_read || n.read)
  return result
})

function countByType(type: string): number {
  return notifications.value.filter(n => (n.type || '') === type).length
}

function getTypeClass(type: string | null): string {
  switch ((type || '').toLowerCase()) {
    case 'complaint': return 'bg-red-100 text-red-700'
    case 'order': return 'bg-sky-100 text-sky-700'
    case 'message': return 'bg-violet-100 text-violet-700'
    case 'system': return 'bg-slate-100 text-slate-600'
    default: return 'bg-slate-100 text-slate-600'
  }
}

function getTypeIconBg(type: string | null): string {
  switch ((type || '').toLowerCase()) {
    case 'complaint': return 'bg-red-50'
    case 'order': return 'bg-sky-50'
    case 'message': return 'bg-violet-50'
    default: return 'bg-slate-50'
  }
}

function getTypeIconColor(type: string | null): string {
  switch ((type || '').toLowerCase()) {
    case 'complaint': return 'text-red-500'
    case 'order': return 'text-sky-500'
    case 'message': return 'text-violet-500'
    default: return 'text-slate-400'
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function showToast(message: string) {
  toast.value = { show: true, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

async function fetchNotifications() {
  loading.value = true
  error.value = null
  tableNotFound.value = false
  try {
    const { data, error: err } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)
    if (err) {
      if (err.code === '42P01') { tableNotFound.value = true; return }
      throw err
    }
    notifications.value = data || []
  } catch (e: any) {
    error.value = e?.message || 'Failed to load notifications'
  } finally {
    loading.value = false
  }
}

function openNotif(notif: any) {
  selectedNotif.value = notif
  detailModal.value = true
  if (!notif.is_read && !notif.read) markRead(notif)
}

async function markRead(notif: any) {
  try {
    // Support both is_read and read column names
    const updateCol = 'is_read' in notif ? { is_read: true } : { read: true }
    await supabase.from('notifications').update(updateCol).eq('id', notif.id)
    const idx = notifications.value.findIndex(n => n.id === notif.id)
    if (idx !== -1) notifications.value[idx] = { ...notifications.value[idx], is_read: true, read: true }
  } catch { /* silent */ }
}

async function markAllRead() {
  const unread = notifications.value.filter(n => !n.is_read && !n.read)
  const hasIsRead = unread.length > 0 && 'is_read' in unread[0]
  const updateCol = hasIsRead ? { is_read: true } : { read: true }
  try {
    await supabase.from('notifications').update(updateCol).in('id', unread.map(n => n.id))
    notifications.value = notifications.value.map(n => ({ ...n, is_read: true, read: true }))
    showToast('All notifications marked as read')
  } catch (e: any) {
    showToast('Failed to mark all as read')
  }
}

function startRealtime() {
  channel = supabase
    .channel('admin-notifications-live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload: any) => {
      if (payload?.new) notifications.value = [payload.new, ...notifications.value]
    })
    .subscribe()
}

onMounted(() => {
  fetchNotifications()
  startRealtime()
})

onBeforeUnmount(() => {
  if (channel) supabase.removeChannel(channel)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
