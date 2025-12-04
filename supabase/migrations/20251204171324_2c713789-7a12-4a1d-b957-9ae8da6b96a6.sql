-- Create roadmaps table to store user roadmap goals
CREATE TABLE public.roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gpa DECIMAL(3,2),
  sat_score INTEGER,
  ielts_score DECIMAL(2,1),
  current_grade TEXT NOT NULL,
  desired_major TEXT NOT NULL,
  target_country TEXT NOT NULL,
  main_goal TEXT NOT NULL,
  generated_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roadmap_tasks table for individual tasks
CREATE TABLE public.roadmap_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roadmap_id UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  month TEXT NOT NULL,
  month_index INTEGER NOT NULL,
  task_title TEXT NOT NULL,
  task_description TEXT,
  xp_reward INTEGER NOT NULL DEFAULT 15,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies for roadmaps
CREATE POLICY "Users can view own roadmaps" ON public.roadmaps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own roadmaps" ON public.roadmaps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own roadmaps" ON public.roadmaps
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own roadmaps" ON public.roadmaps
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for roadmap_tasks
CREATE POLICY "Users can view own tasks" ON public.roadmap_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks" ON public.roadmap_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.roadmap_tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.roadmap_tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_roadmaps_updated_at
  BEFORE UPDATE ON public.roadmaps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();