<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Vendor Management (Pendings)</h1>
    
    <div class="bg-white p-6 rounded-xl shadow-lg mb-8">

      <div class="flex items-center justify-between mb-4 space-x-4">
        <div class="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
        </div>
        
        <button class="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stall No.</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bussiness Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statuts</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            
            <tr v-for="vendor in pendingVendors" :key="vendor.name" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.stallNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-green-600 hover:text-green-800 font-medium">View Details</button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">Approve</button>
                <button class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition-colors">Decline</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>

    <h2 class="text-2xl font-bold text-gray-800 mb-6">Monitoring Vendors Profile</h2>

    <div class="bg-white p-6 rounded-xl shadow-lg">
      
      <div class="flex items-center justify-between mb-4 space-x-4">
        <div class="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stall No.</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bussiness Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statuts</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            
            <tr v-for="vendor in monitoredVendors" :key="vendor.name" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.stallNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span :class="[
                  vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                ]">
                  {{ vendor.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">View</button>
                <button class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition-colors">Edit</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
    
  </div>
</template>

<script setup>
const pendingVendors = [
  { name: 'nena porknbeef', stallNo: '222', type: 'Retail', contact: '09134241451' },
  { name: 'dodongesda', stallNo: '333', type: 'Retail', contact: '0942145245' },
  { name: "denis'barbers", stallNo: '532', type: 'Service', contact: '0924524415' },
  { name: 'lugawow', stallNo: '331', type: 'Retail', contact: '09424451234' },
];

const monitoredVendors = [
  { name: 'nena porknbeef', stallNo: '222', type: 'Retail', contact: '09134241451', status: 'Active' },
  { name: 'dodongesda', stallNo: '333', type: 'Retail', contact: '0942145245', status: 'Active' },
  { name: "denis'barbers", stallNo: '532', type: 'Service', contact: '0924524415', status: 'Suspended' },
  { name: 'lugawow', stallNo: '331', type: 'Retail', contact: '09424451234', status: 'Active' },
];

definePageMeta({
  layout: 'default', 
});
</script>