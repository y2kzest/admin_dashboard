<template>
  <div class="h-screen flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-sm p-8 bg-white rounded-3xl shadow-2xl space-y-6">
      <div class="text-center space-y-2">
        <img src="/logo.png" alt="Quickcart Logo" class="h-12 w-auto mx-auto" />
        <p class="text-xs text-gray-500 font-medium">Seller Application</p>
        <h2 class="text-2xl font-bold text-gray-900 pt-4">Create seller account</h2>
      </div>

      <form @submit.prevent="handleSignup" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            :disabled="loading"
            placeholder="seller@email.com"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label for="storeName" class="block text-sm font-medium text-gray-700">Store Name (optional)</label>
          <input
            id="storeName"
            v-model="storeName"
            type="text"
            :disabled="loading"
            placeholder="My Store"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            :disabled="loading"
            placeholder="At least 6 characters"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            minlength="6"
            :disabled="loading"
            placeholder="Repeat your password"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Submitting...' : 'Submit seller request' }}
        </button>
      </form>

      <div v-if="errorMessage" class="p-3 text-sm text-red-700 bg-red-50 rounded-lg text-center border border-red-200">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="p-3 text-sm text-green-700 bg-green-50 rounded-lg text-center border border-green-200">
        {{ successMessage }}
      </div>

      <p class="text-center text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="text-blue-600 hover:text-blue-800 font-medium">Log in</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { navigateTo, useSupabaseClient } from '#imports'

definePageMeta({
  layout: false,
  middleware: []
})

const supabase = useSupabaseClient()

const email = ref('')
const storeName = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const handleSignup = async () => {
  loading.value = true
  errorMessage.value = null
  successMessage.value = null

  try {
    if (password.value !== confirmPassword.value) {
      throw new Error('Passwords do not match.')
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          role: 'seller',
          store_name: storeName.value || null
        }
      }
    })

    if (error) {
      throw error
    }

    if (data.session) {
      await supabase.auth.signOut()
    }

    successMessage.value = 'Request submitted. Wait for admin approval before accessing seller features.'
    await navigateTo('/login?sellerSignup=1', { replace: true })
  } catch (error: any) {
    console.error('Seller signup failed:', error)
    errorMessage.value = error?.message || 'Signup failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
