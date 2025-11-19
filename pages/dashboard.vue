<template>
  <div class="mx-auto max-w-6xl"> 
    
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      
      <div class="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Total Vendors</p>
          <p class="text-3xl font-bold text-gray-900">387</p>
          <div class="flex items-center text-sm mt-1">
            <span class="text-green-500 flex items-center">
              <span class="mr-1">▲</span> 8.5%
            </span>
            <span class="text-gray-500 ml-1">Up from yesterday</span>
          </div>
        </div>
        <span class="p-3 bg-indigo-100 rounded-full text-indigo-600">
            <span class="w-6 h-6 flex items-center justify-center">🧑‍💻</span>
        </span>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Active Vendors</p>
          <p class="text-3xl font-bold text-gray-900">233</p>
          <div class="flex items-center text-sm mt-1">
            <span class="text-green-500 flex items-center">
              <span class="mr-1">▲</span> 1.3%
            </span>
            <span class="text-gray-500 ml-1">Up from last week</span>
          </div>
        </div>
        <span class="p-3 bg-yellow-100 rounded-full text-yellow-600">
            <span class="w-6 h-6 flex items-center justify-center">🔆</span>
        </span>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Pending Vendors</p>
          <p class="text-3xl font-bold text-gray-900">23</p>
          <div class="flex items-center text-sm mt-1">
            <span class="text-red-500 flex items-center">
              <span class="mr-1">▼</span> 4.3%
            </span>
            <span class="text-gray-500 ml-1">Down from yesterday</span>
          </div>
        </div>
        <span class="p-3 bg-red-100 rounded-full text-red-600">
            <span class="w-6 h-6 flex items-center justify-center">⏰</span>
        </span>
      </div>

      <div class="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">Total Orders Today</p>
          <p class="text-3xl font-bold text-gray-900">2040</p>
          <div class="flex items-center text-sm mt-1">
            <span class="text-green-500 flex items-center">
              <span class="mr-1">▲</span> 1.8%
            </span>
            <span class="text-gray-500 ml-1">Up from yesterday</span>
          </div>
        </div>
        <span class="p-3 bg-green-100 rounded-full text-green-600">
            <span class="w-6 h-6 flex items-center justify-center">📈</span>
        </span>
      </div>

    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <SalesDetailsChart class="lg:col-span-2" />
        
        <CategoryDemandChart class="lg:col-span-1" />
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default', 
});
</script>