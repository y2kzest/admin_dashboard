<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Pickup Schedules</h1>
      <button @click="fetchSchedules" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-slate-500 mb-1">Total Pickups</p>
        <p class="text-xl font-bold text-slate-800">{{ schedules.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-amber-500 mb-1">Scheduled</p>
        <p class="text-xl font-bold text-amber-600">{{ countByStatus('scheduled') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-emerald-500 mb-1">Completed</p>
        <p class="text-xl font-bold text-emerald-600">{{ countByStatus('completed') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-red-500 mb-1">Missed / Cancelled</p>
        <p class="text-xl font-bold text-red-600">{{ countByStatus('missed') + countByStatus('cancelled') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search by buyer, seller, or order ID..." class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
      </div>
      <select v-model="statusFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All Statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="missed">Missed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input v-model="dateFilter" type="date" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"/>
    </div>

    <!-- Setup Banner -->
    <div v-if="tableNotFound" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 mb-4">
      <strong>Pickup schedules table not found.</strong> Run the provided SQL migration in your Supabase project to enable pickup tracking.
    </div>

    <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        Loading schedules...
      </div>
      <div v-else-if="error && !tableNotFound" class="flex items-center justify-center py-16 text-red-500 text-sm">{{ error }}</div>
      <table v-else class="min-w-full divide-y divide-slate-100">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Buyer</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pickup Date</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pickup Time</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-if="filteredSchedules.length === 0">
            <td colspan="8" class="px-5 py-12 text-center text-sm text-slate-400">
              {{ tableNotFound ? 'Run the SQL migration to create the pickup_schedules table.' : 'No pickup schedules found.' }}
            </td>
          </tr>
          <tr v-for="schedule in filteredSchedules" :key="schedule.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-3.5 text-sm font-mono text-slate-600">#{{ (schedule.order_id || schedule.id || '').slice(0, 8) }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-700">{{ schedule.buyer_name || schedule.buyer_id?.slice(0, 8) || '—' }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-600">{{ schedule.seller_name || schedule.seller_id?.slice(0, 8) || '—' }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-700">{{ formatDate(schedule.pickup_date) }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-600">{{ schedule.pickup_time || schedule.time_slot || '—' }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-600 max-w-xs truncate">{{ schedule.location || schedule.stall_number || schedule.pickup_location || '—' }}</td>
            <td class="px-5 py-3.5">
              <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getPickupStatusClass(schedule.status)">
                {{ formatStatus(schedule.status) }}
              </span>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <button @click="openDetail(schedule)" class="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors">
                  View
                </button>
                <button
                  v-if="schedule.status === 'scheduled'"
                  @click="markCompleted(schedule)"
                  class="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors"
                >
                  Mark Done
                </button>
                <button
                  v-if="schedule.status === 'scheduled'"
                  @click="markMissed(schedule)"
                  class="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors"
                >
                  Missed
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="detailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="detailModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">Pickup Details</h3>
            <button @click="detailModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div v-if="selectedSchedule" class="px-6 py-5 space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Pickup ID</p>
                <p class="font-mono text-xs text-slate-600 break-all">{{ selectedSchedule.id }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Status</p>
                <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getPickupStatusClass(selectedSchedule.status)">
                  {{ formatStatus(selectedSchedule.status) }}
                </span>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Order ID</p>
                <p class="font-mono font-medium text-slate-700">{{ selectedSchedule.order_id || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Pickup Date</p>
                <p class="font-medium text-slate-700">{{ formatDate(selectedSchedule.pickup_date) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Time Slot</p>
                <p class="font-medium text-slate-700">{{ selectedSchedule.pickup_time || selectedSchedule.time_slot || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Location</p>
                <p class="font-medium text-slate-700">{{ selectedSchedule.location || selectedSchedule.stall_number || selectedSchedule.pickup_location || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Buyer</p>
                <p class="font-medium text-slate-700">{{ selectedSchedule.buyer_name || selectedSchedule.buyer_id || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-0.5">Seller</p>
                <p class="font-medium text-slate-700">{{ selectedSchedule.seller_name || selectedSchedule.seller_id || '—' }}</p>
              </div>
              <div v-if="selectedSchedule.notes" class="col-span-2">
                <p class="text-xs text-slate-400 mb-0.5">Notes</p>
                <p class="font-medium text-slate-700">{{ selectedSchedule.notes }}</p>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end">
            <button @click="detailModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Close</button>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth-admin'],
})

const supabase = useSupabaseClient()

const schedules = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const tableNotFound = ref(false)
const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const detailModal = ref(false)
const selectedSchedule = ref<any>(null)
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer: ReturnType<typeof setTimeout> | null = null
let channel: any = null

const filteredSchedules = computed(() => {
  let result = schedules.value
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(s =>
      (s.id || '').toLowerCase().includes(q) ||
      (s.order_id || '').toLowerCase().includes(q) ||
      (s.buyer_name || '').toLowerCase().includes(q) ||
      (s.seller_name || '').toLowerCase().includes(q) ||
      (s.location || '').toLowerCase().includes(q)
    )
  }
  if (statusFilter.value) result = result.filter(s => (s.status || '') === statusFilter.value)
  if (dateFilter.value) result = result.filter(s => {
    if (!s.pickup_date) return false
    return s.pickup_date.startsWith(dateFilter.value)
  })
  return result
})

function countByStatus(status: string): number {
  return schedules.value.filter(s => (s.status || '').toLowerCase() === status).length
}

function formatStatus(status: string | null): string {
  const s = (status || 'scheduled').replace(/_/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getPickupStatusClass(status: string | null): string {
  switch ((status || '').toLowerCase()) {
    case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'missed': return 'bg-red-100 text-red-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
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

// Try both common table names for pickup schedules
async function fetchSchedules() {
  loading.value = true
  error.value = null
  tableNotFound.value = false
  try {
    let data: any[] = []
    // Try pickup_schedules first, then fallback to pickups
    const res1 = await supabase.from('pickup_schedules').select('*').order('pickup_date', { ascending: true })
    if (res1.error) {
      if (res1.error.code === '42P01') {
        const res2 = await supabase.from('pickups').select('*').order('pickup_date', { ascending: true })
        if (res2.error) {
          if (res2.error.code === '42P01') { tableNotFound.value = true; return }
          throw res2.error
        }
        data = res2.data || []
      } else {
        throw res1.error
      }
    } else {
      data = res1.data || []
    }
    schedules.value = data
  } catch (e: any) {
    error.value = e?.message || 'Failed to load schedules'
  } finally {
    loading.value = false
  }
}

function openDetail(schedule: any) {
  selectedSchedule.value = schedule
  detailModal.value = true
}

async function updatePickupStatus(schedule: any, newStatus: string) {
  try {
    // Determine actual table name
    const { data: tbl } = await supabase.from('pickup_schedules').select('id').limit(1)
    const tableName = tbl !== null ? 'pickup_schedules' : 'pickups'
    const { error: err } = await (supabase as any).from(tableName).update({ status: newStatus }).eq('id', schedule.id)
    if (err) throw err
    const idx = schedules.value.findIndex(s => s.id === schedule.id)
    if (idx !== -1) schedules.value[idx] = { ...schedules.value[idx], status: newStatus }
    showToast(`Pickup marked as ${newStatus}`)
  } catch (e: any) {
    showToast(e?.message || 'Failed to update', 'error')
  }
}

function markCompleted(schedule: any) { updatePickupStatus(schedule, 'completed') }
function markMissed(schedule: any) { updatePickupStatus(schedule, 'missed') }

function startRealtime() {
  channel = supabase
    .channel('admin-pickups-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pickup_schedules' }, () => fetchSchedules())
    .subscribe()
}

onMounted(() => {
  fetchSchedules()
  startRealtime()
})

onBeforeUnmount(() => {
  if (channel) supabase.removeChannel(channel)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
