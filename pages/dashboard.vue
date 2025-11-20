<template>
    <div>
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard 
                icon="i-heroicons-user-group" 
                title="Total Vendors" 
                value="387" 
                change="8.5% Up from yesterday" 
                color="text-purple-600" 
            />
            <StatCard 
                icon="i-heroicons-user-circle" 
                title="Active Vendors" 
                value="233" 
                change="1.3% Up from last week" 
                color="text-yellow-600" 
            />
            <StatCard 
                icon="i-heroicons-clock" 
                title="Pending Vendors" 
                value="23" 
                change="4.3% Down from yesterday" 
                color="text-red-600" 
            />
            <StatCard 
                icon="i-heroicons-shopping-bag" 
                title="Total Orders Today" 
                value="354" 
                change="1.8% Up from yesterday" 
                color="text-green-600" 
            />
        </div>

        <div class="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">Sales Details</h2>
            
            <SalesDetailsChart /> 
            
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-lg">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">Category Demand</h2>
            
            <CategoryDemandChart />
            
        </div>
        
    </div>
</template>

<script setup lang="ts">
// Tinitiyak na ginagamit ang 'auth-admin' middleware para maprotektahan ang page.
definePageMeta({
    middleware: ['auth-admin']
});
</script>