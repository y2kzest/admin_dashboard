<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30 flex-shrink-0">

    <!-- Left: hamburger (mobile) + page title -->
    <div class="flex items-center gap-3">
      <!-- Mobile hamburger -->
      <button
        class="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        @click="sidebarOpen = !sidebarOpen"
        aria-label="Toggle sidebar"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Page breadcrumb -->
      <div>
        <h1 class="text-base font-bold text-slate-800 leading-none">{{ pageTitle }}</h1>
        <p class="text-xs text-slate-400 mt-0.5">{{ pageSubtitle }}</p>
      </div>
    </div>

    <!-- Right: actions -->
    <div class="flex items-center gap-2">

      <!-- Notifications button -->
      <button class="relative h-9 w-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors" aria-label="Notifications">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
      </button>

      <!-- Profile dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          :aria-expanded="dropdownOpen"
        >
          <div class="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {{ userInitials }}
          </div>
          <span class="hidden sm:block text-sm font-semibold text-slate-700">{{ userName }}</span>
          <svg
            class="hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-200"
            :class="{ 'rotate-180': dropdownOpen }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <Transition name="dropdown">
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
          >
            <!-- User info header -->
            <div class="px-4 py-3.5 border-b border-slate-100 bg-slate-50">
              <div class="flex items-center gap-3">
                <div class="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {{ userInitials }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-bold text-slate-800 truncate">{{ userName }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ userEmail }}</p>
                </div>
              </div>
            </div>

            <!-- Menu items -->
            <div class="py-1.5">
              <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                <svg class="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span>Profile settings</span>
              </a>
            </div>

            <div class="border-t border-slate-100 py-1.5">
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSupabaseClient, useSupabaseUser, navigateTo, useRoute } from '#imports';

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const route = useRoute();

// Shared sidebar toggle state (synced with AdminSidebar via Nuxt useState)
const sidebarOpen = useState<boolean>('sidebarOpen', () => true);

// Dropdown state
const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// User info
const userName = computed(() => user.value?.user_metadata?.full_name || 'Admin');
const userEmail = computed(() => user.value?.email ?? '');
const userInitials = computed(() => {
  const name = userName.value.trim();
  const parts = name.split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
});

// Page title derived from route
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back, here\'s what\'s happening' },
  '/vendor-management': { title: 'Vendor Management', subtitle: 'Monitor and manage all registered sellers' },
  '/product-management': { title: 'Product Management', subtitle: 'Review and manage all product listings' },
};

const pageTitle = computed(() => {
  const match = Object.keys(pageTitles).find(k => route.path.startsWith(k));
  return match ? pageTitles[match].title : 'Admin';
});

const pageSubtitle = computed(() => {
  const match = Object.keys(pageTitles).find(k => route.path.startsWith(k));
  return match ? pageTitles[match].subtitle : '';
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));

async function handleLogout() {
  dropdownOpen.value = false;
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await navigateTo('/login');
  } catch (error: any) {
    console.error('Error logging out:', error.message);
  }
}
</script>
