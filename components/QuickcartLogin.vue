<template>
    <div class="w-full max-w-sm p-8 bg-white rounded-3xl shadow-2xl space-y-6">
        
        <div class="text-center space-y-2">
            <img src="/logo.png" alt="Quickcart Logo" class="h-12 w-auto mx-auto"/> 
            <p class="text-xs text-gray-500 font-medium">Your Digital Palengke</p>
            <h2 class="text-2xl font-bold text-gray-900 pt-4">Login to your account</h2>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    id="email" 
                    v-model="email" 
                    type="email" 
                    required 
                    placeholder="balomia@gmail.com"
                    class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <div class="relative mt-1">
                    <input 
                        id="password" 
                        v-model="password" 
                        :type="showPassword ? 'text' : 'password'" 
                        required 
                        placeholder="Enter your password"
                        class="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 pr-10"
                    />
                    <button 
                        type="button" 
                        @click="showPassword = !showPassword" 
                        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                        <span v-if="showPassword">👁️</span>
                        <span v-else>🔒</span>
                    </button>
                </div>
                <div class="flex justify-end mt-1">
                    <a href="#" class="text-xs text-blue-600 hover:text-blue-800">Forgot?</a>
                </div>
            </div>
            
            <button 
                type="submit" 
                :disabled="loading" 
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ loading ? 'Logging In...' : 'Login now' }}
            </button>
        </form>
        

        <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 rounded-lg text-center">
            {{ errorMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSupabaseClient, useSupabaseUser } from '#imports';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const email = ref('');
const password = ref('');
const loading = ref(false);

// Ginawang string | null para tanggapin ang string error message at null
const errorMessage = ref<string | null>(null); 
const showPassword = ref(false); 

// Redirect logic pagkatapos mag-login
watch(user, async (currentUser) => {
    if (currentUser) {
        // MAHALAGA: Magre-redirect sa /admin. Ang /admin page na ang bahala mag-check ng role.
        await navigateTo('/dashboard'); 
    }
}, { immediate: true });

// Email/Password Login
const handleLogin = async () => {
    loading.value = true;
    errorMessage.value = null;
    
    try {
        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        if (authError) throw authError;
        
    } catch (err) {
        console.error(err);
        // Ngayon, string na ang ina-assign, at wala nang Type error
        errorMessage.value = 'Login failed. Please check your email and password.';
    } finally {
        loading.value = false;
    }
};

// ... Iba pang Social Login Functions (Huwag kalimutang idagdag ang logic dito kung ginagamit mo)
const loginWithGoogle = async () => { /* ... */ };
const loginWithFacebook = async () => { /* ... */ };
</script>