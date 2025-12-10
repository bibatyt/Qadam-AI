export interface OnboardingData {
  // Step 1: Goal
  targetUniversity: string;
  desiredMajor: string;
  mainGoal: string;
  
  // Step 2: Profile
  currentGrade: string;
  gpa: string;
  targetCountry: string;
  
  // Step 3: Auth (handled separately)
}

export type OnboardingStep = 1 | 2 | 3;

export const GOALS = [
  { id: 'top_uni', label: { ru: 'Поступить в топовый университет', en: 'Get into a top university', kk: 'Үздік университетке түсу' } },
  { id: 'scholarship', label: { ru: 'Получить грант/стипендию', en: 'Get a scholarship', kk: 'Грант/стипендия алу' } },
  { id: 'abroad', label: { ru: 'Учиться за рубежом', en: 'Study abroad', kk: 'Шетелде оқу' } },
  { id: 'career', label: { ru: 'Построить карьеру мечты', en: 'Build a dream career', kk: 'Арман мансабын құру' } },
] as const;

export const GRADES = [
  { id: '9', label: '9 класс' },
  { id: '10', label: '10 класс' },
  { id: '11', label: '11 класс' },
  { id: '12', label: '12 класс' },
  { id: 'gap', label: 'Gap Year' },
] as const;

export const COUNTRIES = [
  { id: 'usa', label: '🇺🇸 США', flag: '🇺🇸' },
  { id: 'uk', label: '🇬🇧 Великобритания', flag: '🇬🇧' },
  { id: 'eu', label: '🇪🇺 Европа', flag: '🇪🇺' },
  { id: 'asia', label: '🇸🇬 Азия', flag: '🇸🇬' },
  { id: 'kz', label: '🇰🇿 Казахстан', flag: '🇰🇿' },
] as const;
