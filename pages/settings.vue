<template>
  <div class="max-w-3xl mx-auto space-y-8">

    <!-- Page header -->
    <div>
      <h1 class="text-xl font-bold text-slate-800">System Settings</h1>
      <p class="text-sm text-slate-500 mt-1">Manage your admin profile and configure platform-wide preferences.</p>
    </div>

    <!-- ── Admin Profile ── -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div class="h-8 w-8 rounded-xl bg-[#2A4BA0]/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-[#2A4BA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <h2 class="text-base font-semibold text-slate-800">Admin Profile</h2>
      </div>

      <div class="px-6 py-6">
        <div class="flex flex-col sm:flex-row gap-6">

          <!-- Avatar -->
          <div class="flex flex-col items-center gap-3 flex-shrink-0">
            <div class="relative group">
              <div class="h-20 w-20 rounded-2xl overflow-hidden bg-[#2A4BA0] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                <img v-if="profilePreview" :src="profilePreview" class="h-full w-full object-cover" alt="Avatar" />
                <span v-else>{{ userInitials }}</span>
              </div>
              <label
                class="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Upload photo"
              >
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <input type="file" accept="image/*" class="hidden" @change="handleAvatarChange" ref="avatarInput" />
              </label>
            </div>
            <p class="text-xs text-slate-400 text-center">JPG, PNG or WebP<br/>Max 2 MB</p>
            <button
              v-if="avatarFile"
              @click="clearAvatarSelection"
              class="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >Remove selection</button>
          </div>

          <!-- Profile fields -->
          <div class="flex-1 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Display Name</label>
              <input
                v-model="profileForm.displayName"
                type="text"
                placeholder="Enter your name"
                class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4BA0]/30 focus:border-[#2A4BA0] transition-colors"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label>
              <input
                :value="userEmail"
                type="email"
                disabled
                class="w-full px-3 py-2.5 text-sm border border-slate-100 rounded-xl bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p class="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
            </div>
          </div>
        </div>

        <div class="mt-5 flex items-center justify-between">
          <p v-if="profileSaved" class="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Profile updated successfully
          </p>
          <span v-else></span>
          <button
            @click="saveProfile"
            :disabled="profileSaving"
            class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2A4BA0] hover:bg-[#153075] rounded-xl transition-colors disabled:opacity-60 shadow-sm"
          >
            <svg v-if="profileSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            <span>{{ profileSaving ? 'Saving...' : 'Save Profile' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- ── Platform Toggles ── -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div class="h-8 w-8 rounded-xl bg-[#2A4BA0]/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-[#2A4BA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <h2 class="text-base font-semibold text-slate-800">Platform Controls</h2>
      </div>

      <div class="divide-y divide-slate-50">

        <!-- Maintenance Mode -->
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 pr-8">
            <div class="flex items-center gap-2 mb-0.5">
              <p class="text-sm font-semibold text-slate-700">Maintenance Mode</p>
              <span v-if="settings.maintenanceMode" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F9B023]/20 text-[#b87a00]">ACTIVE</span>
            </div>
            <p class="text-xs text-slate-400">Disables platform access for all non-admin users</p>
          </div>
          <button
            @click="toggleSetting('maintenanceMode')"
            class="relative flex-shrink-0 h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="settings.maintenanceMode ? 'bg-[#F9B023] focus:ring-[#F9B023]/50' : 'bg-[#C5CDD2] focus:ring-slate-300'"
            :aria-checked="settings.maintenanceMode"
            role="switch"
          >
            <span
              class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
              :class="settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <!-- Vendor Registration -->
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 pr-8">
            <p class="text-sm font-semibold text-slate-700 mb-0.5">New Vendor Registration</p>
            <p class="text-xs text-slate-400">Allow new vendors to register on the platform</p>
          </div>
          <button
            @click="toggleSetting('allowVendorReg')"
            class="relative flex-shrink-0 h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="settings.allowVendorReg ? 'bg-[#2A4BA0] focus:ring-[#2A4BA0]/50' : 'bg-[#C5CDD2] focus:ring-slate-300'"
            :aria-checked="settings.allowVendorReg"
            role="switch"
          >
            <span
              class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
              :class="settings.allowVendorReg ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <!-- Buyer Registration -->
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 pr-8">
            <p class="text-sm font-semibold text-slate-700 mb-0.5">New Buyer Registration</p>
            <p class="text-xs text-slate-400">Allow new buyers to create accounts</p>
          </div>
          <button
            @click="toggleSetting('allowBuyerReg')"
            class="relative flex-shrink-0 h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="settings.allowBuyerReg ? 'bg-[#2A4BA0] focus:ring-[#2A4BA0]/50' : 'bg-[#C5CDD2] focus:ring-slate-300'"
            :aria-checked="settings.allowBuyerReg"
            role="switch"
          >
            <span
              class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
              :class="settings.allowBuyerReg ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <!-- Email Notifications -->
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 pr-8">
            <p class="text-sm font-semibold text-slate-700 mb-0.5">Email Notifications</p>
            <p class="text-xs text-slate-400">Send system emails for orders and account events</p>
          </div>
          <button
            @click="toggleSetting('emailNotifs')"
            class="relative flex-shrink-0 h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="settings.emailNotifs ? 'bg-[#2A4BA0] focus:ring-[#2A4BA0]/50' : 'bg-[#C5CDD2] focus:ring-slate-300'"
            :aria-checked="settings.emailNotifs"
            role="switch"
          >
            <span
              class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
              :class="settings.emailNotifs ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
        </div>

        <!-- Auto-approve Vendors -->
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex-1 pr-8">
            <p class="text-sm font-semibold text-slate-700 mb-0.5">Auto-approve Vendors</p>
            <p class="text-xs text-slate-400">Skip manual review and auto-approve new vendor applications</p>
          </div>
          <button
            @click="toggleSetting('autoApproveVendors')"
            class="relative flex-shrink-0 h-6 w-12 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="settings.autoApproveVendors ? 'bg-[#2A4BA0] focus:ring-[#2A4BA0]/50' : 'bg-[#C5CDD2] focus:ring-slate-300'"
            :aria-checked="settings.autoApproveVendors"
            role="switch"
          >
            <span
              class="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200"
              :class="settings.autoApproveVendors ? 'translate-x-6' : 'translate-x-0'"
            ></span>
          </button>
        </div>

      </div>
    </section>

    <!-- ── Platform Info ── -->
    <section class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div class="h-8 w-8 rounded-xl bg-[#2A4BA0]/10 flex items-center justify-center">
          <svg class="w-4 h-4 text-[#2A4BA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h2 class="text-base font-semibold text-slate-800">Platform Info</h2>
      </div>

      <div class="px-6 py-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Platform Name</label>
            <input
              v-model="settings.platformName"
              type="text"
              class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4BA0]/30 focus:border-[#2A4BA0] transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Support Email</label>
            <input
              v-model="settings.supportEmail"
              type="email"
              class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4BA0]/30 focus:border-[#2A4BA0] transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Max Products per Vendor</label>
            <input
              v-model.number="settings.maxProductsPerVendor"
              type="number"
              min="1"
              class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4BA0]/30 focus:border-[#2A4BA0] transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Platform Currency</label>
            <input
              v-model="settings.currency"
              type="text"
              class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2A4BA0]/30 focus:border-[#2A4BA0] transition-colors"
            />
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between">
          <p v-if="settingsSaved" class="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            Settings saved successfully
          </p>
          <span v-else></span>
          <button
            @click="saveSettings"
            :disabled="settingsSaving"
            class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2A4BA0] hover:bg-[#153075] rounded-xl transition-colors disabled:opacity-60 shadow-sm"
          >
            <svg v-if="settingsSaving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            <span>{{ settingsSaving ? 'Saving...' : 'Save Settings' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Toast -->
    <Transition name="fade">
      <div
        v-if="toast.show"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold"
        :class="toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#2A4BA0] text-white'"
      >
        <svg v-if="toast.type !== 'error'" class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
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
const user = useSupabaseUser()

// ── User info ──
const userEmail = computed(() => user.value?.email ?? '')
const userName = computed(() =>
  (user.value?.user_metadata?.display_name as string | undefined)
  || (user.value?.user_metadata?.full_name as string | undefined)
  || 'Admin'
)
const userInitials = computed(() => {
  const name = userName.value.trim()
  const parts = name.split(' ')
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
})

// ── Profile ──
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarFile = ref<File | null>(null)
// Shared with AdminHeader so saving updates the header avatar instantly
const sharedAvatarUrl = useState<string | null>('admin-avatar-url', () => null)
const profilePreview = ref<string | null>(null)
const profileSaving = ref(false)
const profileSaved = ref(false)

const profileForm = ref({
  displayName: userName.value,
})

function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { showToast('Image must be under 2 MB', 'error'); return }
  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = (ev) => { profilePreview.value = ev.target?.result as string }
  reader.readAsDataURL(file)
}

function clearAvatarSelection() {
  avatarFile.value = null
  loadCurrentAvatar().then(url => { profilePreview.value = url })
  if (avatarInput.value) avatarInput.value.value = ''
}

async function loadCurrentAvatar(): Promise<string | null> {
  // Load from profile table (not JWT metadata) to avoid bloating the auth token
  try {
    const uid = user.value?.id
    if (!uid) return null
    const { data } = await supabase
      .from('profile')
      .select('avatar_url')
      .eq('user_id', uid)
      .maybeSingle()
    const url = data?.avatar_url as string | null
    if (!url) return null
    if (url.startsWith('data:') || url.startsWith('http')) return url
    const { data: storageData } = supabase.storage.from('avatars').getPublicUrl(url)
    return storageData?.publicUrl || null
  } catch { return null }
}

/**
 * Resize an image File to at most maxSize×maxSize and return a base64 data URL.
 * This avoids any storage bucket dependency for the admin profile picture.
 */
function resizeToDataUrl(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const blobUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(blobUrl)
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas unavailable')); return }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Image load failed')) }
    img.src = blobUrl
  })
}

