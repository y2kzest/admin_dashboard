    
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
        <div v-if="isLoading" class="text-center py-8">
            <p class="text-blue-600">Loading pending vendor requests...</p>
        </div>
        <div v-else-if="pendingVendors.length === 0" class="text-center py-8 text-gray-500">
            <p>?? No pending vendor applications found.</p>
        </div>
        
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name / Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stall No.</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
            

            <tr v-for="vendor in pendingVendors" :key="vendor.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name || vendor.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.stall_no || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.business_type || 'N/A' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact || 'N/A' }}</td>
            <tr v-for="vendor in pendingVendors" :key="vendor.name" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.stallNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.type }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-green-600 hover:text-green-800 font-medium">View Details</button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button 
                    @click="updateStatus(vendor.id, 'approved')"
                    class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">
                    Approve
                </button>
                <button 
                    @click="updateStatus(vendor.id, 'declined')"
                    class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition-colors">
                    Decline
                </button>
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
              <div v-if="isLoading" class="text-center py-8">
                <p class="text-blue-600">Loading pending vendor requests...</p>
              </div>
              <div v-else-if="pendingVendors.length === 0" class="text-center py-8 text-gray-500">
                <p>?? No pending vendor applications found.</p>
              </div>

              <table v-else class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name / Email</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stall No.</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">

                  <tr v-for="vendor in pendingVendors" :key="vendor.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name || vendor.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.stall_no || vendor.stallNo || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.business_type || vendor.type || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button class="text-green-600 hover:text-green-800 font-medium">View Details</button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        @click="updateStatus(vendor.id, 'approved')"
                        class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">
                        Approve
                      </button>
                      <button
                        @click="updateStatus(vendor.id, 'declined')"
                        class="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-xs transition-colors">
                        Decline
                      </button>
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
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name / Email</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stall No.</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">

                  <tr v-for="vendor in monitoredVendors" :key="vendor.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ vendor.name || vendor.email }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.stall_no || vendor.stallNo || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.business_type || vendor.type || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ vendor.contact || 'N/A' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span :class="[
                        (vendor.status === 'approved' || vendor.status === 'Active') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize'
                      ]">
                        {{ vendor.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button class="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-xs transition-colors">View</button>
                      <button class="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-xs transition-colors">Edit</button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      </template>

      <script setup>
      import { ref, onMounted } from 'vue';

      // Supabase composable provided by @nuxtjs/supabase
      const supabase = useSupabaseClient();

      const pendingVendors = ref([]);
      const monitoredVendors = ref([]);
      const isLoading = ref(false);

      async function fetchVendors() {
        isLoading.value = true;
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'seller');

          if (error) throw error;

          pendingVendors.value = (data || []).filter((v) => v.status === 'pending');
          monitoredVendors.value = (data || []).filter((v) => v.status !== 'pending');
        } catch (e) {
          console.error('Error fetching vendors:', e);
        } finally {
          isLoading.value = false;
        }
      }

      async function updateStatus(vendorId, newStatus) {
        const action = newStatus === 'approved' ? 'Approve' : 'Decline';
        if (!confirm(`Are you sure you want to ${action} this vendor?`)) return;

        try {
          const { data: updatedData, error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', vendorId)
            .select('*')
            .single();

          if (error) throw error;

          pendingVendors.value = pendingVendors.value.filter((v) => v.id !== vendorId);
          if (updatedData) monitoredVendors.value.push(updatedData);
        } catch (e) {
          console.error('Error updating status:', e);
        }
      }

      onMounted(() => {
        fetchVendors();
      });
