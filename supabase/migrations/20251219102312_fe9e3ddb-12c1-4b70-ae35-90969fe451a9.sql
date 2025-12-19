-- First, drop the insecure RLS policies
DROP POLICY IF EXISTS "Anyone can read codes for linking" ON public.parent_link_codes;
DROP POLICY IF EXISTS "Anyone can mark codes as used" ON public.parent_link_codes;

-- Create a secure function to verify and use a parent link code
-- This function checks the code without exposing it publicly
CREATE OR REPLACE FUNCTION public.verify_and_use_parent_link_code(
  _code text,
  _parent_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _student_id uuid;
BEGIN
  -- Find the code and get the student_id if valid
  SELECT student_id INTO _student_id
  FROM public.parent_link_codes
  WHERE code = _code
    AND used = false
    AND expires_at > now();
  
  -- If no valid code found, return null
  IF _student_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Mark the code as used
  UPDATE public.parent_link_codes
  SET used = true
  WHERE code = _code;
  
  -- Create the parent role with linked student
  INSERT INTO public.user_roles (user_id, role, linked_student_id)
  VALUES (_parent_user_id, 'parent', _student_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET linked_student_id = _student_id;
  
  RETURN _student_id;
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.verify_and_use_parent_link_code(text, uuid) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_and_use_parent_link_code(text, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.verify_and_use_parent_link_code(text, uuid) FROM public;