async function saveProfile() {
  profileSaving.value = true
  profileSaved.value = false
  try {
    // Always use the authoritative session — useSupabaseUser() can be stale
    const { data: { user: freshUser } } = await supabase.auth.getUser()
    const uid = freshUser?.id
    const freshEmail = freshUser?.email ?? userEmail.value

    if (!uid) {
      showToast('Session expired — please sign in again', 'error')
      navigateTo('/login')
      return
    }

    // 1. Update display name in auth metadata (name is tiny — fine in JWT)
    const { error: authErr } = await supabase.auth.updateUser({
      data: {
        display_name: profileForm.value.displayName,
        full_name: profileForm.value.displayName,
      },
    })
    if (authErr) throw authErr

    // 2. If a new avatar was chosen, resize to a small thumbnail and save to
    //    the `profile` table — NOT to user metadata — so the JWT stays small.
    //    `email` is NOT NULL in the schema, so always include it.
    if (avatarFile.value) {
      const dataUrl = await resizeToDataUrl(avatarFile.value, 128)
      const { error: profileErr } = await supabase
        .from('profile')
        .upsert(
          {
            user_id: uid,
            email: freshEmail,
            name: profileForm.value.displayName,
            avatar_url: dataUrl,
          } as any,
          { onConflict: 'user_id' }
        )
      if (profileErr) throw profileErr
      profilePreview.value = dataUrl
      sharedAvatarUrl.value = dataUrl
    }

    profileSaved.value = true
    avatarFile.value = null
    if (avatarInput.value) avatarInput.value.value = ''
    showToast('Profile updated successfully')
    setTimeout(() => { profileSaved.value = false }, 4000)
  } catch (e: any) {
    showToast(e?.message || 'Failed to update profile', 'error')
  } finally {
    profileSaving.value = false
  }
}

