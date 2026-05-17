<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
      <span class="text-sm text-slate-400">{{ todayLabel }}</span>
    </div>

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Total Vendors</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.totalVendors }}</p>
          <p class="text-xs text-slate-400 mt-1">Registered sellers</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Active Vendors</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.activeVendors }}</p>
          <p class="text-xs text-emerald-500 mt-1">Approved accounts</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Pending Vendors</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.pendingVendors }}</p>
          <p class="text-xs text-amber-500 mt-1">Awaiting approval</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Total Orders</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.totalOrders }}</p>
          <p class="text-xs text-sky-500 mt-1">All time orders</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Total Users</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.totalUsers }}</p>
          <p class="text-xs text-slate-400 mt-1">Buyers & sellers</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Total Revenue</p>
          <div v-if="loading" class="skeleton h-7 w-28 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ formatCurrency(displayStats.totalRevenue) }}</p>
          <p class="text-xs text-green-500 mt-1">From completed orders</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l12 6"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Total Products</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.totalProducts }}</p>
          <p class="text-xs text-slate-400 mt-1">Listed on platform</p>
        </div>
      </div>

      <div class="card-lift bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-start gap-4">
        <div class="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm text-slate-500 mb-0.5">Pending Orders</p>
          <div v-if="loading" class="skeleton h-7 w-16 mt-1"></div>
          <p v-else class="text-2xl font-bold text-slate-800 tabular-nums">{{ displayStats.pendingOrders }}</p>
          <p class="text-xs text-orange-500 mt-1">Needs attention</p>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
      <!-- Order Status Breakdown -->
      <div class="xl:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 class="text-base font-semibold text-slate-700 mb-4">Order Status</h2>
        <div class="space-y-3">
          <div v-for="item in orderStatusBreakdown" :key="item.label">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-600">{{ item.label }}</span>
              <span class="font-semibold text-slate-700">{{ item.count }}</span>
            </div>
            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="item.color"
                :style="{ width: stats.totalOrders > 0 ? (item.count / stats.totalOrders * 100) + '%' : '0%' }"
              ></div>
            </div>
          </div>
          <div v-if="stats.totalOrders === 0" class="text-sm text-slate-400 text-center py-4">No order data yet</div>
        </div>
      </div>

      <!-- Top Sellers -->
      <div class="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h2 class="text-base font-semibold text-slate-700 mb-4">Top Performing Sellers</h2>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3">
            <div class="skeleton h-7 w-7 rounded-lg flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="skeleton h-3.5 w-40"></div>
              <div class="skeleton h-3 w-24"></div>
            </div>
            <div class="skeleton h-6 w-20 rounded-lg"></div>
          </div>
        </div>
        <div v-else-if="topSellers.length === 0" class="flex items-center justify-center h-32 text-slate-400 text-sm">No seller data available</div>
        <div v-else class="space-y-3">
          <div v-for="(seller, idx) in topSellers" :key="seller.id" class="flex items-center gap-3">
            <div class="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-500'">
              {{ idx + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">{{ seller.name }}</p>
              <p class="text-xs text-slate-400 truncate">{{ seller.category || 'General' }}</p>
            </div>
            <span class="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-50 text-slate-600 flex-shrink-0">
              {{ seller.products }} products
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <!-- Recent Orders -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-slate-700">Recent Orders</h2>
          <NuxtLink to="/orders" class="text-xs text-indigo-600 hover:underline font-medium">View all</NuxtLink>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div class="flex-1 space-y-1.5">
              <div class="skeleton h-3.5 w-24"></div>
              <div class="skeleton h-3 w-40"></div>
            </div>
            <div class="flex items-center gap-2">
              <div class="skeleton h-4 w-16"></div>
              <div class="skeleton h-5 w-16 rounded-full"></div>
            </div>
          </div>
        </div>
        <div v-else-if="recentOrders.length === 0" class="text-sm text-slate-400 text-center py-6">No orders yet</div>
        <div v-else class="space-y-3">
          <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">#{{ order.id?.slice(0, 8) }}</p>
              <p class="text-xs text-slate-400 truncate">{{ order.buyer_name || 'Buyer' }} • {{ formatDate(order.created_at) }}</p>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-sm font-semibold text-slate-700">{{ formatCurrency(order.total_amount ?? 0) }}</span>
              <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="getOrderStatusClass(order.status)">
                {{ order.status || 'pending' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Vendors -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-slate-700">Recently Registered Vendors</h2>
          <NuxtLink to="/vendor-management" class="text-xs text-indigo-600 hover:underline font-medium">View all</NuxtLink>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
            <div class="skeleton h-8 w-8 rounded-lg flex-shrink-0"></div>
            <div class="flex-1 space-y-1.5">
              <div class="skeleton h-3.5 w-32"></div>
              <div class="skeleton h-3 w-44"></div>
            </div>
            <div class="skeleton h-5 w-20 rounded-full"></div>
          </div>
        </div>
        <div v-else-if="recentVendors.length === 0" class="text-sm text-slate-400 text-center py-6">No vendor data available</div>
        <div v-else class="space-y-3">
          <div v-for="vendor in recentVendors" :key="vendor.id" class="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
            <div class="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
              {{ (vendor.store_name || vendor.full_name || 'V').charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-700 truncate">{{ vendor.store_name || vendor.full_name || 'Unknown Vendor' }}</p>
              <p class="text-xs text-slate-400 truncate">{{ vendor.category || 'No category' }} • {{ formatDate(vendor.created_at) }}</p>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0" :class="vendor.approval_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : vendor.approval_status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'">
              {{ vendor.approval_status || 'pending' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  middleware: ['auth-admin'],
  layout: 'default',
})

const supabase = useSupabaseClient()

const loading = ref(true)
const stats = ref({
  totalVendors: 0,
  activeVendors: 0,
  pendingVendors: 0,
  totalOrders: 0,
  pendingOrders: 0,
  completedOrders: 0,
  cancelledOrders: 0,
  totalRevenue: 0,
  totalProducts: 0,
  totalUsers: 0,
})
const topSellers = ref<any[]>([])
const recentOrders = ref<any[]>([])
const recentVendors = ref<any[]>([])

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
})

const orderStatusBreakdown = computed(() => [
  { label: 'Completed', count: stats.value.completedOrders, color: 'bg-emerald-500' },
  { label: 'Pending', count: stats.value.pendingOrders, color: 'bg-amber-400' },
  { label: 'Cancelled', count: stats.value.cancelledOrders, color: 'bg-red-400' },
])

function formatCurrency(amount: number): string {
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getOrderStatusClass(status: string | null): string {
  switch ((status || '').toLowerCase()) {
    case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'cancelled': return 'bg-red-100 text-red-700'
    default: return 'bg-amber-100 text-amber-700'
  }
}

async function fetchDashboardData() {
  loading.value = true
  try {
    const [vendorRes, productRes, profileRes, allOrdersRes] = await Promise.all([
      supabase.from('seller_profiles').select('id,user_id,store_name,full_name,approval_status,category,created_at', { count: 'exact' }).order('created_at', { ascending: false }),
      supabase.from('product').select('id,user_id', { count: 'exact' }),
      supabase.from('profiles').select('id,email,full_name,role,status', { count: 'exact' }),
      supabase.from('orders').select('id,total_amount,status,created_at,buyer_id', { count: 'exact' }).order('created_at', { ascending: false }),
    ])

    // Vendors
    const vendors = vendorRes.data || []
    stats.value.totalVendors = vendorRes.count ?? vendors.length
    stats.value.activeVendors = vendors.filter(v => v.approval_status === 'approved').length
    stats.value.pendingVendors = vendors.filter(v => v.approval_status === 'pending').length
    recentVendors.value = vendors.slice(0, 5)

    // Products — total count + per-seller breakdown for top sellers
    const productRows = (productRes.data || []) as Array<{ id: string; user_id: string | null }>
    const productCountByUser = new Map<string, number>()
    for (const row of productRows) {
      if (!row.user_id) continue
      productCountByUser.set(row.user_id, (productCountByUser.get(row.user_id) ?? 0) + 1)
    }

    topSellers.value = vendors
      .filter(v => v.approval_status === 'approved')
      .map(v => ({
        id: v.id,
        name: v.store_name || v.full_name || 'Unknown',
        category: v.category,
        products: productCountByUser.get(v.user_id) ?? 0,
      }))
      .sort((a, b) => b.products - a.products)
      .slice(0, 5)

    stats.value.totalProducts = productRes.count ?? productRows.length

    // Users (profiles) — keep an id→name lookup so recent orders can show a real buyer
    const profileRows = (profileRes.data || []) as Array<{ id: string; email: string | null; full_name: string | null }>
    stats.value.totalUsers = profileRes.count ?? profileRows.length
    const buyerNameById = new Map<string, string>()
    for (const row of profileRows) {
      const label = (row.full_name?.trim()) || (row.email?.split('@')[0]) || ''
      if (label) buyerNameById.set(row.id, label)
    }

    // Orders (single fetch — derive recent + breakdown from the same dataset)
    if (!allOrdersRes.error) {
      const allOrders = allOrdersRes.data || []
      stats.value.totalOrders = allOrdersRes.count ?? allOrders.length
      stats.value.pendingOrders = allOrders.filter(o => (o.status || '').toLowerCase() === 'pending').length
      stats.value.completedOrders = allOrders.filter(o => (o.status || '').toLowerCase() === 'completed').length
      stats.value.cancelledOrders = allOrders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length
      stats.value.totalRevenue = allOrders
        .filter(o => (o.status || '').toLowerCase() === 'completed')
        .reduce((sum, o) => sum + (o.total_amount ?? 0), 0)
      recentOrders.value = allOrders.slice(0, 5).map(o => ({
        ...o,
        buyer_name: o.buyer_id ? (buyerNameById.get(o.buyer_id) ?? null) : null,
      }))
    }
  } catch (e) {
    console.error('[dashboard] fetch error:', e)
  } finally {
    loading.value = false
    animateStats()
  }
}

// Animated count-up for stat cards. Starts from 0 once data loads.
const displayStats = ref({
  totalVendors: 0, activeVendors: 0, pendingVendors: 0,
  totalOrders: 0, pendingOrders: 0,
  totalRevenue: 0, totalProducts: 0, totalUsers: 0,
})

function animateStats() {
  const targets = stats.value
  const duration = 700
  const start = performance.now()
  const initial = { ...displayStats.value }
  // ease-out cubic
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)
  function step(now: number) {
    const t = Math.min(1, (now - start) / duration)
    const e = ease(t)
    displayStats.value = {
      totalVendors: Math.round(initial.totalVendors + (targets.totalVendors - initial.totalVendors) * e),
      activeVendors: Math.round(initial.activeVendors + (targets.activeVendors - initial.activeVendors) * e),
      pendingVendors: Math.round(initial.pendingVendors + (targets.pendingVendors - initial.pendingVendors) * e),
      totalOrders: Math.round(initial.totalOrders + (targets.totalOrders - initial.totalOrders) * e),
      pendingOrders: Math.round(initial.pendingOrders + (targets.pendingOrders - initial.pendingOrders) * e),
      totalRevenue: initial.totalRevenue + (targets.totalRevenue - initial.totalRevenue) * e,
      totalProducts: Math.round(initial.totalProducts + (targets.totalProducts - initial.totalProducts) * e),
      totalUsers: Math.round(initial.totalUsers + (targets.totalUsers - initial.totalUsers) * e),
    }
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  fetchDashboardData()
})
</script>
