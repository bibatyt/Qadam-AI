-- Add unique constraint for phase_requirements upsert
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'phase_requirements_user_phase_key_unique'
  ) THEN
    CREATE UNIQUE INDEX phase_requirements_user_phase_key_unique 
    ON public.phase_requirements (user_id, phase, requirement_key);
  END IF;
END $$;