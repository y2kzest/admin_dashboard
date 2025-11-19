<template>
  <header class="h-16 bg-white shadow-sm flex items-center justify-end px-6 sticky top-0 z-10 w-full"> 
    
    <button class="text-gray-500 hover:text-gray-700 relative mr-4">
      <div class="w-6 h-6 flex items-center justify-center">🔔</div>
      <span class="absolute top-0 right-0 block h-2 w-2 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-white bg-red-500"></span>
    </button>

    <div class="relative group">
      <div class="flex items-center space-x-2 text-gray-700 cursor-pointer">
        <span class="text-sm font-medium hidden sm:inline">Admin</span>
        <div class="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">👤</div>
      </div>

      <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-20">
        <div class="py-1">
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          <button 
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>

  </header>
</template>

<script setup>
// Import Supabase composable
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear the user state and redirect to login page
    user.value = null;
    await navigateTo('/login');
  } catch (error) {
    console.error('Error logging out:', error.message);
    alert('Failed to log out.');
  }
};
</script>