export interface Essay {
  id: string;
  title: string;
  content: string;
  type: 'personal' | 'supplemental' | 'why_us' | 'activity';
  university?: string;
  wordCount: number;
  impactScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EssayAnalysis {
  impactScore: number;
  strengths: string[];
  improvements: string[];
  voiceScore: number; // How much it sounds like the user
  authenticityTips: string[];
}

export interface EssayFeedback {
  category: 'structure' | 'voice' | 'content' | 'hook' | 'conclusion';
  type: 'positive' | 'suggestion';
  text: string;
  position?: { start: number; end: number };
}

export const ESSAY_TYPES = [
  { id: 'personal', label: { ru: 'Personal Statement', en: 'Personal Statement', kk: 'Personal Statement' }, maxWords: 650 },
  { id: 'supplemental', label: { ru: 'Supplemental Essay', en: 'Supplemental Essay', kk: 'Supplemental Essay' }, maxWords: 400 },
  { id: 'why_us', label: { ru: 'Why This University', en: 'Why This University', kk: 'Why This University' }, maxWords: 300 },
  { id: 'activity', label: { ru: 'Activity Essay', en: 'Activity Essay', kk: 'Activity Essay' }, maxWords: 150 },
] as const;
