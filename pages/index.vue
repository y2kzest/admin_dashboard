<template>
    <div class="flex items-center justify-center h-screen" style="background: #F8F9FC;">
        <div class="text-center">
            <div class="animate-spin h-8 w-8 border-2 border-t-transparent rounded-full mx-auto mb-3" style="border-color: #1A4DBE; border-top-color: transparent;"></div>
            <p class="text-sm font-medium" style="color: #6B7280;">Redirecting…</p>
        </div>
    </div>
</template>

<script setup lang="ts">
// Use a synchronous page-level middleware instead of onMounted.
// onMounted only runs client-side (after SSR), causing a visible flash and race
// conditions where a stale session cookie redirects to /dashboard before login.
// A page middleware runs on the server during SSR and on the client during
// navigation, so the redirect is instant and guaranteed.
definePageMeta({
    middleware: [
        function () {
            const user = useSupabaseUser();
            if (user.value) {
                return navigateTo('/dashboard', { replace: true });
            }
            return navigateTo('/login', { replace: true });
        },
    ],
});
</script>
