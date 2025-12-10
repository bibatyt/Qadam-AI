export interface OnboardingData {
  // Step 1: Goal
  mainGoal: string;
  
  // Step 2: Profile + Universities
  currentGrade: string;
  targetCountry: string;
  targetUniversities: string[];
  
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
  { id: 'bachelor', label: 'Бакалавриат' },
] as const;

export const COUNTRIES = [
  { id: 'usa', label: '🇺🇸 США', flag: '🇺🇸' },
  { id: 'uk', label: '🇬🇧 Великобритания', flag: '🇬🇧' },
  { id: 'eu', label: '🇪🇺 Европа', flag: '🇪🇺' },
  { id: 'canada', label: '🇨🇦 Канада', flag: '🇨🇦' },
  { id: 'asia', label: '🇸🇬 Азия', flag: '🇸🇬' },
  { id: 'kz', label: '🇰🇿 Казахстан', flag: '🇰🇿' },
] as const;

// Топовые университеты мира для выбора "фаворитов"
export const TOP_UNIVERSITIES = [
  // USA
  { id: 'harvard', name: 'Harvard University', country: 'usa', logo: '🏛️', rank: 1 },
  { id: 'stanford', name: 'Stanford University', country: 'usa', logo: '🌲', rank: 2 },
  { id: 'mit', name: 'MIT', country: 'usa', logo: '🔬', rank: 3 },
  { id: 'yale', name: 'Yale University', country: 'usa', logo: '📚', rank: 5 },
  { id: 'princeton', name: 'Princeton University', country: 'usa', logo: '🐯', rank: 6 },
  { id: 'columbia', name: 'Columbia University', country: 'usa', logo: '🗽', rank: 12 },
  { id: 'upenn', name: 'UPenn', country: 'usa', logo: '🔔', rank: 13 },
  { id: 'caltech', name: 'Caltech', country: 'usa', logo: '🚀', rank: 15 },
  { id: 'berkeley', name: 'UC Berkeley', country: 'usa', logo: '🐻', rank: 22 },
  { id: 'ucla', name: 'UCLA', country: 'usa', logo: '☀️', rank: 29 },
  { id: 'nyu', name: 'NYU', country: 'usa', logo: '🗽', rank: 35 },
  { id: 'cornell', name: 'Cornell University', country: 'usa', logo: '🍂', rank: 17 },
  
  // UK
  { id: 'oxford', name: 'Oxford University', country: 'uk', logo: '📖', rank: 4 },
  { id: 'cambridge', name: 'Cambridge University', country: 'uk', logo: '🎓', rank: 7 },
  { id: 'imperial', name: 'Imperial College London', country: 'uk', logo: '👑', rank: 8 },
  { id: 'lse', name: 'LSE', country: 'uk', logo: '💼', rank: 45 },
  { id: 'ucl', name: 'UCL', country: 'uk', logo: '🦁', rank: 9 },
  { id: 'edinburgh', name: 'University of Edinburgh', country: 'uk', logo: '🏰', rank: 27 },
  
  // Europe
  { id: 'eth', name: 'ETH Zurich', country: 'eu', logo: '🇨🇭', rank: 10 },
  { id: 'epfl', name: 'EPFL', country: 'eu', logo: '🇨🇭', rank: 36 },
  { id: 'lmu', name: 'LMU Munich', country: 'eu', logo: '🇩🇪', rank: 54 },
  { id: 'tu_munich', name: 'TU Munich', country: 'eu', logo: '🇩🇪', rank: 49 },
  { id: 'sorbonne', name: 'Sorbonne University', country: 'eu', logo: '🇫🇷', rank: 72 },
  { id: 'amsterdam', name: 'University of Amsterdam', country: 'eu', logo: '🇳🇱', rank: 58 },
  
  // Canada
  { id: 'toronto', name: 'University of Toronto', country: 'canada', logo: '🍁', rank: 21 },
  { id: 'mcgill', name: 'McGill University', country: 'canada', logo: '🍁', rank: 30 },
  { id: 'ubc', name: 'UBC', country: 'canada', logo: '🏔️', rank: 34 },
  
  // Asia
  { id: 'nus', name: 'NUS Singapore', country: 'asia', logo: '🇸🇬', rank: 11 },
  { id: 'ntu', name: 'NTU Singapore', country: 'asia', logo: '🇸🇬', rank: 19 },
  { id: 'hku', name: 'HKU', country: 'asia', logo: '🇭🇰', rank: 26 },
  { id: 'tokyo', name: 'University of Tokyo', country: 'asia', logo: '🇯🇵', rank: 28 },
  { id: 'tsinghua', name: 'Tsinghua University', country: 'asia', logo: '🇨🇳', rank: 14 },
  { id: 'peking', name: 'Peking University', country: 'asia', logo: '🇨🇳', rank: 17 },
  { id: 'kaist', name: 'KAIST', country: 'asia', logo: '🇰🇷', rank: 41 },
  
  // Kazakhstan
  { id: 'nu', name: 'Nazarbayev University', country: 'kz', logo: '🇰🇿', rank: 1 },
  { id: 'kimep', name: 'KIMEP University', country: 'kz', logo: '🇰🇿', rank: 2 },
  { id: 'kbtu', name: 'KBTU', country: 'kz', logo: '🇰🇿', rank: 3 },
  { id: 'kaznu', name: 'КазНУ им. Аль-Фараби', country: 'kz', logo: '🇰🇿', rank: 4 },
  { id: 'satbayev', name: 'Satbayev University', country: 'kz', logo: '🇰🇿', rank: 5 },
] as const;

export type University = typeof TOP_UNIVERSITIES[number];
