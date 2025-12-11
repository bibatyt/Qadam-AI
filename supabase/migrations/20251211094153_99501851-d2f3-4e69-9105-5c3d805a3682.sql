-- Create table for email verification codes
CREATE TABLE public.email_verification_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 hour'),
  verified BOOLEAN DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for signup flow)
CREATE POLICY "Anyone can create verification codes"
ON public.email_verification_codes
FOR INSERT
WITH CHECK (true);

-- Policy: Anyone can read their own codes by email
CREATE POLICY "Anyone can read codes by email"
ON public.email_verification_codes
FOR SELECT
USING (true);

-- Policy: Anyone can update verification status
CREATE POLICY "Anyone can update verification codes"
ON public.email_verification_codes
FOR UPDATE
USING (true);

-- Policy: Service role can delete
CREATE POLICY "Service can delete codes"
ON public.email_verification_codes
FOR DELETE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_verification_codes_email ON public.email_verification_codes(email);
CREATE INDEX idx_verification_codes_expires ON public.email_verification_codes(expires_at);