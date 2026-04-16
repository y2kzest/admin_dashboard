<template>
  <aside class="flex flex-col w-64 h-full bg-slate-900 text-white flex-shrink-0">

    <!-- Logo -->
    <div class="flex items-center h-16 px-5 border-b border-slate-800/80">
      <img src="/logo.png" alt="Quickcart" class="h-7 w-auto mr-2.5 flex-shrink-0" />
      <span class="text-base font-bold text-white tracking-tight">Quickcart</span>
      <span class="ml-auto text-[10px] font-semibold bg-indigo-600/80 border border-indigo-500/40 text-indigo-100 px-2 py-0.5 rounded-full flex-shrink-0">Admin</span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
      <p class="px-3 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Overview</p>

      <NuxtLink
        to="/dashboard"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/dashboard')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-2a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"/>
        </svg>
        <span>Dashboard</span>
        <span
          v-if="$route.path.startsWith('/dashboard')"
          class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"
        ></span>
      </NuxtLink>

      <p class="px-3 pt-5 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Management</p>

      <NuxtLink
        to="/vendor-management"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/vendor-management')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>Vendors</span>
        <span
          v-if="$route.path.startsWith('/vendor-management')"
          class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"
        ></span>
      </NuxtLink>

      <NuxtLink
        to="/product-management"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/product-management')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7l12 6"/>
        </svg>
        <span>Products</span>
        <span
          v-if="$route.path.startsWith('/product-management')"
          class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"
        ></span>
      </NuxtLink>
    </nav>

    <!-- User card (bottom) -->
    <div class="p-3 border-t border-slate-800/80">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60">
        <div class="h-8 w-8 flex-shrink-0 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-white truncate leading-tight">{{ userName }}</p>
          <p class="text-xs text-slate-400 truncate">{{ userEmail }}</p>
        </div>
        <div class="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" title="Online"></div>
      </div>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const user = useSupabaseUser();

const userName = computed(() => {
  return user.value?.user_metadata?.full_name || 'Admin';
});

const userEmail = computed(() => {
  return user.value?.email ?? 'admin@quickcart.com';
});

const userInitials = computed(() => {
  const name = userName.value;
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});
</script>
