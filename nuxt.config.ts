// nuxt.config.ts

export default defineNuxtConfig({
  // --- 1. Modules ---
  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    // ... other modules
  ],

  // --- 2. Global CSS Import ---
  css: [
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
  // (No manual postcss block is needed here)

  // --- 5. General Nuxt Features ---
  devtools: { enabled: true },

  // --- 6. Nitro/Server Configuration (ADDED FIX) ---
  nitro: {
    compatibilityDate: '2025-11-20',
  },
});