<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-800 mb-6">Categories & Settings</h1>

    <!-- Tab Navigation -->
    <div class="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
        :class="activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ── Categories Tab ── -->
    <div v-if="activeTab === 'categories'">
      <div class="flex items-center justify-between mb-4">
        <div class="flex gap-3 items-center">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="catSearch" type="text" placeholder="Search categories..." class="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
          </div>
        </div>
        <button @click="openAddCategory" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Category
        </button>
      </div>

      <div v-if="catTableNotFound" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 mb-4">
        <strong>Categories table not found.</strong> Run the provided SQL migration to enable category management.
      </div>

      <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div v-if="catLoading" class="flex items-center justify-center py-16 text-slate-400 text-sm gap-2">
          <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          Loading categories...
        </div>
        <table v-else class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Products</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
              <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-if="filteredCategories.length === 0">
              <td colspan="5" class="px-5 py-12 text-center text-sm text-slate-400">
                {{ catTableNotFound ? 'Run the SQL migration to create the categories table.' : 'No categories found.' }}
              </td>
            </tr>
            <tr v-for="cat in filteredCategories" :key="cat.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg flex items-center justify-center text-base" :style="{ background: cat.color ? cat.color + '20' : '#f1f5f9' }">
                    {{ cat.icon || '🏷️' }}
                  </div>
                  <span class="text-sm font-medium text-slate-700">{{ cat.name }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-sm text-slate-500 max-w-xs truncate">{{ cat.description || '—' }}</td>
              <td class="px-5 py-3.5 text-sm text-slate-600">{{ cat.product_count ?? '—' }}</td>
              <td class="px-5 py-3.5 text-sm text-slate-500">{{ formatDate(cat.created_at) }}</td>
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <button @click="openEditCategory(cat)" class="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium transition-colors">Edit</button>
                  <button @click="confirmDeleteCategory(cat)" class="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Tags Tab ── -->
    <div v-if="activeTab === 'tags'">
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-slate-500">Manage product tags used across the platform.</p>
        <button @click="openAddTag" class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Tag
        </button>
      </div>

      <div v-if="tagTableNotFound" class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800 mb-4">
        <strong>Tags table not found.</strong> Run the provided SQL migration to enable tag management.
      </div>

      <div v-if="tags.length === 0 && !tagLoading" class="bg-white rounded-xl border border-slate-100 shadow-sm py-12 text-center text-slate-400 text-sm">
        {{ tagTableNotFound ? 'Run the SQL migration to create the tags table.' : 'No tags found.' }}
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <div
          v-for="tag in tags"
          :key="tag.id"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm text-slate-700 group"
        >
          <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
          </svg>
          {{ tag.name }}
          <button @click="deleteTag(tag)" class="ml-1 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── System Settings Tab ── -->
    <div v-if="activeTab === 'settings'">
      <div class="space-y-5">
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 class="text-base font-semibold text-slate-700 mb-4">Platform Settings</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-slate-50">
              <div>
                <p class="text-sm font-medium text-slate-700">Maintenance Mode</p>
                <p class="text-xs text-slate-400 mt-0.5">Disable platform access for all non-admin users</p>
              </div>
              <button @click="settings.maintenanceMode = !settings.maintenanceMode" class="relative h-6 w-11 rounded-full transition-colors" :class="settings.maintenanceMode ? 'bg-red-500' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" :class="settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'"></span>
              </button>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-slate-50">
              <div>
                <p class="text-sm font-medium text-slate-700">New Vendor Registration</p>
                <p class="text-xs text-slate-400 mt-0.5">Allow new vendors to register on the platform</p>
              </div>
              <button @click="settings.allowVendorReg = !settings.allowVendorReg" class="relative h-6 w-11 rounded-full transition-colors" :class="settings.allowVendorReg ? 'bg-indigo-500' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" :class="settings.allowVendorReg ? 'translate-x-5' : 'translate-x-0.5'"></span>
              </button>
            </div>
            <div class="flex items-center justify-between py-3 border-b border-slate-50">
              <div>
                <p class="text-sm font-medium text-slate-700">New Buyer Registration</p>
                <p class="text-xs text-slate-400 mt-0.5">Allow new buyers to create accounts</p>
              </div>
              <button @click="settings.allowBuyerReg = !settings.allowBuyerReg" class="relative h-6 w-11 rounded-full transition-colors" :class="settings.allowBuyerReg ? 'bg-indigo-500' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" :class="settings.allowBuyerReg ? 'translate-x-5' : 'translate-x-0.5'"></span>
              </button>
            </div>
            <div class="flex items-center justify-between py-3">
              <div>
                <p class="text-sm font-medium text-slate-700">Email Notifications</p>
                <p class="text-xs text-slate-400 mt-0.5">Send system emails for orders and account events</p>
              </div>
              <button @click="settings.emailNotifs = !settings.emailNotifs" class="relative h-6 w-11 rounded-full transition-colors" :class="settings.emailNotifs ? 'bg-indigo-500' : 'bg-slate-200'">
                <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform" :class="settings.emailNotifs ? 'translate-x-5' : 'translate-x-0.5'"></span>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h2 class="text-base font-semibold text-slate-700 mb-4">Platform Info</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Platform Name</label>
              <input v-model="settings.platformName" type="text" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Support Email</label>
              <input v-model="settings.supportEmail" type="email" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Max Products per Vendor</label>
              <input v-model.number="settings.maxProductsPerVendor" type="number" min="1" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Platform Currency</label>
              <input v-model="settings.currency" type="text" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button @click="saveSettings" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="catModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="catModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">{{ catModalMode === 'add' ? 'Add Category' : 'Edit Category' }}</h3>
            <button @click="catModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Category Name <span class="text-red-400">*</span></label>
              <input v-model="catForm.name" type="text" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. Meat, Fish, Vegetables"/>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1.5">Description</label>
              <textarea v-model="catForm.description" rows="2" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" placeholder="Optional description..."></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5">Icon (emoji)</label>
                <input v-model="catForm.icon" type="text" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="🏷️"/>
              </div>
              <div>
                <label class="block text-xs font-medium text-slate-500 mb-1.5">Color (hex)</label>
                <input v-model="catForm.color" type="color" class="w-full h-9 px-1 py-1 border border-slate-200 rounded-lg focus:outline-none cursor-pointer"/>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button @click="catModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button @click="saveCategory" :disabled="!catForm.name.trim()" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40">
              {{ catModalMode === 'add' ? 'Add Category' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirm Modal -->
    <Teleport to="body">
      <div v-if="deleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="deleteModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="px-6 py-5">
            <div class="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <p class="text-base font-semibold text-center text-slate-800 mb-1">Delete Category</p>
            <p class="text-sm text-center text-slate-500">Are you sure you want to delete <strong>{{ categoryToDelete?.name }}</strong>? This cannot be undone.</p>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex gap-2">
            <button @click="deleteModal = false" class="flex-1 px-4 py-2 text-sm text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors font-medium">Cancel</button>
            <button @click="deleteCategory" class="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add Tag Modal -->
    <Teleport to="body">
      <div v-if="tagModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="tagModal = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 class="text-base font-semibold text-slate-800">Add Tag</h3>
            <button @click="tagModal = false" class="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="px-6 py-5">
            <label class="block text-xs font-medium text-slate-500 mb-1.5">Tag Name <span class="text-red-400">*</span></label>
            <input v-model="tagForm.name" type="text" @keyup.enter="saveTag" class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="e.g. Fresh, Organic, Halal"/>
          </div>
          <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
            <button @click="tagModal = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
            <button @click="saveTag" :disabled="!tagForm.name.trim()" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40">Add Tag</button>
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

const activeTab = ref('categories')
const tabs = [
  { id: 'categories', label: 'Categories' },
  { id: 'tags', label: 'Tags' },
  { id: 'settings', label: 'System Settings' },
]

// ── Categories ──
const categories = ref<any[]>([])
const catLoading = ref(false)
const catTableNotFound = ref(false)
const catSearch = ref('')
const catModal = ref(false)
const catModalMode = ref<'add' | 'edit'>('add')
const catForm = ref({ name: '', description: '', icon: '', color: '#6366f1' })
const selectedCategory = ref<any>(null)
const deleteModal = ref(false)
const categoryToDelete = ref<any>(null)

const filteredCategories = computed(() => {
  if (!catSearch.value.trim()) return categories.value
  const q = catSearch.value.trim().toLowerCase()
  return categories.value.filter(c => (c.name || '').toLowerCase().includes(q))
})

// ── Tags ──
const tags = ref<any[]>([])
const tagLoading = ref(false)
const tagTableNotFound = ref(false)
const tagModal = ref(false)
const tagForm = ref({ name: '' })

// ── Settings ──
const settings = ref({
  maintenanceMode: false,
  allowVendorReg: true,
  allowBuyerReg: true,
  emailNotifs: true,
  platformName: 'Quickcart',
  supportEmail: 'support@quickcart.com',
  maxProductsPerVendor: 50,
  currency: 'PHP',
})

// ── Toast ──
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3000)
}

async function fetchCategories() {
  catLoading.value = true
  catTableNotFound.value = false
  try {
    // Try 'categories' then 'product_categories'
    let res = await supabase.from('categories').select('*').order('name')
    if (res.error?.code === '42P01') {
      res = await supabase.from('product_categories').select('*').order('name')
      if (res.error?.code === '42P01') { catTableNotFound.value = true; return }
    }
    if (res.error) throw res.error

    // Enrich with product counts
    const catData = res.data || []
    const { data: products } = await supabase.from('product').select('category')
    if (products) {
      const countMap = new Map<string, number>()
      for (const p of products) {
        if (p.category) countMap.set(p.category, (countMap.get(p.category) || 0) + 1)
      }
      categories.value = catData.map(c => ({ ...c, product_count: countMap.get(c.name) ?? 0 }))
    } else {
      categories.value = catData
    }
  } catch (e: any) {
    showToast(e?.message || 'Failed to load categories', 'error')
  } finally {
    catLoading.value = false
  }
}

function openAddCategory() {
  catForm.value = { name: '', description: '', icon: '🏷️', color: '#6366f1' }
  catModalMode.value = 'add'
  selectedCategory.value = null
  catModal.value = true
}

function openEditCategory(cat: any) {
  catForm.value = { name: cat.name, description: cat.description || '', icon: cat.icon || '🏷️', color: cat.color || '#6366f1' }
  catModalMode.value = 'edit'
  selectedCategory.value = cat
  catModal.value = true
}

async function saveCategory() {
  if (!catForm.value.name.trim()) return
  try {
    const tableName = catTableNotFound.value ? 'product_categories' : 'categories'
    if (catModalMode.value === 'add') {
      const { data, error } = await supabase.from(tableName).insert([catForm.value]).select().single()
      if (error) throw error
      categories.value = [data, ...categories.value]
      showToast('Category added successfully')
    } else {
      const { data, error } = await supabase.from(tableName).update(catForm.value).eq('id', selectedCategory.value.id).select().single()
      if (error) throw error
      const idx = categories.value.findIndex(c => c.id === selectedCategory.value.id)
      if (idx !== -1) categories.value[idx] = { ...categories.value[idx], ...data }
      showToast('Category updated')
    }
    catModal.value = false
  } catch (e: any) {
    showToast(e?.message || 'Failed to save category', 'error')
  }
}

function confirmDeleteCategory(cat: any) {
  categoryToDelete.value = cat
  deleteModal.value = true
}

async function deleteCategory() {
  if (!categoryToDelete.value) return
  try {
    const tableName = catTableNotFound.value ? 'product_categories' : 'categories'
    const { error } = await supabase.from(tableName).delete().eq('id', categoryToDelete.value.id)
    if (error) throw error
    categories.value = categories.value.filter(c => c.id !== categoryToDelete.value.id)
    showToast('Category deleted')
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete category', 'error')
  } finally {
    deleteModal.value = false
    categoryToDelete.value = null
  }
}

// ── Tags ──
async function fetchTags() {
  tagLoading.value = true
  tagTableNotFound.value = false
  try {
    const { data, error } = await supabase.from('tags').select('*').order('name')
    if (error?.code === '42P01') { tagTableNotFound.value = true; return }
    if (error) throw error
    tags.value = data || []
  } catch { /* silent */ } finally {
    tagLoading.value = false
  }
}

function openAddTag() {
  tagForm.value = { name: '' }
  tagModal.value = true
}

async function saveTag() {
  if (!tagForm.value.name.trim()) return
  try {
    const { data, error } = await supabase.from('tags').insert([{ name: tagForm.value.name.trim() }]).select().single()
    if (error) throw error
    tags.value = [...tags.value, data].sort((a, b) => a.name.localeCompare(b.name))
    tagModal.value = false
    showToast('Tag added')
  } catch (e: any) {
    showToast(e?.message || 'Failed to add tag', 'error')
  }
}

async function deleteTag(tag: any) {
  try {
    const { error } = await supabase.from('tags').delete().eq('id', tag.id)
    if (error) throw error
    tags.value = tags.value.filter(t => t.id !== tag.id)
    showToast('Tag removed')
  } catch (e: any) {
    showToast(e?.message || 'Failed to delete tag', 'error')
  }
}

// ── Settings ──
async function saveSettings() {
  // Settings would typically be saved to a system_settings table.
  // For now we save to localStorage as a fallback.
  try {
    localStorage.setItem('admin_platform_settings', JSON.stringify(settings.value))
    showToast('Settings saved')
  } catch {
    showToast('Failed to save settings', 'error')
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('admin_platform_settings')
    if (saved) settings.value = { ...settings.value, ...JSON.parse(saved) }
  } catch { /* ignore */ }
}

onMounted(() => {
  fetchCategories()
  fetchTags()
  loadSettings()
})
</script>
