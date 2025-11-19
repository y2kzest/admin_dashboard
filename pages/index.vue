<template>
  <div />
</template>

<script setup>
// Immediately redirect the root path to the login page
await navigateTo('/login');

definePageMeta({
  layout: false 
});
</script>