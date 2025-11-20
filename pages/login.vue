<template>
    <div class="h-screen flex items-center justify-center bg-gray-900">
        <div class="w-full max-w-sm p-8 bg-white rounded-3xl shadow-2xl space-y-6">
            
            <div class="text-center space-y-2">
                <!-- Huwag kalimutang i-check kung nandoon ang /public/logo.png file mo. -->
                <img src="/logo.png" alt="Quickcart Logo" class="h-12 w-auto mx-auto"/> 
                <p class="text-xs text-gray-500 font-medium">Your Digital Palengke</p>
                <h2 class="text-2xl font-bold text-gray-900 pt-4">Login to your account</h2>
            </div>
            
            <form @submit.prevent="handleLogin" class="space-y-4">
                
                <!-- Email Input -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        id="email" 
                        v-model="email" 
                        type="email" 
                        required 
                        :disabled="loading"
                        placeholder="balomia@gmail.com"
                        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <div class="relative mt-1">
                        <input 
                            id="password" 
                            v-model="password" 
                            :type="showPassword ? 'text' : 'password'" 
                            required 
                            :disabled="loading"
                            placeholder="Enter your password"
                            class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10 transition"
                        />
                        <button 
                            type="button" 
                            @click="showPassword = !showPassword" 
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                            :disabled="loading"
                        >
                            <span v-if="showPassword" aria-label="Hide password">👁️</span>
                            <span v-else aria-label="Show password">🔒</span>
                        </button>
                    </div>
                    <div class="flex justify-end mt-1">
                        <a href="#" class="text-xs text-blue-600 hover:text-blue-800 transition">Forgot?</a>
                    </div>
                </div>
                
                <!-- Submit Button -->
                <button 
                    type="submit" 
                    :disabled="loading" 
                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span v-if="loading" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging In...
                    </span>
                    <span v-else>
                        Login now
                    </span>
                </button>
            </form>
            
            <!-- Error Message -->
            <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 rounded-lg text-center border border-red-200">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabaseClient, navigateTo, useRoute } from '#imports'; 

// Disable the main layout for this specific page
definePageMeta({
    layout: false, 
    // FIX: Ginagamit ang empty array [] para sa middleware upang masunod ang Nuxt type definitions.
    middleware: [], 
});

const supabase = useSupabaseClient();
const route = useRoute(); // Initialize useRoute

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null); 
const showPassword = ref(false); 

// Email/Password Login
const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = null;
    
    console.log('Login attempt started...');
    
    try {
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (authError) throw authError;
        
        // Kunin ang redirect path mula sa URL query 
        const redirectPath: string | undefined = route.query.redirect as string | undefined;
        
        // I-determine ang destination. Kung may redirectPath, gamitin ito. Kung wala, '/dashboard'.
        const destination = redirectPath || '/dashboard';

        console.log(`Login successful! Redirecting to: ${destination}`);
        
        await navigateTo(destination);

    } catch (err: any) {
        console.error('Login Error:', err);
        errorMessage.value = 'Login failed. Please check your email and password.';
    } finally {
        loading.value = false;
    }
};
</script>