<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Product & Service Management</h1>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3 mb-6">
      <div class="relative flex-grow min-w-[200px]">
        <input
          type="text"
          placeholder="Search by name, category..."
          v-model="search"
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
      </div>

      <select v-model="categoryFilter" class="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white">
        <option value="">All Categories</option>
        <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
      </select>

      <select v-model="statusFilter" class="py-2 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="out_of_stock">Out of Stock</option>
        <option value="featured">Today's Picks</option>
      </select>

      <button class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium" @click="fetchProducts">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        Refresh
      </button>
    </div>

    <!-- Stats bar -->
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      <div v-for="cat in CATEGORIES" :key="cat" class="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 text-center">
        <p class="text-xs text-gray-500 mb-0.5">{{ cat }}</p>
        <p class="text-lg font-bold text-gray-800">{{ countByCategory(cat) }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-14">Image</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pick</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
            <td colspan="8" class="px-5 py-8 text-sm text-gray-400 text-center">Loading products...</td>
          </tr>
          <tr v-else-if="error">
            <td colspan="8" class="px-5 py-8 text-sm text-red-500 text-center">{{ error }}</td>
          </tr>
          <tr v-else-if="filteredProducts.length === 0">
            <td colspan="8" class="px-5 py-8 text-sm text-gray-400 text-center">No products found.</td>
          </tr>
          <tr
            v-else
            v-for="product in filteredProducts"
            :key="product.id"
            class="hover:bg-gray-50 transition-colors"
            :class="isRecentlyAdded(product.id) ? 'bg-emerald-50 hover:bg-emerald-50' : ''"
          >
            <!-- Image thumbnail -->
            <td class="px-5 py-3">
              <div class="h-12 w-12 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img
                  v-if="getProductImageUrl(product)"
                  :src="getProductImageUrl(product) || ''"
                  :alt="product.name"
                  class="h-full w-full object-cover"
                  @error="(e) => { e.target.style.display = 'none' }"
                />
                <svg v-else class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </td>

            <!-- Product name + description -->
            <td class="px-5 py-3">
              <div class="flex items-start gap-1.5 flex-col">
                <div class="flex items-center gap-1.5">
                  <span class="text-sm font-semibold text-gray-800">{{ product.name }}</span>
                  <span v-if="isRecentlyAdded(product.id)" class="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">New</span>
                  <span v-if="(product as any).is_featured" class="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700">Today's Pick</span>
                </div>
                <p class="text-xs text-gray-400 truncate max-w-[200px]">{{ product.description || '—' }}</p>
                <span class="text-xs text-gray-400">{{ product.unit_type }}</span>
              </div>
            </td>

            <!-- Category badge -->
            <td class="px-5 py-3">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full" :class="getCategoryClass(product.category)">
                {{ product.category || '—' }}
              </span>
            </td>

            <!-- Price -->
            <td class="px-5 py-3">
              <p class="text-sm font-semibold text-gray-800">₱{{ Number(product.price).toFixed(2) }}</p>
              <p class="text-xs text-gray-400">Retail: ₱{{ Number(product.retail_price).toFixed(2) }}</p>
            </td>

            <!-- Stock -->
            <td class="px-5 py-3">
              <span
                class="text-sm font-bold"
                :class="product.stock_quantity > 10 ? 'text-emerald-600' : product.stock_quantity > 0 ? 'text-amber-600' : 'text-red-600'"
              >
                {{ product.stock_quantity }}
              </span>
            </td>

            <!-- Status -->
            <td class="px-5 py-3">
              <span class="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusBadgeClass(product)">
                {{ getProductStatus(product) }}
              </span>
            </td>

            <!-- Today's Pick toggle -->
            <td class="px-5 py-3">
              <button
                :title="(product as any).is_featured ? 'Remove from Today\'s Picks' : 'Add to Today\'s Picks'"
                class="transition-transform hover:scale-110"
                @click="toggleFeatured(product)"
              >
                <svg
                  class="w-5 h-5"
                  :class="(product as any).is_featured ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-none'"
                  stroke="currentColor"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"/>
                </svg>
              </button>
            </td>

            <!-- Actions -->
            <td class="px-5 py-3">
              <div class="flex items-center gap-2">
                <button class="text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-md text-xs font-medium transition-colors" @click="openViewModal(product)">View</button>
                <button class="text-white bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-md text-xs font-medium transition-colors" @click="openEditModal(product)">Edit</button>
                <button class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs font-medium transition-colors" @click="removeProduct(product)">Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Product Detail Modal -->
    <Teleport to="body">
      <div v-if="viewModal && selectedProduct" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="viewModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-base font-semibold text-gray-800">Product Details</h3>
            <button @click="viewModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-5">
            <!-- Product image -->
            <div class="w-full h-52 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
              <img
                v-if="getProductImageUrl(selectedProduct)"
                :src="getProductImageUrl(selectedProduct) || ''"
                :alt="selectedProduct.name"
                class="h-full w-full object-contain"
                @error="(e) => { e.target.style.display = 'none' }"
              />
              <div v-else class="flex flex-col items-center gap-2 text-gray-300">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm">No image</span>
              </div>
            </div>

            <!-- Name + badge -->
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-lg font-bold text-gray-800">{{ selectedProduct.name }}</h2>
                <p class="text-sm text-gray-400 mt-0.5">{{ selectedProduct.unit_type }}</p>
              </div>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 mt-1" :class="getCategoryClass(selectedProduct.category)">
                {{ selectedProduct.category || '—' }}
              </span>
            </div>

            <!-- Description -->
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p class="text-sm text-gray-600">{{ selectedProduct.description || 'No description provided.' }}</p>
            </div>

            <!-- Info grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-xs text-gray-400 mb-0.5">Price</p>
                <p class="text-base font-bold text-gray-800">₱{{ Number(selectedProduct.price).toFixed(2) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-xs text-gray-400 mb-0.5">Retail Price</p>
                <p class="text-base font-bold text-gray-800">₱{{ Number(selectedProduct.retail_price).toFixed(2) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3 text-center">
                <p class="text-xs text-gray-400 mb-0.5">Stock</p>
                <p class="text-base font-bold" :class="selectedProduct.stock_quantity > 0 ? 'text-emerald-600' : 'text-red-600'">
                  {{ selectedProduct.stock_quantity }}
                </p>
              </div>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-semibold rounded-full" :class="getStatusBadgeClass(selectedProduct)">
                {{ getProductStatus(selectedProduct) }}
              </span>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex justify-between">
            <button @click="removeProduct(selectedProduct); viewModal = false" class="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
              Remove Product
            </button>
            <button @click="viewModal = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Edit Product Modal -->
    <Teleport to="body">
      <div v-if="editModal && editingProduct" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="editModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="text-base font-semibold text-gray-800">Edit Product</h3>
            <button @click="editModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Product Name</label>
              <input v-model="editForm.name" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
              <textarea v-model="editForm.description" rows="3" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"></textarea>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</label>
              <select v-model="editForm.category" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Price (₱)</label>
                <input v-model.number="editForm.price" type="number" min="0" step="0.01" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Retail Price (₱)</label>
                <input v-model.number="editForm.retail_price" type="number" min="0" step="0.01" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Stock Quantity</label>
                <input v-model.number="editForm.stock_quantity" type="number" min="0" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Unit Type</label>
                <input v-model="editForm.unit_type" type="text" placeholder="e.g. kg, piece, pack" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button @click="editModal = false" class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
            <button @click="saveEdit" :disabled="editSaving" class="px-4 py-2 text-sm font-medium bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50">
              {{ editSaving ? 'Saving…' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Transition name="fade">
      <div v-if="toast.show" class="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-emerald-600 text-white">
        {{ toast.message }}
      </div>
    </Transition>
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

const CATEGORIES = ['Fish', 'Meat', 'Vegetables', 'Fruits', 'Apparel', 'Karinderya'] as const

// Maps each display category to all lowercase aliases stored in the DB
// (the app stores singular forms like "Fruit", "Vegetable", "Fish", "Meat")
const CATEGORY_ALIASES: Record<string, string[]> = {
  'Fish':       ['fish', 'fishes'],
  'Meat':       ['meat', 'meats'],
  'Vegetables': ['vegetable', 'vegetables', 'veggie', 'veggies'],
  'Fruits':     ['fruit', 'fruits'],
  'Apparel':    ['apparel'],
  'Karinderya': ['karinderya'],
}

function categoryMatches(dbValue: string | null, displayCategory: string): boolean {
  const val = (dbValue || '').toLowerCase().trim()
  return (CATEGORY_ALIASES[displayCategory] || [displayCategory.toLowerCase()]).includes(val)
}

const supabase = useSupabaseClient<Database>()

const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')
const viewModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const editModal = ref(false)
const editingProduct = ref<Product | null>(null)
const editSaving = ref(false)
const editForm = ref({
  name: '',
  description: '',
  category: '',
  price: 0,
  retail_price: 0,
  stock_quantity: 0,
  unit_type: '',
})
let toastTimer: ReturnType<typeof setTimeout> | null = null
const recentProductIds = ref<string[]>([])
const recentProductTimers: Record<string, ReturnType<typeof setTimeout>> = {}
const toast = ref({ show: false, message: '' })

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase()
  const cat = categoryFilter.value
  const st = statusFilter.value
  return products.value.filter(p => {
    const matchesSearch = !q || (
      (p.name || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.unit_type || '').toLowerCase().includes(q)
    )
    const matchesCategory = !cat || categoryMatches(p.category, cat)
    const matchesStatus = !st || (
      st === 'active' ? p.stock_quantity > 0 :
      st === 'out_of_stock' ? p.stock_quantity <= 0 :
      st === 'featured' ? (p as any).is_featured === true :
      false
    )
    return matchesSearch && matchesCategory && matchesStatus
  })
})

function countByCategory(cat: string): number {
  return products.value.filter(p => categoryMatches(p.category, cat)).length
}

function getProductStatus(product: Product): string {
  return product.stock_quantity > 0 ? 'Active' : 'Out of stock'
}

function getStatusBadgeClass(product: Product): string {
  return product.stock_quantity > 0
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800'
}

function getCategoryClass(category: string | null): string {
  const val = (category || '').toLowerCase().trim()
  if (['fish', 'fishes'].includes(val))                              return 'bg-blue-100 text-blue-700'
  if (['meat', 'meats'].includes(val))                               return 'bg-red-100 text-red-700'
  if (['vegetable', 'vegetables', 'veggie', 'veggies'].includes(val)) return 'bg-green-100 text-green-700'
  if (['fruit', 'fruits'].includes(val))                             return 'bg-orange-100 text-orange-700'
  if (['apparel'].includes(val))                                      return 'bg-purple-100 text-purple-700'
  if (['karinderya'].includes(val))                                   return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-600'
}

function getProductImageUrl(product: Product): string | null {
  const raw = product.image_url
  if (!raw || raw.trim() === '') return null
  if (raw.startsWith('http')) return raw
  // Try the "products" storage bucket
  const { data } = supabase.storage.from('products').getPublicUrl(raw)
  return data?.publicUrl || null
}

function openViewModal(product: Product) {
  selectedProduct.value = product
  viewModal.value = true
}

function openEditModal(product: Product) {
  editingProduct.value = product
  editForm.value = {
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    price: Number(product.price) || 0,
    retail_price: Number(product.retail_price) || 0,
    stock_quantity: product.stock_quantity || 0,
    unit_type: product.unit_type || '',
  }
  editModal.value = true
}

async function saveEdit() {
  if (!editingProduct.value) return
  editSaving.value = true
  try {
    const { error: err } = await supabase
      .from('product')
      .update({
        name: editForm.value.name,
        description: editForm.value.description,
        category: editForm.value.category,
        price: editForm.value.price,
        retail_price: editForm.value.retail_price,
        stock_quantity: editForm.value.stock_quantity,
        unit_type: editForm.value.unit_type,
      })
      .eq('id', editingProduct.value.id)
    if (err) throw err
    const idx = products.value.findIndex(p => p.id === editingProduct.value!.id)
    if (idx !== -1) {
      const p = products.value[idx]
      products.value[idx] = {
        ...p,
        name: editForm.value.name,
        description: editForm.value.description,
        category: editForm.value.category,
        price: editForm.value.price,
        retail_price: editForm.value.retail_price,
        stock_quantity: editForm.value.stock_quantity,
        unit_type: editForm.value.unit_type,
      }
    }
    editModal.value = false
    showToast(`"${editForm.value.name}" updated successfully.`)
  } catch (e: any) {
    showToast(`Failed to update product: ${e?.message || e}`)
  } finally {
    editSaving.value = false
  }
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
  if (recentProductTimers[productId]) clearTimeout(recentProductTimers[productId])
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
  return channel
}

async function removeProduct(product: Product) {
  const ok = confirm(`Remove "${product.name}"? This cannot be undone.`)
  if (!ok) return

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

async function toggleFeatured(product: Product) {
  const next = !((product as any).is_featured)
  const { error: err } = await supabase
    .from('product')
    .update({ is_featured: next } as any)
    .eq('id', product.id)
  if (err) {
    showToast(`Failed to update: ${err.message}`)
    return
  }
  const idx = products.value.findIndex(p => p.id === product.id)
  if (idx !== -1) (products.value[idx] as any).is_featured = next
  showToast(next ? `"${product.name}" added to Today's Picks.` : `"${product.name}" removed from Today's Picks.`)
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
  if (toastTimer) clearTimeout(toastTimer)
  Object.values(recentProductTimers).forEach(timer => clearTimeout(timer))
})
</script>