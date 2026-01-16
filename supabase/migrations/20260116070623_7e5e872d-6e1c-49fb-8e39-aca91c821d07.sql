-- Create enum for phase types
CREATE TYPE public.admission_phase AS ENUM ('foundation', 'differentiation', 'proof', 'leverage');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected', 'cooldown');

-- Table to track user's phase progress
CREATE TABLE public.phase_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    current_phase admission_phase NOT NULL DEFAULT 'foundation',
    foundation_unlocked boolean NOT NULL DEFAULT true,
    differentiation_unlocked boolean NOT NULL DEFAULT false,
    proof_unlocked boolean NOT NULL DEFAULT false,
    leverage_unlocked boolean NOT NULL DEFAULT false,
    foundation_completed boolean NOT NULL DEFAULT false,
    differentiation_completed boolean NOT NULL DEFAULT false,
    proof_completed boolean NOT NULL DEFAULT false,
    leverage_completed boolean NOT NULL DEFAULT false,
    -- User baseline from wizard for adaptive thresholds
    user_baseline jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Table to store phase submissions for verification
CREATE TABLE public.phase_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    phase admission_phase NOT NULL,
    submission_type text NOT NULL, -- e.g., 'sat_diagnostic', 'project_topic', 'mock_sat', etc.
    submission_data jsonb NOT NULL, -- Structured data (links, scores, etc.)
    status submission_status NOT NULL DEFAULT 'pending',
    ai_feedback text, -- AI's rejection reason or approval note
    submitted_at timestamp with time zone NOT NULL DEFAULT now(),
    reviewed_at timestamp with time zone,
    cooldown_until timestamp with time zone, -- When user can resubmit
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table to store phase completion requirements and their status
CREATE TABLE public.phase_requirements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    phase admission_phase NOT NULL,
    requirement_key text NOT NULL, -- e.g., 'sat_diagnostic_1350', 'project_topic', 'mock_sat_3x'
    requirement_label text NOT NULL,
    completed boolean NOT NULL DEFAULT false,
    completed_at timestamp with time zone,
    proof_link text, -- URL to proof
    proof_data jsonb, -- Additional structured data
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(user_id, phase, requirement_key)
);

-- Enable RLS on all tables
ALTER TABLE public.phase_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase_requirements ENABLE ROW LEVEL SECURITY;

-- RLS policies for phase_progress
CREATE POLICY "Users can view own phase progress" 
ON public.phase_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phase progress" 
ON public.phase_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phase progress" 
ON public.phase_progress FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for phase_submissions
CREATE POLICY "Users can view own submissions" 
ON public.phase_submissions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" 
ON public.phase_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions" 
ON public.phase_submissions FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for phase_requirements
CREATE POLICY "Users can view own requirements" 
ON public.phase_requirements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requirements" 
ON public.phase_requirements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requirements" 
ON public.phase_requirements FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger for phase_progress
CREATE TRIGGER update_phase_progress_updated_at
BEFORE UPDATE ON public.phase_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_phase_progress_user_id ON public.phase_progress(user_id);
CREATE INDEX idx_phase_submissions_user_id ON public.phase_submissions(user_id);
CREATE INDEX idx_phase_submissions_status ON public.phase_submissions(status);
CREATE INDEX idx_phase_requirements_user_phase ON public.phase_requirements(user_id, phase);