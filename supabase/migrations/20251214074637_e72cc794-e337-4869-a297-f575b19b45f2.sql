-- Fix RLS policies for profiles table to explicitly block anonymous access
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create new policies with explicit authenticated user checks
CREATE POLICY "Authenticated users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Fix RLS policies for user_efc_data table to explicitly block anonymous access
DROP POLICY IF EXISTS "Users can view own efc data" ON public.user_efc_data;
DROP POLICY IF EXISTS "Users can insert own efc data" ON public.user_efc_data;
DROP POLICY IF EXISTS "Users can update own efc data" ON public.user_efc_data;

-- Create new policies with explicit authenticated user checks
CREATE POLICY "Authenticated users can view own efc data" 
ON public.user_efc_data 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own efc data" 
ON public.user_efc_data 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own efc data" 
ON public.user_efc_data 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);