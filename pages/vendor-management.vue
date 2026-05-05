<template>
  <div class="vendor-management">
    <div v-if="detailsSetupRequired" class="setup-banner">
      <div>
        <strong>Vendor details table not configured.</strong>
        <span> Run the SQL setup to enable stall numbers, business types, operating hours, and product counts.</span>
      </div>
      <button class="ghost-action" @click="fetchVendors">Refresh</button>
    </div>

    <section class="module-card">
      <div class="section-header">
        <h1>Vendor Management (Pendings)</h1>
        <button class="primary-action" @click="openCreateModal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vendor
        </button>
      </div>

      <div class="search-shell">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="pendingSearch" type="text" placeholder="Search vendors..." />
      </div>

      <div class="table-wrap">
        <div v-if="loading" class="state-block">
          <div class="spinner"></div>
          <p>Loading pending vendors...</p>
        </div>

        <div v-else-if="error" class="state-block error-state">
          <p>{{ error }}</p>
        </div>

        <table v-else class="vendor-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Stall No.</th>
              <th>Store Address</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="pendingVendors.length === 0">
              <td colspan="6" class="empty-row">No pending vendor applications found.</td>
            </tr>
            <tr v-for="vendor in pendingVendors" :key="vendor.user_id || vendor.id">
              <td class="vendor-name-cell">
                <img v-if="getLogoUrl(vendor)" :src="getLogoUrl(vendor)!" alt="" class="vendor-logo" />
                <div v-else class="vendor-avatar">{{ getInitials(getDisplayName(vendor)) }}</div>
                <div>
                  <p class="vendor-name">{{ getDisplayName(vendor) }}</p>
                  <p class="vendor-meta">{{ vendor.email || 'No email available' }}</p>
                </div>
              </td>
              <td>{{ getStallLabel(vendor) }}</td>
              <td>{{ getStoreAddress(vendor) }}</td>
              <td>{{ getContact(vendor) }}</td>
              <td>
                <button class="detail-link" @click="openViewModal(vendor)">View Details</button>
              </td>
              <td>
                <div class="row-actions">
                  <button class="table-btn approve" @click="approveVendor(vendor)">Approve</button>
                  <button class="table-btn decline" @click="declineVendor(vendor)">Decline</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="module-card">
      <div class="section-header">
        <h2>Monitoring Vendors Profile</h2>
        <span class="vendor-count">{{ monitoringVendors.length }} vendors</span>
      </div>

      <div class="search-shell">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input v-model="monitoringSearch" type="text" placeholder="Search vendors..." />
      </div>

      <div class="table-wrap">
        <table v-if="!loading && !error" class="vendor-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Stall No.</th>
              <th>Category</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="monitoringVendors.length === 0">
              <td colspan="6" class="empty-row">No approved or suspended vendors found.</td>
            </tr>
            <tr v-for="vendor in monitoringVendors" :key="`monitor-${vendor.user_id || vendor.id}`">
              <td class="vendor-name-cell">
                <img v-if="getLogoUrl(vendor)" :src="getLogoUrl(vendor)!" alt="" class="vendor-logo" />
                <div v-else class="vendor-avatar muted">{{ getInitials(getDisplayName(vendor)) }}</div>
                <div>
                  <p class="vendor-name">{{ getDisplayName(vendor) }}</p>
                  <p class="vendor-meta">{{ vendor.email || 'No email available' }}</p>
                </div>
              </td>
              <td>{{ getStallLabel(vendor) }}</td>
              <td>{{ vendor.category || getBusinessType(vendor) }}</td>
              <td>{{ getContact(vendor) }}</td>
              <td>
                <span class="status-pill" :class="getMonitoringStatusClass(vendor)">
                  <span class="status-dot" :class="getMonitoringStatusClass(vendor)"></span>
                  {{ getMonitoringStatusLabel(vendor) }}
                </span>
              </td>
              <td>
                <div class="row-actions">
                  <button class="table-btn view" @click="openViewModal(vendor)">View</button>
                  <button class="table-btn edit" @click="openEditModal(vendor)">Edit</button>
                  <button
                    v-if="getMonitoringStatusLabel(vendor) === 'Active'"
                    class="table-btn suspend-btn"
                    @click="suspendVendor(vendor)"
                  >Suspend</button>
                  <button
                    v-if="getMonitoringStatusLabel(vendor) === 'Suspended'"
                    class="table-btn unsuspend"
                    @click="unsuspendVendor(vendor)"
                  >Unsuspend</button>
                  <button
                    v-if="getMonitoringStatusLabel(vendor) === 'Suspended'"
                    class="table-btn delete"
                    @click="deleteVendor(vendor)"
                  >Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
        <div class="edit-card">
          <div class="edit-header">
            <div class="edit-header-top">
              <h3>{{ modalTitle }}</h3>
              <button class="modal-close" @click="closeModal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div v-if="selectedVendor && modalMode === 'view'" class="modal-vendor-hero">
              <img v-if="getLogoUrl(selectedVendor)" :src="getLogoUrl(selectedVendor)!" alt="" class="modal-logo" />
              <div v-else class="modal-avatar">{{ getInitials(getDisplayName(selectedVendor)) }}</div>
              <div>
                <p class="modal-vendor-name">{{ getDisplayName(selectedVendor) }}</p>
                <p class="modal-vendor-email">{{ selectedVendor.email || 'No email' }}</p>
              </div>
            </div>
          </div>

          <div class="edit-body">
            <div v-if="modalMode === 'create'" class="form-row form-row-select">
              <label>Vendor</label>
              <select v-model="vendorForm.targetUserId" @change="handleCreateVendorChange">
                <option value="">Select a vendor</option>
                <option v-for="option in vendorOptions" :key="option.userId" :value="option.userId">
                  {{ option.label }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <label>Business Name</label>
              <input v-model="vendorForm.storeName" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Store Information</label>
              <input v-model="vendorForm.storeInformation" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Stall No.</label>
              <input v-model="vendorForm.stallNo" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Store Address</label>
              <input v-model="vendorForm.storeAddress" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Contact Email</label>
              <input v-model="vendorForm.officialContactEmail" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Business Type</label>
              <input v-model="vendorForm.businessType" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Operating Hours</label>
              <input v-model="vendorForm.operatingHours" :disabled="modalMode === 'view'" type="text" />
            </div>

            <div class="form-row">
              <label>Product listed</label>
              <input v-model.number="vendorForm.productListed" :disabled="modalMode === 'view'" type="number" min="0" />
            </div>

            <div v-if="modalMode === 'view' && selectedVendor" class="info-chips">
              <span class="info-chip" :class="selectedVendor.has_bank_account ? 'chip-yes' : 'chip-no'">
                {{ selectedVendor.has_bank_account ? 'Bank Connected' : 'No Bank' }}
              </span>
              <span class="info-chip" :class="selectedVendor.products_added ? 'chip-yes' : 'chip-no'">
                {{ selectedVendor.products_added ? 'Products Added' : 'No Products' }}
              </span>
              <span class="info-chip" :class="selectedVendor.contact_info_set ? 'chip-yes' : 'chip-no'">
                {{ selectedVendor.contact_info_set ? 'Contact Set' : 'No Contact' }}
              </span>
              <span class="info-chip" :class="selectedVendor.is_profile_finalized ? 'chip-yes' : 'chip-no'">
                {{ selectedVendor.is_profile_finalized ? 'Profile Final' : 'Profile Draft' }}
              </span>
            </div>

            <div class="form-row form-row-link">
              <button class="permit-link" @click="handleViewPermits">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                View Permits
              </button>
            </div>
          </div>

          <div class="edit-footer">
            <button class="footer-btn neutral" @click="closeModal">{{ modalMode === 'view' ? 'Close' : 'Cancel' }}</button>
            <button
              v-if="modalMode === 'view' && selectedVendor && isPendingApproval(selectedVendor)"
              class="footer-btn approve"
              @click="approveAndClose"
            >
              Approve
            </button>
            <button
              v-if="modalMode === 'view' && selectedVendor && isPendingApproval(selectedVendor)"
              class="footer-btn decline"
              @click="declineAndClose"
            >
              Decline
            </button>
            <button
              v-if="modalMode === 'view' && selectedVendor && !isPendingApproval(selectedVendor)"
              class="footer-btn neutral"
              @click="openEditModal(selectedVendor)"
            >
              Edit
            </button>
            <button
              v-if="modalMode !== 'view'"
              class="footer-btn save"
              :disabled="saving"
              @click="saveVendorProfile"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <button
              v-if="modalMode === 'edit' && selectedVendor && getWorkflowState(selectedVendor) !== 'suspended'"
              class="footer-btn suspend"
              @click="suspendAndClose"
            >
              Suspend
            </button>
            <button
              v-if="modalMode === 'edit' && selectedVendor && getWorkflowState(selectedVendor) === 'suspended'"
              class="footer-btn unsuspend"
              @click="unsuspendAndClose"
            >
              Unsuspend
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <div v-if="toast.show" class="toast" :class="toast.type">{{ toast.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({ middleware: ['auth-admin'] })

const supabase = useSupabaseClient()

interface Vendor {
  id: string
  user_id: string
  detail_id?: string | null
  store_name?: string | null
  full_name?: string | null
  email?: string | null
  phone?: string | null
  stall_no?: string | null
  business_type?: string | null
  contact_number?: string | null
  operating_hours?: string | null
  product_listed?: number | null
  permit_count?: number | null
  permit_urls?: string[] | null
  logo_url?: string | null
  category?: string | null
  has_bank_account?: boolean | null
  products_added?: boolean | null
  contact_info_set?: boolean | null
  is_info_complete?: boolean | null
  is_profile_finalized?: boolean | null
  approval_status?: string | null
  status?: string | null
  created_at: string
  source?: 'seller_profiles' | 'profiles'
  stall_number?: string | null
  store_address?: string | null
  official_contact_email?: string | null
  store_information_final?: string | null
}

interface VendorForm {
  targetUserId: string
  storeName: string
  stallNo: string
  contactNumber: string
  businessType: string
  operatingHours: string
  productListed: number
  storeAddress: string
  officialContactEmail: string
  storeInformation: string
}

interface VendorOption {
  userId: string
  label: string
}

const vendors = ref<Vendor[]>([])
const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const pendingSearch = ref('')
const monitoringSearch = ref('')
const detailsSetupRequired = ref(false)
const selectedVendor = ref<Vendor | null>(null)
const modalOpen = ref(false)
const modalMode = ref<'view' | 'edit' | 'create'>('view')
const toast = ref<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' })
const vendorForm = ref<VendorForm>(emptyVendorForm())

let toastTimer: ReturnType<typeof setTimeout> | null = null

function emptyVendorForm(): VendorForm {
  return {
    targetUserId: '',
    storeName: '',
    stallNo: '',
    contactNumber: '',
    businessType: '',
    operatingHours: '8:00 AM - 6:00 PM',
    productListed: 0,
    storeAddress: '',
    officialContactEmail: '',
    storeInformation: '',
  }
}

function getDisplayName(vendor: Vendor): string {
  return vendor.store_name || vendor.full_name || vendor.email || 'Unnamed Vendor'
}

function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getWorkflowState(vendor: Vendor): 'pending' | 'approved' | 'declined' | 'suspended' {
  const raw = (vendor.approval_status || vendor.status || 'pending').toLowerCase()

  if (['approved', 'active', 'complete'].includes(raw)) return 'approved'
  if (['suspended'].includes(raw)) return 'suspended'
  if (['declined', 'rejected', 'disabled', 'blocked'].includes(raw)) return 'declined'
  return 'pending'
}

function isPendingApproval(vendor: Vendor): boolean {
  return getWorkflowState(vendor) === 'pending'
}

function getMonitoringStatusLabel(vendor: Vendor): 'Active' | 'Suspended' {
  return getWorkflowState(vendor) === 'approved' ? 'Active' : 'Suspended'
}

function getMonitoringStatusClass(vendor: Vendor): string {
  return getMonitoringStatusLabel(vendor) === 'Active' ? 'status-active' : 'status-suspended'
}

function getStallLabel(vendor: Vendor): string {
  return vendor.stall_number?.trim() || vendor.stall_no?.trim() || '---'
}

function getBusinessType(vendor: Vendor): string {
  return vendor.business_type?.trim() || 'Not set'
}

function getStoreAddress(vendor: Vendor): string {
  return vendor.store_address?.trim() || 'Not set'
}

function getContact(vendor: Vendor): string {
  return vendor.official_contact_email?.trim() || vendor.contact_number?.trim() || vendor.phone?.trim() || vendor.email || 'Not set'
}

function getProductsListed(vendor: Vendor): number {
  return Math.max(0, vendor.product_listed ?? 0)
}

function getLogoUrl(vendor: Vendor): string | null {
  const raw = vendor.logo_url
  if (!raw) return null
  // If it's already a full URL, use it directly
  if (raw.startsWith('http')) return raw
  // Otherwise build the public URL from the Logos bucket
  const { data } = supabase.storage.from('Logos').getPublicUrl(raw)
  return data?.publicUrl || null
}

function matchesSearch(vendor: Vendor, query: string): boolean {
  if (!query) return true
  const normalized = query.toLowerCase()
  return [
    getDisplayName(vendor),
    vendor.email || '',
    vendor.stall_no || '',
    vendor.business_type || '',
    vendor.contact_number || '',
    vendor.phone || '',
  ].some(value => value.toLowerCase().includes(normalized))
}

const pendingVendors = computed(() => {
  return vendors.value.filter(vendor => getWorkflowState(vendor) === 'pending' && matchesSearch(vendor, pendingSearch.value))
})

const monitoringVendors = computed(() => {
  return vendors.value.filter(vendor => getWorkflowState(vendor) !== 'pending' && matchesSearch(vendor, monitoringSearch.value))
})

const vendorOptions = computed<VendorOption[]>(() => {
  return vendors.value
    .map(vendor => ({
      userId: vendor.user_id || vendor.id,
      label: `${getDisplayName(vendor)}${vendor.email ? ` · ${vendor.email}` : ''}`,
    }))
    .sort((left, right) => left.label.localeCompare(right.label))
})

const modalTitle = computed(() => {
  if (modalMode.value === 'create') return 'Add'
  if (modalMode.value === 'edit') return 'Edit'
  return 'Vendor Details'
})

async function fetchVendors() {
  loading.value = true
  error.value = null

  try {
    const [sellerResponse, profilesResponse, identityResponse, detailsResponse] = await Promise.all([
      supabase.from('seller_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id,email,role,status,created_at').eq('role', 'seller').order('created_at', { ascending: false }),
      supabase.from('profile').select('user_id,email,name,phone'),
      (supabase as any).from('vendor_management_details').select('*').order('created_at', { ascending: false }),
    ])

    const sellerError = sellerResponse.error
    const profilesError = profilesResponse.error
    const identityError = identityResponse.error
    const detailsError = detailsResponse.error

    // Diagnostic: log all query results to help identify RLS / schema issues
    console.group('[vendor-management] fetchVendors')
    console.log('seller_profiles:', sellerResponse.data?.length ?? 0, 'rows', sellerError ? `| ERROR: ${sellerError.message}` : '')
    console.log('profiles (sellers):', profilesResponse.data?.length ?? 0, 'rows', profilesError ? `| ERROR: ${profilesError.message}` : '')
    console.log('profile (identity):', identityResponse.data?.length ?? 0, 'rows', identityError ? `| ERROR: ${identityError.message}` : '')
    console.log('vendor_management_details:', detailsResponse.data?.length ?? 0, 'rows', detailsError ? `| ERROR ${detailsError.code}: ${detailsError.message}` : '')
    console.groupEnd()

    detailsSetupRequired.value = detailsError?.code === '42P01'

    if (sellerError && profilesError) {
      throw sellerError
    }

    const profileIndex = new Map<string, any>()
    for (const row of profilesResponse.data || []) {
      profileIndex.set(row.id, row)
    }

    const identityIndex = new Map<string, any>()
    for (const row of identityResponse.data || []) {
      identityIndex.set(row.user_id, row)
    }

    const detailsIndex = new Map<string, any>()
    for (const row of ((detailsResponse.data || []) as Array<Record<string, any>>)) {
      detailsIndex.set(row.user_id, row)
    }

    const merged = new Map<string, Vendor>()

    for (const row of sellerResponse.data || []) {
      const userId = row.user_id || row.id
      const authProfile = profileIndex.get(userId)
      const identityProfile = identityIndex.get(userId)
      const details = detailsIndex.get(userId)

      merged.set(userId, {
        id: row.id,
        user_id: userId,
        detail_id: details?.id ?? null,
        store_name: row.store_name,
        full_name: row.full_name || identityProfile?.name || null,
        email: authProfile?.email || identityProfile?.email || null,
        phone: identityProfile?.phone || null,
        stall_no: details?.stall_no ?? null,
        business_type: details?.business_type ?? null,
        contact_number: details?.contact_number ?? null,
        operating_hours: details?.operating_hours ?? null,
        product_listed: details?.product_listed ?? 0,
        permit_count: details?.permit_count ?? 0,
        approval_status: row.approval_status,
        status: authProfile?.status || row.approval_status,
        created_at: row.created_at || authProfile?.created_at || new Date().toISOString(),
        source: 'seller_profiles',
        stall_number: (row as any).stall_number ?? null,
        store_address: (row as any).store_address ?? null,
        official_contact_email: (row as any).official_contact_email ?? null,
        store_information_final: (row as any).store_information_final ?? null,
        permit_urls: (row as any).permit_urls ?? null,
        logo_url: (row as any).logo_url ?? null,
        category: (row as any).category ?? null,
        has_bank_account: (row as any).has_bank_account ?? null,
        products_added: (row as any).products_added ?? null,
        contact_info_set: (row as any).contact_info_set ?? null,
        is_info_complete: (row as any).is_info_complete ?? null,
        is_profile_finalized: (row as any).is_profile_finalized ?? null,
      })
    }

    for (const row of profilesResponse.data || []) {
      const userId = row.id
      const existing = merged.get(userId)
      const identityProfile = identityIndex.get(userId)
      const details = detailsIndex.get(userId)

      if (!existing) {
        merged.set(userId, {
          id: row.id,
          user_id: userId,
          detail_id: details?.id ?? null,
          store_name: null,
          full_name: identityProfile?.name || null,
          email: row.email || identityProfile?.email || null,
          phone: identityProfile?.phone || null,
          stall_no: details?.stall_no ?? null,
          business_type: details?.business_type ?? null,
          contact_number: details?.contact_number ?? null,
          operating_hours: details?.operating_hours ?? null,
          product_listed: details?.product_listed ?? 0,
          permit_count: details?.permit_count ?? 0,
          approval_status: row.status,
          status: row.status,
          created_at: row.created_at || new Date().toISOString(),
          source: 'profiles',
          stall_number: null,
          store_address: null,
          official_contact_email: null,
          store_information_final: null,
        })
      } else {
        merged.set(userId, {
          ...existing,
          email: existing.email || row.email || identityProfile?.email || null,
          phone: existing.phone || identityProfile?.phone || null,
          status: existing.status || row.status,
          approval_status: existing.approval_status || row.status,
          detail_id: existing.detail_id || details?.id || null,
          stall_no: existing.stall_no || details?.stall_no || null,
          business_type: existing.business_type || details?.business_type || null,
          contact_number: existing.contact_number || details?.contact_number || null,
          operating_hours: existing.operating_hours || details?.operating_hours || null,
          product_listed: existing.product_listed ?? details?.product_listed ?? 0,
          permit_count: existing.permit_count ?? details?.permit_count ?? 0,
        })
      }
    }

    vendors.value = Array.from(merged.values()).sort((left, right) => {
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    })

    // Diagnostic: show per-vendor workflow classification in browser console
    console.table(vendors.value.map(v => ({
      name: getDisplayName(v),
      source: v.source,
      approval_status: v.approval_status ?? '(null)',
      status: v.status ?? '(null)',
      workflowState: getWorkflowState(v),
    })))

    if (identityError) {
      console.warn('Unable to load profile table for vendor contact details.', identityError)
    }
    if (detailsError && !detailsSetupRequired.value) {
      console.warn('Unable to load vendor management details.', detailsError)
    }
  } catch (caughtError: any) {
    error.value = caughtError?.message || 'Failed to load vendors'
  } finally {
    loading.value = false
  }
}

function populateVendorForm(vendor: Vendor) {
  vendorForm.value = {
    targetUserId: vendor.user_id || vendor.id,
    storeName: vendor.store_name || vendor.full_name || '',
    stallNo: vendor.stall_number || vendor.stall_no || '',
    contactNumber: vendor.contact_number || vendor.phone || vendor.email || '',
    businessType: vendor.business_type || '',
    operatingHours: vendor.operating_hours || '8:00 AM - 6:00 PM',
    productListed: getProductsListed(vendor),
    storeAddress: vendor.store_address || '',
    officialContactEmail: vendor.official_contact_email || vendor.email || '',
    storeInformation: vendor.store_information_final || '',
  }
}

function closeModal() {
  modalOpen.value = false
  selectedVendor.value = null
  modalMode.value = 'view'
  vendorForm.value = emptyVendorForm()
}

function openViewModal(vendor: Vendor) {
  selectedVendor.value = vendor
  modalMode.value = 'view'
  populateVendorForm(vendor)
  modalOpen.value = true
}

function openEditModal(vendor: Vendor) {
  selectedVendor.value = vendor
  modalMode.value = 'edit'
  populateVendorForm(vendor)
  modalOpen.value = true
}

function openCreateModal() {
  selectedVendor.value = null
  modalMode.value = 'create'
  vendorForm.value = emptyVendorForm()
  modalOpen.value = true
}

function handleCreateVendorChange() {
  const chosenVendor = vendors.value.find(vendor => (vendor.user_id || vendor.id) === vendorForm.value.targetUserId)
  if (!chosenVendor) return

  vendorForm.value = {
    targetUserId: chosenVendor.user_id || chosenVendor.id,
    storeName: chosenVendor.store_name || chosenVendor.full_name || '',
    stallNo: chosenVendor.stall_number || chosenVendor.stall_no || '',
    contactNumber: chosenVendor.contact_number || chosenVendor.phone || chosenVendor.email || '',
    businessType: chosenVendor.business_type || '',
    operatingHours: chosenVendor.operating_hours || '8:00 AM - 6:00 PM',
    productListed: getProductsListed(chosenVendor),
    storeAddress: chosenVendor.store_address || '',
    officialContactEmail: chosenVendor.official_contact_email || chosenVendor.email || '',
    storeInformation: chosenVendor.store_information_final || '',
  }
}

async function saveVendorProfile() {
  if (!vendorForm.value.targetUserId) {
    showToast('Select a vendor first.', 'error')
    return
  }

  saving.value = true

  try {
    const { error: detailError } = await (supabase as any)
      .from('vendor_management_details')
      .upsert(
        {
          user_id: vendorForm.value.targetUserId,
          stall_no: vendorForm.value.stallNo || null,
          business_type: vendorForm.value.businessType || null,
          contact_number: vendorForm.value.contactNumber || null,
          operating_hours: vendorForm.value.operatingHours || null,
          product_listed: Math.max(0, vendorForm.value.productListed || 0),
        },
        { onConflict: 'user_id' }
      )

    if (detailError) {
      if (detailError.code === '42P01') {
        detailsSetupRequired.value = true
      }
      throw detailError
    }

    const { error: sellerUpdateError } = await (supabase as any)
      .from('seller_profiles')
      .update({
        store_name: vendorForm.value.storeName || null,
        stall_number: vendorForm.value.stallNo || null,
        store_address: vendorForm.value.storeAddress || null,
        official_contact_email: vendorForm.value.officialContactEmail || null,
        store_information_final: vendorForm.value.storeInformation || null,
      })
      .eq('user_id', vendorForm.value.targetUserId)

    if (sellerUpdateError) {
      console.warn('Unable to update seller_profiles.', sellerUpdateError)
    }

    await fetchVendors()
    closeModal()
    showToast('Vendor profile saved.', 'success')
  } catch (caughtError: any) {
    showToast(caughtError?.message || 'Failed to save vendor profile.', 'error')
  } finally {
    saving.value = false
  }
}

async function updateVendorStatus(vendor: Vendor, nextStatus: 'approved' | 'declined' | 'suspended', notificationAction?: 'admin_approve_seller' | 'admin_decline_seller') {
  const targetUserId = vendor.user_id || vendor.id

  const [sellerResponse, profileResponse] = await Promise.all([
    supabase.from('seller_profiles').update({ approval_status: nextStatus }).eq('user_id', targetUserId),
    supabase.from('profiles').update({ status: nextStatus }).eq('id', targetUserId),
  ])

  if (sellerResponse.error && profileResponse.error) {
    throw sellerResponse.error
  }

  if (notificationAction) {
    const { error: notifyError } = await supabase.functions.invoke('seller-approval-notifications', {
      body: {
        action: notificationAction,
        user_id: targetUserId,
      },
    })

    if (notifyError) {
      console.warn('Vendor status notification failed.', notifyError)
      showToast('Status updated, but notification failed.', 'error')
    }
  }

  await fetchVendors()
}

async function approveVendor(vendor: Vendor) {
  try {
    await updateVendorStatus(vendor, 'approved', 'admin_approve_seller')
    showToast('Vendor approved successfully.', 'success')
  } catch (caughtError: any) {
    showToast(caughtError?.message || 'Failed to approve vendor.', 'error')
  }
}

async function declineVendor(vendor: Vendor) {
  try {
    await updateVendorStatus(vendor, 'declined', 'admin_decline_seller')
    showToast('Vendor declined.', 'success')
  } catch (caughtError: any) {
    showToast(caughtError?.message || 'Failed to decline vendor.', 'error')
  }
}

async function suspendVendor(vendor: Vendor) {
  try {
    await updateVendorStatus(vendor, 'suspended')
    showToast('Vendor suspended.', 'success')
  } catch (caughtError: any) {
    showToast(caughtError?.message || 'Failed to suspend vendor.', 'error')
  }
}

async function unsuspendVendor(vendor: Vendor) {
  try {
    await updateVendorStatus(vendor, 'approved')
    showToast('Vendor account restored.', 'success')
  } catch (caughtError: any) {
    showToast(caughtError?.message || 'Failed to unsuspend vendor.', 'error')
  }
}

async function approveAndClose() {
  if (!selectedVendor.value) return
  const target = selectedVendor.value
  closeModal()
  await approveVendor(target)
}

async function declineAndClose() {
  if (!selectedVendor.value) return
  const target = selectedVendor.value
  closeModal()
  await declineVendor(target)
}

async function suspendAndClose() {
  if (!selectedVendor.value) return
  const target = selectedVendor.value
  closeModal()
  await suspendVendor(target)
}

async function unsuspendAndClose() {
  if (!selectedVendor.value) return
  const target = selectedVendor.value
  closeModal()
  await unsuspendVendor(target)
}

async function deleteVendor(vendor: Vendor) {
  const name = getDisplayName(vendor)
  if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return

  const targetUserId = vendor.user_id || vendor.id

  try {
    const [sellerResponse, profileResponse] = await Promise.all([
      supabase.from('seller_profiles').delete().eq('user_id', targetUserId),
      supabase.from('profiles').delete().eq('id', targetUserId),
    ])

    if (sellerResponse.error && profileResponse.error) {
      throw sellerResponse.error
    }

    await fetchVendors()
    showToast(`"${name}" has been permanently deleted.`, 'success')
  } catch (caughtError: any) {
    showToast(caughtError?.message || 'Failed to delete vendor.', 'error')
  }
}

async function handleViewPermits() {
  const vendor = selectedVendor.value
  if (!vendor) return

  const userId = vendor.user_id || vendor.id

  const { data: files, error: listError } = await supabase.storage
    .from('Permits')
    .list(`${userId}/permits`)

  if (listError) {
    showToast('Failed to load permit files.', 'error')
    return
  }

  if (!files || files.length === 0) {
    showToast('No permit files found for this vendor.', 'error')
    return
  }

  for (const file of files) {
    const { data: signedData, error: signError } = await supabase.storage
      .from('Permits')
      .createSignedUrl(`${userId}/permits/${file.name}`, 60 * 60 * 24 * 7)
    if (signedData?.signedUrl) {
      window.open(signedData.signedUrl, '_blank')
    } else if (signError) {
      console.warn('Failed to sign permit URL:', signError)
    }
  }
}

function showToast(message: string, type: 'success' | 'error') {
  toast.value = { show: true, message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3200)
}

onMounted(fetchVendors)
</script>

<style scoped>
.vendor-management {
  min-height: 100vh;
  padding: 1.5rem;
  background: #F8F9FC;
  font-family: 'DM Sans', 'Inter', sans-serif;
}

.setup-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 0.95rem 1rem;
  border: 1px solid #fde68a;
  border-radius: 20px;
  background: #fffbeb;
  color: #92400e;
  font-size: 0.9rem;
}

.module-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.2s ease;
}

.module-card:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 12px 32px rgba(0, 0, 0, 0.06);
}

