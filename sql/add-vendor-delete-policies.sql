-- DELETE RLS policies for admin vendor deletion
-- Run this in Supabase Dashboard > SQL Editor

DROP POLICY IF EXISTS "Admins can delete seller profiles" ON public.seller_profiles;
CREATE POLICY "Admins can delete seller profiles"
ON public.seller_profiles FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
