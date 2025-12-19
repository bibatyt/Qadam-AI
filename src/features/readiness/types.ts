export interface ScoreBreakdown {
  gpa: number;
  english: number;
  extracurriculars: number;
  budgetMatch: number;
  profileClarity: number;
}

export interface Strategy {
  title: string;
  description: string;
}

export interface RoadmapItem {
  month: string;
  focus: string;
  actions: string[];
}

export interface ReadinessEvaluation {
  readinessScore: number;
  scoreBreakdown: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  riskExplanation: string;
  strategies: Strategy[];
  roadmap: RoadmapItem[];
}

export interface ReadinessFormData {
  gpa: string;
  englishLevel: string;
  ieltsScore: string;
  targetCountries: string[];
  annualBudget: string;
  intendedMajor: string;
  extracurriculars: string;
  grade: string;
  age: string;
}
