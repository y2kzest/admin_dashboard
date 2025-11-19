<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Product & Service Management</h1>
    
    <div class="flex items-center justify-between mb-6 space-x-4">
      
      <div class="relative flex-grow">
        <input 
          type="text" 
          placeholder="Search Product" 
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </span>
      </div>
      
      <button class="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        Requests
      </button>
    </div>
    
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statuts</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          
          <tr v-for="product in products" :key="product.name" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.vendor }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {{ product.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
              <button class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">View</button>
              <button class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition-colors">Remove</button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>
    
  </div>
</template>

<script setup>
// Mock data to populate the table
const products = [
  { name: 'nena porknbeef', vendor: '222', category: 'Retail', status: 'Active' },
  { name: 'dodongesda', vendor: '333', category: 'Retail', status: 'Active' },
  { name: "denis'barbers", vendor: '532', category: 'Service', status: 'Active' },
  { name: 'lugawow', vendor: '331', category: 'Retail', status: 'Active' },
];

definePageMeta({
  layout: 'default', 
});
</script>