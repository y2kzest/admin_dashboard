// nuxt.config.ts

export default defineNuxtConfig({
  // --- 1. Modules ---
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss', // CRITICAL: This module is required for Tailwind to work
    // ... other modules
  ],

  // --- 2. Global CSS Import ---
  css: [
    // CRITICAL: Tells Nuxt to import your stylesheet globally where Tailwind is defined
    '~/assets/css/main.css', 
  ],

  // --- 3. Supabase Configuration ---
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/'],
    },
    // Add other module options here if needed
  },

  // --- 4. PostCSS/Tailwind (Handled by @nuxtjs/tailwindcss module) ---
  // The @nuxtjs/tailwindcss module automatically configures PostCSS for you.
  // You do not need the manual `postcss` block shown in your previous code.

  // --- 5. General Nuxt Features ---
  devtools: { enabled: true }, // Highly recommended for debugging
});