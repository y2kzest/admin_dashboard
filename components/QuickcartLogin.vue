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
      
      <div class="text-center text-sm space-y-4">
        <p class="text-gray-600">Don't Have An Account ? <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Sign Up</a></p>
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>
        
        <div class="flex space-x-4">
          <button @click="loginWithGoogle" class="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" class="w-4 h-4 mr-2"/> Google
          </button>
          <button @click="loginWithFacebook" class="flex items-center justify-center flex-1 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" class="w-4 h-4 mr-2"/> Facebook
          </button>
        </div>
      </div>

      <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 rounded-lg text-center">
        {{ errorMessage }}
      </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref(null);
const showPassword = ref(false); 

// Watch user status to navigate to dashboard
watch(user, async (currentUser) => {
  if (currentUser) {
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
    errorMessage.value = 'Login failed. Please check your email and password.';
  } finally {
    loading.value = false;
  }
};

// Social Login (Google)
const loginWithGoogle = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/dashboard` }
        });
        if (error) throw error;
    } catch (err) {
        console.error('Google Login Error:', err);
    }
};

// Social Login (Facebook)
const loginWithFacebook = async () => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: { redirectTo: `${window.location.origin}/dashboard` }
        });
        if (error) throw error;
    } catch (err) {
        console.error('Facebook Login Error:', err);
    }
};
</script>