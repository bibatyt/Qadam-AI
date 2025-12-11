-- Add GPA column to roadmaps table
ALTER TABLE public.roadmaps ADD COLUMN IF NOT EXISTS gpa numeric;