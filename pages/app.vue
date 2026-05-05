<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Strip any base64 avatar_url that was mistakenly stored in JWT user metadata.
// Large data in metadata inflates the auth cookie and causes HTTP 431.
// The real avatar is now stored in the `profile` table instead.
onMounted(async () => {
  try {
    const meta = user.value?.user_metadata
    if (meta?.avatar_url && (meta.avatar_url as string).startsWith('data:')) {
      await supabase.auth.updateUser({
        data: { avatar_url: null },
      })
    }
  } catch { /* silent — non-critical cleanup */ }
})
</script>