.module-card + .module-card {
  margin-top: 1.4rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.15rem;
}

.section-header h1,
.section-header h2 {
  margin: 0;
  color: #111827;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.vendor-count {
  color: #6B7280;
  font-size: 0.78rem;
  font-weight: 600;
  background: #F3F4F6;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
}

.primary-action,
.ghost-action {
  border: none;
  border-radius: 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.1rem;
  background: #1A4DBE;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(26, 77, 190, 0.25);
}

.primary-action:hover {
  background: #2A4BA0;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(26, 77, 190, 0.3);
}

.ghost-action {
  padding: 0.55rem 0.9rem;
  background: rgba(255, 255, 255, 0.55);
  color: inherit;
}

.search-shell {
  position: relative;
  margin-bottom: 1rem;
}

.search-shell input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #F8F9FC;
  padding: 0.75rem 1rem 0.75rem 2.55rem;
  font-size: 0.88rem;
  color: #111827;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.search-shell input:focus {
  border-color: #1A4DBE;
  box-shadow: 0 0 0 3px rgba(26, 77, 190, 0.1);
  background: #ffffff;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 0.9rem;
  width: 1rem;
  height: 1rem;
  color: #9ca3af;
  transform: translateY(-50%);
}

.table-wrap {
  overflow-x: auto;
}

