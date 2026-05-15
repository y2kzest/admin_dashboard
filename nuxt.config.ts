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

  // --- 4. App Head (Inter font) + Page Transition ---
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
        },
      ],
    },
  },
  
  // --- 5. General Nuxt Features ---
  devtools: { enabled: true },

  // --- 5b. Dev Server ---
  devServer: {
    port: 3000,
  },

  // --- 6. Nitro/Server Configuration ---
  nitro: {
    compatibilityDate: '2025-11-20',
    // Increase header size limit to handle large auth tokens during cleanup
    serverOptions: {
      maxHeaderSize: 131072, // 128 KB
    },
  },
});