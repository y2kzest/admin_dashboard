<template>
  <div class="min-h-screen flex items-center justify-center p-8" style="background: #F8F9FC;">
    <Transition name="slide-up" appear>
      <div class="w-full max-w-md">

        <!-- Logo -->
        <div class="flex items-center justify-center gap-3 mb-10">
          <img src="/logo.png" alt="Quickcart" class="h-10 w-auto" />
          <span class="text-2xl font-bold tracking-tight" style="color: #111827;">Quickcart</span>
          <span class="text-[11px] font-semibold px-2.5 py-0.5" style="background: #1A4DBE; color: #fff; border-radius: 999px;">Admin</span>
        </div>

          <!-- Heading -->
          <div class="mb-8">
            <h2 class="text-3xl font-extrabold tracking-tight" style="color: #111827;">Welcome back</h2>
            <p class="mt-2 text-sm" style="color: #6B7280;">Sign in to your admin account to continue.</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold mb-1.5" style="color: #111827;">Email address</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4" style="color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  :disabled="loading"
                  placeholder="admin@quickcart.com"
                  class="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-sm shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  style="border-radius: 20px; color: #111827; outline: none;"
                  @focus="(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(26,77,190,0.15)'"
                  @blur="(e) => (e.target as HTMLInputElement).style.boxShadow = ''"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-semibold mb-1.5" style="color: #111827;">Password</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg class="w-4 h-4" style="color: #6B7280;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  :disabled="loading"
                  placeholder="Enter your password"
                  class="block w-full pl-10 pr-12 py-3 bg-white border border-gray-200 text-sm shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  style="border-radius: 20px; color: #111827; outline: none;"
                  @focus="(e) => (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(26,77,190,0.15)'"
                  @blur="(e) => (e.target as HTMLInputElement).style.boxShadow = ''"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :disabled="loading"
                  class="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors disabled:pointer-events-none"
                  style="color: #6B7280;"
                >
                  <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <div class="flex justify-end mt-2">
                <a href="#" class="text-xs font-semibold transition-colors" style="color: #1A4DBE;">Forgot password?</a>
              </div>
            </div>

            <!-- Error message -->
            <Transition name="fade">
              <div v-if="errorMessage" class="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200" style="border-radius: 20px;">
                <svg class="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm text-red-700 font-medium">{{ errorMessage }}</p>
              </div>
            </Transition>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2.5 py-3 px-4 text-white font-semibold text-sm shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 focus:outline-none"
              style="background: #1A4DBE; border-radius: 20px; border: none;"
              @mouseover="(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#2A4BA0' }"
              @mouseout="(e) => (e.currentTarget as HTMLButtonElement).style.background = '#1A4DBE'"
            >
              <svg v-if="loading" class="animate-spin w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ loading ? 'Signing in…' : 'Sign in to Admin' }}</span>
            </button>
          </form>

          <!-- Divider / extra link -->
          <p class="mt-8 text-center text-xs" style="color: #6B7280;">
            Protected admin area · Unauthorized access is prohibited
          </p>
        </div>
      </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabaseClient, navigateTo, useRoute } from '#imports'; 

// Disable the main layout for this specific page
definePageMeta({
    layout: false, 
    middleware: [], 
});

const supabase = useSupabaseClient();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null); 
const showPassword = ref(false); 

const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = null;
    
    try {
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (authError) throw authError;

        // Check if the account is suspended before granting access
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('status')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.status === 'suspended') {
                await supabase.auth.signOut();
                errorMessage.value = 'Your account has been suspended. Please contact the administrator.';
                return;
            }
        }
        
        const redirectPath: string | undefined = route.query.redirect as string | undefined;
        const destination = (redirectPath && redirectPath.startsWith('/')) ? redirectPath : '/dashboard';

        // Use a hard page reload instead of SPA navigation.
        // This prevents the two-click issue: Nuxt's SPA navigateTo() fires the global
        // middleware before useSupabaseUser() has been updated from the new session
        // (onAuthStateChange is async), so the middleware saw the user as null and
        // bounced back to /login. A full reload lets the server read the session cookie
        // and the user state is guaranteed to be set before any middleware runs.
        window.location.replace(destination);

    } catch (err: any) {
        console.error('Login Error:', err);
        errorMessage.value = 'Login failed. Please check your email and password.';
    } finally {
        loading.value = false;
    }
};
</script>
