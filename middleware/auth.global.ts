// File: ~/middleware/auth.global.ts

import { useSupabaseUser, navigateTo } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser();
    
    // 1. Ilista ang public pages, kasama ang root path '/'
    const publicPages = ['/login', '/signup', '/forgot-password', '/']; 
    const isPublic = publicPages.includes(to.path);
    
    // Scenario A: Naka-login at nag-a-access ng Public Page (e.g., /login or /)
    if (user.value && isPublic) {
        // I-redirect sa dashboard.
        return navigateTo('/dashboard', { replace: true });
    }

    // Scenario B: Hindi Naka-login at gustong pumunta sa Protected Page
    if (!user.value && !isPublic) {
        // I-redirect sa login page. Tiyakin na hindi nagre-redirect sa sarili nito.
        if (to.path !== '/login') {
            return navigateTo('/login', { replace: true });
        }
    }
});