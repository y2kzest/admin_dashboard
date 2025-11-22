<template>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full">
    <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">Sales Details</h2>
        <select class="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-600 focus:ring-blue-500 focus:border-blue-500">
            <option>October</option>
            <option>September</option>
            <option>August</option>
        </select>
    </div>
    
    <div class="relative pt-4">
        <div class="absolute left-0 w-8 text-xs text-gray-500 leading-tight">
            <div class="absolute top-0">100 %</div>
            <div class="absolute top-[20%]">80 %</div>
            <div class="absolute top-[40%]">60 %</div>
            <div class="absolute top-[60%]">40 %</div>
            <div class="absolute top-[80%]">20 %</div>
        </div>

        <div class="ml-10 h-64 border-b border-l border-gray-200 relative">
            
            <div class="absolute w-full border-t border-gray-200" style="top: 20%;"></div>
            <div class="absolute w-full border-t border-gray-200" style="top: 40%;"></div>
            <div class="absolute w-full border-t border-gray-200" style="top: 60%;"></div>
            <div class="absolute w-full border-t border-gray-200" style="top: 80%;"></div>

            <div class="absolute inset-0" :style="chartBackgroundStyle"></div>

            <div class="absolute text-center bg-blue-600 text-white text-xs px-1 py-0.5 rounded-md shadow-md" style="top: 10%; left: 45%; transform: translateX(-50%);">
                64,366
            </div>
        </div>
        
        <div class="ml-10 flex justify-between text-xs text-gray-500 pt-1">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
        </div>
    </div>
    
    <div class="text-xs text-gray-500 text-center mt-3">
        Peak Hours: 8-10 AM, 4-6 PM
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Base64 encoded SVG for line chart, matching the shape in the design.
const chartBackgroundStyle = computed(() => ({
  backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDI2MCI+PHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzM2NjVGRiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHBvaW50cz0iMCwxNzAgMTQwLDE3MCAyNTAsMTAwIDM1MCwxMzAgNDUwLDQwIDU1MCwxNjAgNjgwLDE0MCA3ODAsMjEwIDg4MCwxMjAgOTQwLDE2MCAxMDAwLDE4MCIvPjwvc3ZnPg==")`,
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));
</script>