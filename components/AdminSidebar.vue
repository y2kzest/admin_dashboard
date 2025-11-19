<template>
  <div class="hidden md:flex flex-col w-64 h-screen bg-[#263556] text-white flex-shrink-0 border-r border-gray-200 shadow-xl">
    
    <div class="flex items-center h-16 border-b border-gray-200 p-4 bg-white text-blue-900">
      <img src="/logo.png" alt="Quickcart Logo" class="h-8 w-auto mr-2"/>
      <span class="text-xl font-bold">Quickcart</span>
    </div>
    
    <nav class="flex-1 px-4 py-6 space-y-2">
      <NuxtLink to="/dashboard" class="flex items-center space-x-3 p-2 rounded-lg text-sm font-medium transition-colors" 
         :class="[$route.path.startsWith('/dashboard') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700']">
        <span class="w-5 h-5 flex items-center justify-center">📊</span>
        <span>Dashboard</span>
      </NuxtLink>
      
      <NuxtLink to="/vendor-management" class="flex items-center space-x-3 p-2 rounded-lg text-sm font-medium transition-colors" 
         :class="[$route.path.startsWith('/vendor-management') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700']">
        <span class="w-5 h-5 flex items-center justify-center">🧑‍💻</span>
        <span>Vendor Management</span>
      </NuxtLink>
      
      <NuxtLink to="/product-management" class="flex items-center space-x-3 p-2 rounded-lg text-sm font-medium transition-colors" 
         :class="[$route.path.startsWith('/product-management') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700']">
        <span class="w-5 h-5 flex items-center justify-center">📦</span>
        <span>Product Management</span>
      </NuxtLink>
    </nav>

    <div class="p-4 border-t border-[#405284] flex items-center">
      <div class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
        {{ userInitials }}
      </div>
      <div class="ml-3 text-xs overflow-hidden">
        <p class="font-medium truncate">{{ userName }}</p>
        <p class="text-gray-400 truncate">{{ userEmail }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const user = useSupabaseUser();

// Compute the user's name (placeholder or actual)
const userName = computed(() => {
  if (user.value && user.value.email) {
    // Assuming you want 'Admin' or to derive a name from the email
    return user.value.user_metadata?.full_name || 'Admin';
  }
  return 'Loading...';
});

// Compute the user's email
const userEmail = computed(() => {
  return user.value ? user.value.email : 'admin@quickcart.com';
});

// Compute initials for the avatar
const userInitials = computed(() => {
  const name = userName.value;
  if (name.includes(' ')) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  return name.substring(0, 2).toUpperCase();
});
</script>