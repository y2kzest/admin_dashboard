<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Product & Service Management</h1>
    
    <div class="flex items-center justify-between mb-6 space-x-4">
      
      <div class="relative flex-grow">
        <input 
          type="text" 
          placeholder="Search Product" 
          v-model="search"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
      </div>
      
      <button class="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md" @click="fetchProducts">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Refresh
      </button>
    </div>
    
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">

          <tr v-if="loading">
            <td colspan="5" class="px-6 py-6 text-sm text-gray-500">Loading products...</td>
          </tr>

          <tr v-else-if="error">
            <td colspan="5" class="px-6 py-6 text-sm text-red-600">{{ error }}</td>
          </tr>

          <tr v-else-if="filteredProducts.length === 0">
            <td colspan="5" class="px-6 py-6 text-sm text-gray-500">No products found.</td>
          </tr>
          
          <tr
            v-else
            v-for="product in filteredProducts"
            :key="product.id"
            :class="[
              'transition-colors',
              isRecentlyAdded(product.id) ? 'bg-emerald-50 hover:bg-emerald-100' : 'hover:bg-gray-50'
            ]"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              <div class="flex items-center gap-2">
                <span>{{ product.name }}</span>
                <span
                  v-if="isRecentlyAdded(product.id)"
                  class="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700"
                >
                  New
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.unit_type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusBadgeClass(product)">
                {{ getProductStatus(product) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">View</button>
              <button class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition-colors" @click="removeProduct(product)">Remove</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <div
      v-if="toast.show"
      class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium bg-emerald-600 text-white"
    >
      {{ toast.message }}
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Database } from '~/types/database.types'

definePageMeta({
  layout: 'default',
  middleware: ['auth-admin'],
})

type Product = Database['public']['Tables']['product']['Row']

const supabase = useSupabaseClient<Database>()

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null
let toastTimer: ReturnType<typeof setTimeout> | null = null
const recentProductIds = ref<string[]>([])
const recentProductTimers: Record<string, ReturnType<typeof setTimeout>> = {}
const toast = ref({ show: false, message: '' })

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter(p => {
    return (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.unit_type || '').toLowerCase().includes(q)
    )
  })
})

function getProductStatus(product: Product): string {
  return product.stock_quantity > 0 ? 'Active' : 'Out of stock'
}

function getStatusBadgeClass(product: Product): string {
  return product.stock_quantity > 0
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}

async function fetchProducts() {
  loading.value = true
  error.value = null
  try {
    const { data, error: err } = await supabase
      .from('product')
      .select('*')
      .order('name', { ascending: true })

    if (err) throw err
    products.value = data || []
  } catch (e: any) {
    error.value = e?.message || 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function showToast(message: string) {
  toast.value = { show: true, message }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

function markAsRecent(productId: string) {
  if (!productId) return

  if (!recentProductIds.value.includes(productId)) {
    recentProductIds.value = [productId, ...recentProductIds.value].slice(0, 30)
  }

  if (recentProductTimers[productId]) {
    clearTimeout(recentProductTimers[productId])
  }

  recentProductTimers[productId] = setTimeout(() => {
    recentProductIds.value = recentProductIds.value.filter(id => id !== productId)
    delete recentProductTimers[productId]
  }, 20000)
}

function isRecentlyAdded(productId: string): boolean {
  return recentProductIds.value.includes(productId)
}

function startLiveUpdates() {
  const channel = supabase
    .channel('admin-products-live')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'product' },
      (payload: any) => {
        if (payload?.eventType === 'INSERT' && payload?.new?.id) {
          markAsRecent(payload.new.id)
          showToast(`New item added: ${payload.new.name || 'Unnamed product'}`)
        }
        fetchProducts()
      }
    )
    .subscribe()

  // Realtime channel handles live updates; no polling needed.

  return channel
}

async function removeProduct(product: Product) {
  const ok = confirm(`Remove ${product.name}?`)
  if (!ok) return

  // Use .select() so Supabase returns the rows it actually deleted.
  // Without it, RLS silently blocks the delete (returns no error, 0 rows affected)
  // and the code would still filter the product out of local state optimistically,
  // making it appear deleted until the next page reload.
  const { data: deleted, error: err } = await supabase
    .from('product')
    .delete()
    .eq('id', product.id)
    .select('id')

  if (err) {
    showToast(`Failed to remove product: ${err.message}`)
    return
  }

  if (!deleted || deleted.length === 0) {
    showToast('Could not remove product — permission denied or product no longer exists.')
    return
  }

  products.value = products.value.filter(p => p.id !== product.id)
  showToast(`"${product.name}" removed successfully.`)
}

let productsChannel: ReturnType<typeof startLiveUpdates> | null = null

onMounted(async () => {
  await fetchProducts()
  productsChannel = startLiveUpdates()
})

onBeforeUnmount(() => {
  if (productsChannel) {
    supabase.removeChannel(productsChannel)
    productsChannel = null
  }
  if (toastTimer) {
    clearTimeout(toastTimer)
    toastTimer = null
  }

  Object.values(recentProductTimers).forEach(timer => clearTimeout(timer))
})
</script>