<template>
  <div class="flex items-center justify-center min-h-screen" style="background-color: #192a56;">
    <QuickcartLogin />
  </div>
</template>

<script setup>
// This page uses the component we just defined
// The component handles all login logic and navigation.

// CRITICAL: This ensures the page uses NO default layout styles
definePageMeta({
  layout: false 
});
</script>