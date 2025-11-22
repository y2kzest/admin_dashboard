<template>
  <div class="bg-white p-6 rounded-xl shadow-lg w-full"> 
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Category Demand</h2>
    
    <div class="flex items-start">
        <div class="w-36 h-36 mr-8 flex items-center justify-center relative"> 
            
            <div class="absolute w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                <div class="w-28 h-28 rounded-full" style="background: conic-gradient(#3B82F6 0% 50%, #F59E0B 50% 75%, #EF4444 75% 100%);"></div>
                <div class="absolute w-16 h-16 bg-white rounded-full"></div> 
            </div>

            <div class="absolute text-center">
                <span class="font-bold text-lg text-gray-800">80%</span><br>
                <span class="text-xs text-black-500">Category Share</span> 
            </div>
        </div>
        
        <div class="space-y-3 pt-2"> 
            <div class="flex items-center text-sm text-gray-600">
                <span class="w-2.5 h-2.5 rounded-full bg-blue-600 mr-2"></span> Meat
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <span class="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></span> Fish
            </div>
            <div class="flex items-center text-sm text-gray-600">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500 mr-2"></span> Fruit
            </div>
        </div>
    </div>
  </div>
</template>