.vendor-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 760px;
}

.vendor-table th {
  padding: 0.7rem 0.8rem;
  border-bottom: 2px solid #F3F4F6;
  text-align: left;
  color: #6B7280;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.vendor-table td {
  padding: 0.85rem 0.8rem;
  border-bottom: 1px solid #F3F4F6;
  color: #6B7280;
  font-size: 0.83rem;
}

.vendor-table tbody tr {
  transition: background 0.15s ease;
}

.vendor-table tbody tr:hover {
  background: #F8F9FC;
}

.vendor-name-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.vendor-logo {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #F3F4F6;
  background: #F8F9FC;
}

.vendor-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #1A4DBE, #2A4BA0);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
}

.vendor-avatar.muted {
  background: linear-gradient(135deg, #e5e7eb, #d1d5db);
  color: #6B7280;
}

.vendor-name {
  margin: 0;
  color: #111827;
  font-weight: 700;
  font-size: 0.85rem;
}

.vendor-meta {
  margin: 0.15rem 0 0;
  color: #9ca3af;
  font-size: 0.74rem;
}

.detail-link {
  border: none;
  border-radius: 999px;
  background: rgba(26, 77, 190, 0.08);
  color: #1A4DBE;
  padding: 0.38rem 0.72rem;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.detail-link:hover {
  background: rgba(26, 77, 190, 0.15);
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.table-btn {
  border: none;
  border-radius: 8px;
  padding: 0.38rem 0.8rem;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.table-btn:hover {
  transform: translateY(-1px);
}

.table-btn.approve,
.table-btn.view {
  background: #dcfce7;
  color: #166534;
}

.table-btn.approve:hover,
.table-btn.view:hover {
  background: #bbf7d0;
}

.table-btn.decline,
.table-btn.edit {
  background: #fee2e2;
  color: #dc2626;
}

.table-btn.decline:hover,
.table-btn.edit:hover {
  background: #fecaca;
}

.table-btn.delete {
  background: #111827;
  color: #ffffff;
}

.table-btn.delete:hover {
  background: #1f2937;
}

.table-btn.suspend-btn {
  background: #fef3c7;
  color: #b45309;
}

.table-btn.suspend-btn:hover {
  background: #fde68a;
}

.table-btn.unsuspend {
  background: #d1fae5;
  color: #065f46;
}

.table-btn.unsuspend:hover {
  background: #a7f3d0;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 74px;
  padding: 0.35rem 0.72rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  flex-shrink: 0;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-dot.status-active {
  background: #22c55e;
}

.status-suspended {
  background: #fee2e2;
  color: #ef4444;
}

.status-dot.status-suspended {
  background: #ef4444;
}

.state-block,
.empty-row {
  text-align: center;
  color: #6B7280;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  padding: 2.5rem 1rem;
}

.empty-row {
  padding: 1.4rem 0.8rem !important;
}

.error-state {
  color: #dc2626;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  border: 3px solid #e5e7eb;
  border-top-color: #1A4DBE;
  animation: spin 0.7s linear infinite;
}

/* ── Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 2000;
}

.edit-card {
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: #ffffff;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.15);
}

.edit-header {
  padding: 1.25rem 1.5rem 0.6rem;
}

.edit-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-header h3 {
  margin: 0;
  color: #111827;
  font-size: 1.3rem;
  font-weight: 800;
}

.modal-close {
  border: none;
  background: #F3F4F6;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6B7280;
  transition: all 0.15s ease;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #111827;
}

.modal-vendor-hero {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  background: #F8F9FC;
  border-radius: 14px;
}

.modal-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid #e5e7eb;
  background: #fff;
}

.modal-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 14px;
  background: linear-gradient(135deg, #1A4DBE, #2A4BA0);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
  flex-shrink: 0;
}

.modal-vendor-name {
  margin: 0;
  font-weight: 700;
  color: #111827;
  font-size: 0.95rem;
}

.modal-vendor-email {
  margin: 0.15rem 0 0;
  color: #6B7280;
  font-size: 0.78rem;
}

.edit-body {
  padding: 0.5rem 1.5rem 0.6rem;
  overflow-y: auto;
  flex: 1;
}

.form-row {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.65rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.form-row label {
  color: #6B7280;
  font-size: 0.8rem;
  font-weight: 600;
}

.form-row input,
.form-row select {
  width: 100%;
  border: none;
  border-bottom: 1px solid transparent;
  padding: 0.3rem 0;
  color: #111827;
  font-size: 0.84rem;
  background: transparent;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-row input:focus {
  border-bottom-color: #1A4DBE;
}

.form-row input:disabled,
.form-row select:disabled {
  color: #111827;
  cursor: default;
}

.form-row-select select {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0.7rem 0.85rem;
  background: #ffffff;
}

.form-row-link {
  border-bottom: none;
  padding-top: 0.8rem;
}

.permit-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  background: none;
  padding: 0;
  color: #1A4DBE;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.15s ease;
}

.permit-link:hover {
  color: #2A4BA0;
}

.info-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid #F3F4F6;
}

.info-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.chip-yes {
  background: #dcfce7;
  color: #166534;
}

.chip-no {
  background: #F3F4F6;
  color: #6B7280;
}

.edit-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.55rem;
  padding: 0.8rem 1.5rem 1.2rem;
  border-top: 1px solid #F3F4F6;
}

.footer-btn {
  border: none;
  border-radius: 10px;
  padding: 0.55rem 1rem;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}

.footer-btn:hover {
  transform: translateY(-1px);
}

.footer-btn.neutral {
  background: #F3F4F6;
  color: #6B7280;
}

.footer-btn.neutral:hover {
  background: #e5e7eb;
}

.footer-btn.save {
  background: #1A4DBE;
  color: #ffffff;
}

.footer-btn.save:hover {
  background: #2A4BA0;
}

.footer-btn.save:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.footer-btn.approve {
  background: #dcfce7;
  color: #166534;
}

.footer-btn.approve:hover {
  background: #bbf7d0;
}

.footer-btn.decline,
.footer-btn.suspend {
  background: #fee2e2;
  color: #dc2626;
}

.footer-btn.decline:hover,
.footer-btn.suspend:hover {
  background: #fecaca;
}

.footer-btn.unsuspend {
  background: #d1fae5;
  color: #065f46;
}

.footer-btn.unsuspend:hover {
  background: #a7f3d0;
}

/* ── Toast ── */
.toast {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  border-radius: 14px;
  padding: 0.85rem 1.15rem;
  font-size: 0.84rem;
  font-weight: 700;
  z-index: 2100;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  animation: slide-in 0.25s ease-out;
}

.toast.success {
  background: #111827;
  color: #ffffff;
}

.toast.error {
  background: #ef4444;
  color: #ffffff;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes slide-in {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .vendor-management {
    padding: 1rem;
  }

  .setup-banner,
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-action,
  .ghost-action {
    width: 100%;
  }

  .vendor-table {
    min-width: 680px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }

  .edit-footer {
    flex-wrap: wrap;
  }

  .info-chips {
    gap: 0.35rem;
  }
}
</style>