// ── Settings ──
const SETTINGS_KEY = 'admin_platform_settings'

const settings = ref({
  maintenanceMode: false,
  allowVendorReg: true,
  allowBuyerReg: true,
  emailNotifs: true,
  autoApproveVendors: false,
  platformName: 'Quickcart',
  supportEmail: 'support@quickcart.com',
  maxProductsPerVendor: 50,
  currency: 'PHP',
})

const settingsSaving = ref(false)
const settingsSaved = ref(false)

function toggleSetting(key: keyof typeof settings.value) {
  const s = settings.value as Record<string, unknown>
  if (typeof s[key] === 'boolean') {
    s[key] = !s[key]
    // Auto-save toggles immediately
    persistSettings()
  }
}

function persistSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
  } catch { /* ignore */ }
}

async function saveSettings() {
  settingsSaving.value = true
  settingsSaved.value = false
  try {
    // Try Supabase system_settings table first, fall back to localStorage
    const { error } = await supabase
      .from('system_settings')
      .upsert([{ id: 'main', ...settings.value, updated_at: new Date().toISOString() }])
    if (error && error.code !== '42P01') throw error
    persistSettings()
    settingsSaved.value = true
    showToast('Settings saved successfully')
    setTimeout(() => { settingsSaved.value = false }, 4000)
  } catch (e: any) {
    // Fallback: save to localStorage only
    persistSettings()
    settingsSaved.value = true
    showToast('Settings saved locally')
    setTimeout(() => { settingsSaved.value = false }, 4000)
  } finally {
    settingsSaving.value = false
  }
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      settings.value = { ...settings.value, ...saved }
    }
  } catch { /* ignore */ }
}

// ── Toast ──
const toast = ref({ show: false, message: '', type: 'success' })
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(async () => {
  loadSettings()
  profileForm.value.displayName = userName.value
  if (sharedAvatarUrl.value) {
    profilePreview.value = sharedAvatarUrl.value
  } else {
    const url = await loadCurrentAvatar()
    profilePreview.value = url
    sharedAvatarUrl.value = url
  }

  // Try to sync settings from Supabase
  supabase.from('system_settings').select('*').eq('id', 'main').single()
    .then(({ data }) => {
      if (data) settings.value = { ...settings.value, ...data }
    })
    .catch(() => { /* table may not exist, use localStorage */ })
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
