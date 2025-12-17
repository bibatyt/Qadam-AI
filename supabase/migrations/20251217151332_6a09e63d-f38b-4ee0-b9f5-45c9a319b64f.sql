-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('student', 'parent');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    linked_student_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create student_paths table for the simplified path feature
CREATE TABLE public.student_paths (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    grade text NOT NULL,
    goal text NOT NULL,
    exams text[] NOT NULL DEFAULT '{}',
    target_year integer NOT NULL,
    milestones jsonb NOT NULL DEFAULT '[]',
    progress_percent integer NOT NULL DEFAULT 0,
    current_stage text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on student_paths
ALTER TABLE public.student_paths ENABLE ROW LEVEL SECURITY;

-- Students can manage their own paths
CREATE POLICY "Students can view own path"
ON public.student_paths
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own path"
ON public.student_paths
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own path"
ON public.student_paths
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Parents can view linked student's path
CREATE POLICY "Parents can view linked student path"
ON public.student_paths
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'parent'
      AND ur.linked_student_id = student_paths.user_id
  )
);

-- Parent link codes table
CREATE TABLE public.parent_link_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    code text NOT NULL UNIQUE,
    used boolean NOT NULL DEFAULT false,
    expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.parent_link_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create link codes"
ON public.parent_link_codes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view own codes"
ON public.parent_link_codes
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

-- Trigger for updated_at
CREATE TRIGGER update_student_paths_updated_at
BEFORE UPDATE ON public.student_paths
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();