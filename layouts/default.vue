<template>
  <div class="flex h-screen bg-gray-50">
    
    <AdminSidebar />
    
    <div class="flex flex-col flex-1 overflow-y-auto">
      
      <AdminHeader />
      
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
    
  </div>
</template>