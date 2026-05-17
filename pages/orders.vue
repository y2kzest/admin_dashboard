<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Order Management</h1>
      <button @click="fetchOrders" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        Refresh
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-slate-500 mb-1">Total Orders</p>
        <p class="text-xl font-bold text-slate-800">{{ orders.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-amber-500 mb-1">Pending</p>
        <p class="text-xl font-bold text-amber-600">{{ countByStatus('pending') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-emerald-500 mb-1">Completed</p>
        <p class="text-xl font-bold text-emerald-600">{{ countByStatus('completed') }}</p>
      </div>
      <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p class="text-xs text-red-500 mb-1">Cancelled</p>
        <p class="text-xl font-bold text-red-600">{{ countByStatus('cancelled') }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search by order ID or buyer..." class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
      </div>
      <select v-model="statusFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="ready_for_pickup">Ready for Pickup</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select v-model="dateFilter" class="py-2 px-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
        <option value="">All Dates</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>

    <!-- Table / Setup Banner -->
    <div v-if="tableNotFound" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 mb-4">
      <strong>Orders table not found.</strong> Run the provided SQL migration in Supabase to enable order tracking.
    </div>

    <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
        Loading orders...
      </div>
      <div v-else-if="error && !tableNotFound" class="flex items-center justify-center py-16 text-red-500 text-sm">{{ error }}</div>
      <table v-else class="min-w-full divide-y divide-slate-100">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Buyer</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Seller</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-if="filteredOrders.length === 0">
            <td colspan="8" class="px-5 py-12 text-center text-sm text-slate-400">
              {{ tableNotFound ? 'Run the SQL migration to create the orders table.' : 'No orders found.' }}
            </td>
          </tr>
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-slate-50 transition-colors">
            <!-- Product image + name -->
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="h-10 w-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <img
                    v-if="getProductImage(order.product_name)"
                    :src="getProductImage(order.product_name) || ''"
                    :alt="order.product_name"
                    class="h-full w-full object-cover"
                  />
                  <svg v-else class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-700 truncate max-w-[140px]">{{ order.product_name || '—' }}</p>
                  <p v-if="order.qty" class="text-xs text-slate-400">Qty: {{ order.qty }}</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-3.5 text-sm font-mono text-slate-600">#{{ order.id?.slice(0, 8) }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-700">{{ order.buyer_name || order.buyer_id?.slice(0, 8) || '—' }}</td>
            <td class="px-5 py-3.5 text-sm text-slate-600">{{ order.seller_name || order.seller_id?.slice(0, 8) || '—' }}</td>
            <td class="px-5 py-3.5 text-sm font-semibold text-slate-700">₱{{ (order.total_amount ?? order.price ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
            <td class="px-5 py-3.5">
              <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getStatusClass(order.status)">
                {{ formatStatus(order.status) }}
              </span>
            </td>
            <td class="px-5 py-3.5 text-sm text-slate-500">{{ formatDate(order.created_at) }}</td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2">
                <button @click="openDetails(order)" class="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors">
                  View
                </button>
                <button
                  v-if="order.status === 'pending'"
                  @click="updateStatus(order, 'confirmed')"
                  class="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium transition-colors"
                >
                  Confirm
                </button>
                <button
                  v-if="order.status !== 'cancelled' && order.status !== 'completed'"
                  @click="updateStatus(order, 'cancelled')"
                  class="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Detail Modal -->
    <Teleport to="body">
      <div v-if="detailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="detailModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">Order Details</h3>
            <button @click="detailModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div v-if="selectedOrder" class="px-6 py-5 space-y-4">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-slate-400 text-xs mb-0.5">Order ID</p>
                <p class="font-mono font-medium text-slate-700">{{ selectedOrder.id }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs mb-0.5">Status</p>
                <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="getStatusClass(selectedOrder.status)">
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
              <div>
                <p class="text-slate-400 text-xs mb-0.5">Buyer ID</p>
                <p class="font-medium text-slate-700">{{ selectedOrder.buyer_id || '—' }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs mb-0.5">Seller ID</p>
                <p class="font-medium text-slate-700">{{ selectedOrder.seller_id || '—' }}</p>
              </div>
              <div>
                <p class="text-slate-400 text-xs mb-0.5">Total Amount</p>
                <p class="text-lg font-bold text-slate-800">₱{{ (selectedOrder.total_amount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
                <p v-if="(selectedOrder.delivery_fee ?? 0) > 0" class="text-xs text-slate-400 mt-0.5">
                  incl. ₱{{ Number(selectedOrder.delivery_fee).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }} delivery
                </p>
              </div>
              <div>
                <p class="text-slate-400 text-xs mb-0.5">Date</p>
                <p class="font-medium text-slate-700">{{ formatDate(selectedOrder.created_at) }}</p>
              </div>
              <div v-if="(selectedOrder.delivery_fee ?? 0) > 0 || selectedOrder.delivery_address">
                <p class="text-slate-400 text-xs mb-0.5">Delivery Fee</p>
                <p class="font-medium text-slate-700">₱{{ Number(selectedOrder.delivery_fee ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</p>
              </div>
              <div v-if="selectedOrder.delivery_address">
                <p class="text-slate-400 text-xs mb-0.5">Delivery Address</p>
                <p class="font-medium text-slate-700 break-words">{{ selectedOrder.delivery_address }}</p>
              </div>
            </div>

            <!-- Order Items -->
            <div v-if="orderItems.length > 0">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Items</p>
              <div class="space-y-2">
                <div v-for="item in orderItems" :key="item.id" class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div class="h-10 w-10 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <img
                      v-if="getProductImage(item.product_name)"
                      :src="getProductImage(item.product_name) || ''"
                      :alt="item.product_name"
                      class="h-full w-full object-cover"
                    />
                    <svg v-else class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-slate-700 font-medium truncate">{{ item.product_name || 'Product' }}</p>
                    <p class="text-xs text-slate-400">× {{ item.quantity }}</p>
                  </div>
                  <span class="text-sm font-medium text-slate-700 flex-shrink-0">₱{{ ((item.price ?? 0) * (item.quantity ?? 1)).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
                </div>
              </div>
            </div>
            <!-- Fallback: single-product order from orders table itself -->
            <div v-else-if="selectedOrder.product_name">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Item</p>
              <div class="flex items-center gap-3 py-2">
                <div class="h-12 w-12 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <img
                    v-if="getProductImage(selectedOrder.product_name)"
                    :src="getProductImage(selectedOrder.product_name) || ''"
                    :alt="selectedOrder.product_name"
                    class="h-full w-full object-cover"
                  />
                  <svg v-else class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-slate-700">{{ selectedOrder.product_name }}</p>
                  <p class="text-xs text-slate-400">Qty: {{ selectedOrder.qty }}</p>
                </div>
                <span class="text-sm font-semibold text-slate-700">₱{{ (selectedOrder.price ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</span>
              </div>
            </div>

            <div v-if="selectedOrder.notes" class="bg-slate-50 rounded-xl p-3">
              <p class="text-xs text-slate-400 mb-1">Notes</p>
              <p class="text-sm text-slate-700">{{ selectedOrder.notes }}</p>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button @click="detailModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Close</button>
            <button
              v-if="selectedOrder?.status === 'pending'"
              @click="updateStatus(selectedOrder, 'confirmed'); detailModal = false"
              class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Confirm Order
            </button>
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

const orders = ref<any[]>([])
const orderItems = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const tableNotFound = ref(false)
const search = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const detailModal = ref(false)
const selectedOrder = ref<any>(null)
const toast = ref({ show: false, message: '', type: 'success' })
// product_name (lowercase) → resolved public image URL
const productImageMap = ref<Map<string, string>>(new Map())
let toastTimer: ReturnType<typeof setTimeout> | null = null
let channel: any = null

const filteredOrders = computed(() => {
  let result = orders.value

  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    result = result.filter(o =>
      (o.id || '').toLowerCase().includes(q) ||
      (o.buyer_name || '').toLowerCase().includes(q) ||
      (o.seller_name || '').toLowerCase().includes(q)
    )
  }

  if (statusFilter.value) {
    result = result.filter(o => (o.status || '').toLowerCase() === statusFilter.value)
  }

  if (dateFilter.value) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    result = result.filter(o => {
      if (!o.created_at) return false
      const d = new Date(o.created_at)
      if (dateFilter.value === 'today') return d >= today
      if (dateFilter.value === 'week') {
        const weekStart = new Date(today)
        weekStart.setDate(today.getDate() - today.getDay())
        return d >= weekStart
      }
      if (dateFilter.value === 'month') {
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
      }
      return true
    })
  }

  return result
})

function countByStatus(status: string): number {
  return orders.value.filter(o => (o.status || '').toLowerCase() === status).length
}

function formatStatus(status: string | null): string {
  const s = (status || 'pending').replace(/_/g, ' ')
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function getStatusClass(status: string | null): string {
  switch ((status || '').toLowerCase()) {
    case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'confirmed': return 'bg-sky-100 text-sky-700'
    case 'ready_for_pickup': return 'bg-indigo-100 text-indigo-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

function getProductImage(productName: string | null): string | null {
  if (!productName) return null
  return productImageMap.value.get(productName.toLowerCase().trim()) || null
}

async function fetchProductImages() {
  try {
    const { data } = await supabase.from('product').select('name,image_url')
    const map = new Map<string, string>()
    for (const p of data || []) {
      if (!p.name || !p.image_url) continue
      let url = p.image_url
      if (!url.startsWith('http')) {
        const { data: storageData } = supabase.storage.from('products').getPublicUrl(url)
        url = storageData?.publicUrl || ''
      }
      if (url) map.set(p.name.toLowerCase().trim(), url)
    }
    productImageMap.value = map
  } catch { /* non-critical */ }
}

async function fetchOrders() {
  loading.value = true
  error.value = null
  tableNotFound.value = false
  try {
    const { data, error: err } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (err) {
      if (err.code === '42P01') { tableNotFound.value = true; return }
      throw err
    }
    orders.value = data || []
  } catch (e: any) {
    error.value = e?.message || 'Failed to load orders'
  } finally {
    loading.value = false
  }
}

async function openDetails(order: any) {
  selectedOrder.value = order
  detailModal.value = true
  orderItems.value = []
  try {
    const { data } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)
    orderItems.value = data || []
  } catch { /* order_items table might not exist */ }
}

async function updateStatus(order: any, newStatus: string) {
  try {
    const { error: err } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)
    if (err) throw err
    const idx = orders.value.findIndex(o => o.id === order.id)
    if (idx !== -1) orders.value[idx] = { ...orders.value[idx], status: newStatus }
    if (selectedOrder.value?.id === order.id) selectedOrder.value = { ...selectedOrder.value, status: newStatus }
    showToast(`Order status updated to ${newStatus}`)
  } catch (e: any) {
    showToast(e?.message || 'Failed to update status', 'error')
  }
}

function startRealtime() {
  channel = supabase
    .channel('admin-orders-live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      fetchOrders()
    })
    .subscribe()
}

onMounted(() => {
  fetchProductImages()
  fetchOrders()
  startRealtime()
})

onBeforeUnmount(() => {
  if (channel) supabase.removeChannel(channel)
  if (toastTimer) clearTimeout(toastTimer)
})
</script>
