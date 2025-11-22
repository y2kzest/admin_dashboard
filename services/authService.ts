// File: ~/services/authService.ts

import { useSupabaseClient } from '#imports'; 

// Simpleng interface para sa inaasahan nating data mula sa DB.
interface UserRole {
    role: string;
}

export async function checkUserRole(): Promise<string | null> {
    const supabase = useSupabaseClient();
    
    // 1. KUNIN ANG USER ID (Aagapan nito ang "undefined" error)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.id) {
        // Ito ang mag-a-address sa "invalid input syntax for type uuid: 'undefined'" error.
        console.log("No active user session found. Returning null role.");
        return null;
    }

    // 2. I-query ang database
    try {
        // TANGGALIN ang generic type sa select. Hayaan na lang ang query
        const { data, error } = await supabase
            .from('user_roles') 
            .select('role') // I-select lang ang column
            .eq('user_id', user.id) 
            .single();

        // PGRST116 = Walang row nakita (Normal ito kung walang role)
        if (error && error.code !== 'PGRST116') throw error; 

        // I-Type Cast ang resulta at ibalik ang role
        // Ang result ay magiging { role: 'admin' } o null
        if (data) {
            // Gumamit ng Type Casting dito para hindi magreklamo si TypeScript.
            const userRoleData = data as UserRole;
            return userRoleData.role; 
        }

        return null;

    } catch (e) {
        console.error('Database role check failed:', e);
        return null;
    }
}