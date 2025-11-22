<template>
    <div class="flex items-center justify-center h-screen bg-gray-50">
        <div class="text-center">
            <h1 class="text-xl font-bold text-gray-800">Redirecting...</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#imports';
import { onMounted } from 'vue'; // Import onMounted for clarity

// Walang middleware dito. Direct redirect lang sa login.
onMounted(() => {
    // Awtomatikong mag-redirect ang root sa login.
    // Gumamit ng replace: true para hindi maipon sa history ang '/' page.
    navigateTo('/login', { replace: true });
});
</script>