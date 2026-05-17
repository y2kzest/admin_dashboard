<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
      <button @click="fetchUsers" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-slate-500 mb-1">Total Users</p>
        <p class="text-xl font-bold text-slate-800">{{ users.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-sky-500 mb-1">Buyers</p>
        <p class="text-xl font-bold text-sky-600">{{ countByRole('buyer') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-indigo-500 mb-1">Sellers</p>
        <p class="text-xl font-bold text-indigo-600">{{ countByRole('seller') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-red-500 mb-1">Suspended</p>
        <p class="text-xl font-bold text-red-600">{{ countByStatus('suspended') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search by name or email..." class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
      </div>
      <select v-model="roleFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All Roles</option>
        <option value="buyer">Buyers</option>
        <option value="seller">Sellers</option>
        <option value="admin">Admins</option>
      </select>
      <select v-model="statusFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        Loading users...
      </div>
      <div v-else-if="error" class="flex items-center justify-center py-16 text-red-500 text-sm">{{ error }}</div>
      <table v-else class="min-w-full divide-y divide-slate-100">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="px-5 py-12 text-center text-sm text-slate-400">No users found.</td>
          </tr>
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl flex-shrink-0 overflow-hidden border border-slate-200">
                  <img
                    v-if="getProfileImageUrl(user)"
                    :src="getProfileImageUrl(user) || ''"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="h-full w-full flex items-center justify-center text-sm font-bold"
                    :class="user.role === 'seller' ? 'bg-indigo-100 text-indigo-700' : user.role === 'admin' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'">
                    {{ getInitials(user.name || user.email || 'U') }}
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate">{{ user.name || 'No name' }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ user.email || '—' }}</p>
                  <p v-if="user.role === 'seller' && user.store_name" class="text-xs text-indigo-500 truncate font-medium">{{ user.store_name }}</p>
                  <p v-if="user.phone" class="text-xs text-slate-400 truncate">{{ user.phone }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3.5">
              <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getRoleClass(user.role)">
                {{ user.role || 'user' }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getUserStatusClass(user.status)">
                {{ user.status || 'active' }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-sm text-slate-500">{{ formatDate(user.created_at) }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <button @click="openUserDetail(user)" class="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors">
                  View
                </button>
                <button
                  v-if="user.role !== 'admin'"
                  @click="toggleSuspend(user)"
                  class="text-xs px-2.5 py-1 rounded-lg font-medium transition-colors"
                  :class="user.status === 'suspended' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
                >
                  {{ user.status === 'suspended' ? 'Activate' : 'Suspend' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Detail Modal -->
    <Teleport to="body">
      <div v-if="detailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="detailModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">User Details</h3>
            <button @click="detailModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div v-if="selectedUser" class="px-6 py-5">
            <div class="flex items-center gap-4 mb-5">
              <div class="h-14 w-14 rounded-2xl flex-shrink-0 overflow-hidden border border-slate-200">
                <img
                  v-if="getProfileImageUrl(selectedUser)"
                  :src="getProfileImageUrl(selectedUser) || ''"
                  alt=""
                  class="h-full w-full object-cover"
                />
                <div v-else class="h-full w-full flex items-center justify-center text-xl font-bold"
                  :class="selectedUser.role === 'seller' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'">
                  {{ getInitials(selectedUser.name || selectedUser.email || 'U') }}
                </div>
              </div>
              <div>
                <p class="text-base font-semibold text-slate-800">{{ selectedUser.name || 'No name' }}</p>
                <p class="text-sm text-slate-400">{{ selectedUser.email }}</p>
                <p v-if="selectedUser.role === 'seller' && selectedUser.store_name" class="text-xs text-indigo-600 font-semibold mt-0.5">{{ selectedUser.store_name }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Role</p>
                <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getRoleClass(selectedUser.role)">{{ selectedUser.role || 'user' }}</span>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Status</p>
                <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getUserStatusClass(selectedUser.status)">{{ selectedUser.status || 'active' }}</span>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Phone</p>
                <p class="font-medium text-slate-700">{{ selectedUser.phone || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Joined</p>
                <p class="font-medium text-slate-700">{{ formatDate(selectedUser.created_at) }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-slate-400 mb-0.5">User ID</p>
                <p class="font-mono text-xs text-slate-500 break-all">{{ selectedUser.id }}</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-between">
            <button
              v-if="selectedUser?.role !== 'admin'"
              @click="selectedUser && toggleSuspend(selectedUser); detailModal = false"
              class="px-4 py-2 text-sm font-medium rounded-xl transition-colors"
              :class="selectedUser?.status === 'suspended' ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-amber-600 text-white hover:bg-amber-700'"
            >
              {{ selectedUser?.status === 'suspended' ? 'Activate Account' : 'Suspend Account' }}
            </button>
            <button @click="detailModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors ml-auto">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <Transition name="fade">
      <div v-if="toast.show" class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium" :class="toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'">
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth-admin'],
})

const supabase = useSupabaseClient()

const users = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const detailModal = ref(false)
const selectedUser = ref<any>(null)
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

const filteredUsers = computed(() => {
  let result = users.value
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  }
  if (roleFilter.value) result = result.filter(u => (u.role || '') === roleFilter.value)
  if (statusFilter.value) result = result.filter(u => (u.status || 'active') === statusFilter.value)
  return result
})

function countByRole(role: string) { return users.value.filter(u => u.role === role).length }
function countByStatus(status: string) { return users.value.filter(u => (u.status || 'active') === status).length }

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

function getProfileImageUrl(user: any): string | null {
  // For sellers, prefer logo from seller_profiles
  if (user.role === 'seller' && user.logo_url) {
    if (user.logo_url.startsWith('http')) return user.logo_url
    const { data } = supabase.storage.from('logos').getPublicUrl(user.logo_url)
    return data?.publicUrl || null
  }
  // For buyers and others, use avatar_url from profile table
  if (user.avatar_url) {
    if (user.avatar_url.startsWith('http')) return user.avatar_url
    const { data } = supabase.storage.from('avatars').getPublicUrl(user.avatar_url)
    return data?.publicUrl || null
  }
  return null
}

function getRoleClass(role: string | null): string {
  switch (role) {
    case 'seller': return 'bg-indigo-100 text-indigo-700'
    case 'admin': return 'bg-rose-100 text-rose-700'
    default: return 'bg-sky-100 text-sky-700'
  }
}

function getUserStatusClass(status: string | null): string {
  switch ((status || '').toLowerCase()) {
    case 'active': return 'bg-emerald-100 text-emerald-700'
    case 'suspended': return 'bg-red-100 text-red-700'
    case 'pending': return 'bg-amber-100 text-amber-700'
    default: return 'bg-emerald-100 text-emerald-700'
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

async function fetchUsers() {
  loading.value = true
  error.value = null
  try {
    const [profilesRes, identityRes, sellerRes] = await Promise.all([
      supabase.from('profiles').select('id,email,role,status,created_at').order('created_at', { ascending: false }),
      supabase.from('profile').select('user_id,name,phone,avatar_url'),
      supabase.from('seller_profiles').select('user_id,store_name,logo_url'),
    ])
    if (profilesRes.error) throw profilesRes.error

    const identityMap = new Map<string, any>()
    for (const row of identityRes.data || []) {
      identityMap.set(row.user_id, row)
    }

    const sellerMap = new Map<string, any>()
    for (const row of sellerRes.data || []) {
      sellerMap.set(row.user_id, row)
    }

    users.value = (profilesRes.data || []).map(u => {
      const identity = identityMap.get(u.id)
      const seller = sellerMap.get(u.id)
      return {
        ...u,
        name: identity?.name || null,
        phone: identity?.phone || null,
        avatar_url: identity?.avatar_url || null,
        store_name: seller?.store_name || null,
        logo_url: seller?.logo_url || null,
      }
    })
  } catch (e: any) {
    error.value = e?.message || 'Failed to load users'
  } finally {
    loading.value = false
  }
}

function openUserDetail(user: any) {
  selectedUser.value = user
  detailModal.value = true
}

async function toggleSuspend(user: any) {
  const newStatus = user.status === 'suspended' ? 'active' : 'suspended'
  try {
    const { error: err } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', user.id)
    if (err) throw err
    const idx = users.value.findIndex(u => u.id === user.id)
    if (idx !== -1) users.value[idx] = { ...users.value[idx], status: newStatus }
    showToast(`User ${newStatus === 'suspended' ? 'suspended' : 'activated'} successfully`)
  } catch (e: any) {
    showToast(e?.message || 'Failed to update user status', 'error')
  }
}

onMounted(() => fetchUsers())
</script>
