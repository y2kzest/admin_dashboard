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
        <span v-if="$route.path.startsWith('/vendor-management')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
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
        <span v-if="$route.path.startsWith('/product-management')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
      </NuxtLink>

      <NuxtLink
        to="/orders"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/orders')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
        </svg>
        <span>Orders</span>
        <span v-if="$route.path.startsWith('/orders')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
      </NuxtLink>

      <NuxtLink
        to="/users"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/users')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
        <span>Users</span>
        <span v-if="$route.path.startsWith('/users')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
      </NuxtLink>

      <p class="px-3 pt-5 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Operations</p>

      <NuxtLink
        to="/pickup-schedules"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/pickup-schedules')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span>Pickup Schedules</span>
        <span v-if="$route.path.startsWith('/pickup-schedules')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
      </NuxtLink>

      <NuxtLink
        to="/notifications"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/notifications')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span>Notifications</span>
        <span v-if="$route.path.startsWith('/notifications')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
      </NuxtLink>

      <NuxtLink
        to="/support"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/support')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
        </svg>
        <span>Buyer Support</span>
        <span v-if="$route.path.startsWith('/support')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
      </NuxtLink>

      <p class="px-3 pt-5 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Settings</p>

      <NuxtLink
        to="/settings"
        class="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="$route.path.startsWith('/settings')
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        <span>Settings</span>
        <span v-if="$route.path.startsWith('/settings')" class="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300"></span>
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
