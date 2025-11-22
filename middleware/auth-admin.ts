import { navigateTo, defineNuxtRouteMiddleware } from '#app';
import { checkUserRole } from '~/services/authService';

// Gumagamit ng `defineNuxtRouteMiddleware` para sa tamang type-checking at Nuxt 3/4 pattern
export default defineNuxtRouteMiddleware(async (to, from) => {
    // Tawagin ang function na nag-checheck ng role sa DB
    const role = await checkUserRole();

    // 1. KRITIKAL: Kapag ang user ay HINDI 'admin'
    if (role !== 'admin') {
        console.warn('ACCESS DENIED: User is not admin. Role:', role, '. Redirecting to login.');
        
        // --- KRITIKAL NA PAG-AAYOS DITO ---
        // Ginagamit ang object notation para sa query parameters para masiguro ang tamang type at encoding.
        // Ang `to.path` ay ang page na gusto nilang puntahan (e.g., /dashboard).
        
        return navigateTo({
            path: '/login', // Laging sa /login magre-redirect
            query: { 
                redirect: to.path // Isasama ang original path bilang query param
            }
        }, { replace: true });
        // --- KRITIKAL NA PAG-AAYOS DITO ---
    }
    
    // 2. Kapag admin, hayaan lang na mag-tuloy sa protected page.
    console.info('ACCESS GRANTED: Admin user found. Continuing to:', to.path);

    return;
});