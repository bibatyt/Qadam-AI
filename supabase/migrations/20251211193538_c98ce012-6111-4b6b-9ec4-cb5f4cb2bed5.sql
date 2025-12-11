-- Drop the insecure INSERT policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a secure INSERT policy that blocks all client-side inserts
-- Notifications can only be inserted by service role (edge functions)
CREATE POLICY "Only service role can insert notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (false);

-- Note: Edge functions use service_role key which bypasses RLS,
-- so they can still insert notifications while clients cannot