-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create verification codes" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Anyone can read codes by email" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Anyone can update verification codes" ON public.email_verification_codes;
DROP POLICY IF EXISTS "Service can delete codes" ON public.email_verification_codes;

-- Create restrictive policies - only service role (edge functions) can access this table
-- No client-side access allowed since edge functions use service role which bypasses RLS

-- If we need authenticated users to check their own verification status (optional)
CREATE POLICY "Users can only view their own verification codes by email"
ON public.email_verification_codes
FOR SELECT
USING (false); -- No client access - all operations go through edge functions

CREATE POLICY "No direct inserts from clients"
ON public.email_verification_codes
FOR INSERT
WITH CHECK (false); -- Only service role (edge functions) can insert

CREATE POLICY "No direct updates from clients"
ON public.email_verification_codes
FOR UPDATE
USING (false); -- Only service role (edge functions) can update

CREATE POLICY "No direct deletes from clients"
ON public.email_verification_codes
FOR DELETE
USING (false); -- Only service role (edge functions) can delete