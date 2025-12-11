export interface OnboardingData {
  // Step 1: Role
  role: 'student' | 'parent';
  
  // Step 2: Goal
  mainGoal: string;
  
  // Step 3: EFC Data
  residenceCountry: string;
  incomeRange: 'low' | 'medium' | 'high';
  budgetRange: 'low' | 'medium' | 'high';
  
  // Step 4: Profile + Universities
  currentGrade: string;
  targetCountry: string;
  targetUniversities: string[];
  
  // Step 5: Academic (NEW)
  satScore?: number;
  ieltsScore?: number;
  englishLevel: string;
  deadline: string;
  desiredMajor: string;
  
  // Step 6: Auth (handled separately)
}

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6;

export const ROLES = [
  { 
    id: 'student', 
    label: { ru: 'Школьник / Абитуриент', en: 'Student / Applicant', kk: 'Оқушы / Абитуриент' },
    description: { 
      ru: 'Я готовлюсь к поступлению', 
      en: 'I am preparing for admission', 
      kk: 'Мен түсуге дайындалып жатырмын' 
    },
    icon: '🎓'
  },
  { 
    id: 'parent', 
    label: { ru: 'Родитель / Опекун', en: 'Parent / Guardian', kk: 'Ата-ана / Қамқоршы' },
    description: { 
      ru: 'Я помогаю ребёнку поступить', 
      en: 'I am helping my child get admitted', 
      kk: 'Мен балама түсуге көмектесемін' 
    },
    icon: '👨‍👩‍👧'
  },
] as const;

export const GOALS = [
  { id: 'top_uni', label: { ru: 'Поступить в топовый университет', en: 'Get into a top university', kk: 'Үздік университетке түсу' }, icon: '🏛️' },
  { id: 'scholarship', label: { ru: 'Получить грант/стипендию', en: 'Get a scholarship', kk: 'Грант/стипендия алу' }, icon: '💰' },
  { id: 'abroad', label: { ru: 'Учиться за рубежом', en: 'Study abroad', kk: 'Шетелде оқу' }, icon: '✈️' },
  { id: 'career', label: { ru: 'Построить карьеру мечты', en: 'Build a dream career', kk: 'Арман мансабын құру' }, icon: '🚀' },
] as const;

export const GRADES = [
  { id: '9', label: { ru: '9 класс', en: '9th grade', kk: '9 сынып' } },
  { id: '10', label: { ru: '10 класс', en: '10th grade', kk: '10 сынып' } },
  { id: '11', label: { ru: '11 класс', en: '11th grade', kk: '11 сынып' } },
  { id: '12', label: { ru: '12 класс', en: '12th grade', kk: '12 сынып' } },
  { id: 'gap', label: { ru: 'Gap Year', en: 'Gap Year', kk: 'Gap Year' } },
  { id: 'bachelor', label: { ru: 'Бакалавриат', en: 'Bachelor\'s', kk: 'Бакалавриат' } },
] as const;

export const COUNTRIES = [
  { id: 'usa', label: { ru: '🇺🇸 США', en: '🇺🇸 USA', kk: '🇺🇸 АҚШ' }, flag: '🇺🇸' },
  { id: 'uk', label: { ru: '🇬🇧 Великобритания', en: '🇬🇧 United Kingdom', kk: '🇬🇧 Ұлыбритания' }, flag: '🇬🇧' },
  { id: 'eu', label: { ru: '🇪🇺 Европа', en: '🇪🇺 Europe', kk: '🇪🇺 Еуропа' }, flag: '🇪🇺' },
  { id: 'canada', label: { ru: '🇨🇦 Канада', en: '🇨🇦 Canada', kk: '🇨🇦 Канада' }, flag: '🇨🇦' },
  { id: 'asia', label: { ru: '🇸🇬 Азия', en: '🇸🇬 Asia', kk: '🇸🇬 Азия' }, flag: '🇸🇬' },
  { id: 'middle_east', label: { ru: '🇸🇦 Ближний Восток', en: '🇸🇦 Middle East', kk: '🇸🇦 Таяу Шығыс' }, flag: '🇸🇦' },
  { id: 'kz', label: { ru: '🇰🇿 Казахстан', en: '🇰🇿 Kazakhstan', kk: '🇰🇿 Қазақстан' }, flag: '🇰🇿' },
] as const;

export const RESIDENCE_COUNTRIES = [
  { id: 'kz', label: { ru: '🇰🇿 Казахстан', en: '🇰🇿 Kazakhstan', kk: '🇰🇿 Қазақстан' } },
  { id: 'ru', label: { ru: '🇷🇺 Россия', en: '🇷🇺 Russia', kk: '🇷🇺 Ресей' } },
  { id: 'uz', label: { ru: '🇺🇿 Узбекистан', en: '🇺🇿 Uzbekistan', kk: '🇺🇿 Өзбекстан' } },
  { id: 'kg', label: { ru: '🇰🇬 Кыргызстан', en: '🇰🇬 Kyrgyzstan', kk: '🇰🇬 Қырғызстан' } },
  { id: 'other', label: { ru: '🌍 Другая страна', en: '🌍 Other country', kk: '🌍 Басқа ел' } },
] as const;

export const INCOME_RANGES = [
  { 
    id: 'low', 
    label: { ru: 'До $30,000 / год', en: 'Under $30,000 / year', kk: '$30,000 дейін / жыл' },
    description: { ru: 'Максимум финансовой помощи', en: 'Maximum financial aid', kk: 'Максималды қаржылық көмек' }
  },
  { 
    id: 'medium', 
    label: { ru: '$30,000 – $100,000 / год', en: '$30,000 – $100,000 / year', kk: '$30,000 – $100,000 / жыл' },
    description: { ru: 'Частичная помощь + Merit', en: 'Partial aid + Merit', kk: 'Жартылай көмек + Merit' }
  },
  { 
    id: 'high', 
    label: { ru: 'Свыше $100,000 / год', en: 'Over $100,000 / year', kk: '$100,000 жоғары / жыл' },
    description: { ru: 'Merit-based стипендии', en: 'Merit-based scholarships', kk: 'Merit-based стипендиялар' }
  },
] as const;

export const BUDGET_RANGES = [
  { 
    id: 'low', 
    label: { ru: 'До $15,000 / год', en: 'Under $15,000 / year', kk: '$15,000 дейін / жыл' },
    description: { ru: 'Нужна полная или почти полная помощь', en: 'Need full or near-full aid', kk: 'Толық немесе толыққа жақын көмек қажет' }
  },
  { 
    id: 'medium', 
    label: { ru: '$15,000 – $40,000 / год', en: '$15,000 – $40,000 / year', kk: '$15,000 – $40,000 / жыл' },
    description: { ru: 'Можем частично покрыть', en: 'Can partially cover', kk: 'Ішінара жабамыз' }
  },
  { 
    id: 'high', 
    label: { ru: 'Свыше $40,000 / год', en: 'Over $40,000 / year', kk: '$40,000 жоғары / жыл' },
    description: { ru: 'Можем покрыть полную стоимость', en: 'Can cover full cost', kk: 'Толық құнын жабамыз' }
  },
] as const;

export const ENGLISH_LEVELS = [
  { id: 'beginner', label: { ru: 'Начальный (A1-A2)', en: 'Beginner (A1-A2)', kk: 'Бастапқы (A1-A2)' } },
  { id: 'intermediate', label: { ru: 'Средний (B1-B2)', en: 'Intermediate (B1-B2)', kk: 'Орта (B1-B2)' } },
  { id: 'advanced', label: { ru: 'Продвинутый (C1-C2)', en: 'Advanced (C1-C2)', kk: 'Жоғары (C1-C2)' } },
  { id: 'native', label: { ru: 'Носитель', en: 'Native', kk: 'Тілдің түбі' } },
] as const;

export const DEADLINES = [
  { id: '2025_fall', label: { ru: 'Осень 2025', en: 'Fall 2025', kk: 'Күз 2025' } },
  { id: '2026_fall', label: { ru: 'Осень 2026', en: 'Fall 2026', kk: 'Күз 2026' } },
  { id: '2027_fall', label: { ru: 'Осень 2027', en: 'Fall 2027', kk: 'Күз 2027' } },
  { id: 'undecided', label: { ru: 'Ещё не определился', en: 'Undecided', kk: 'Әлі шешілмеген' } },
] as const;

export const MAJORS = [
  { id: 'cs', label: { ru: 'Computer Science / IT', en: 'Computer Science / IT', kk: 'Информатика / IT' }, icon: '💻' },
  { id: 'business', label: { ru: 'Бизнес / Финансы', en: 'Business / Finance', kk: 'Бизнес / Қаржы' }, icon: '📊' },
  { id: 'engineering', label: { ru: 'Инженерия', en: 'Engineering', kk: 'Инженерия' }, icon: '⚙️' },
  { id: 'medicine', label: { ru: 'Медицина', en: 'Medicine', kk: 'Медицина' }, icon: '🏥' },
  { id: 'law', label: { ru: 'Право', en: 'Law', kk: 'Құқық' }, icon: '⚖️' },
  { id: 'arts', label: { ru: 'Искусство / Дизайн', en: 'Arts / Design', kk: 'Өнер / Дизайн' }, icon: '🎨' },
  { id: 'science', label: { ru: 'Естественные науки', en: 'Natural Sciences', kk: 'Жаратылыстану' }, icon: '🔬' },
  { id: 'social', label: { ru: 'Социальные науки', en: 'Social Sciences', kk: 'Әлеуметтік ғылымдар' }, icon: '🌍' },
  { id: 'humanities', label: { ru: 'Гуманитарные науки', en: 'Humanities', kk: 'Гуманитарлық ғылымдар' }, icon: '📚' },
  { id: 'undecided', label: { ru: 'Ещё не определился', en: 'Undecided', kk: 'Әлі шешілмеген' }, icon: '🤔' },
] as const;

// Топовые университеты мира для выбора "фаворитов"
export const TOP_UNIVERSITIES = [
  // USA
  { id: 'harvard', name: 'Harvard University', country: 'usa', logo: '🏛️', rank: 1, needBlind: true },
  { id: 'stanford', name: 'Stanford University', country: 'usa', logo: '🌲', rank: 2, needBlind: false },
  { id: 'mit', name: 'MIT', country: 'usa', logo: '🔬', rank: 3, needBlind: true },
  { id: 'yale', name: 'Yale University', country: 'usa', logo: '📚', rank: 5, needBlind: true },
  { id: 'princeton', name: 'Princeton University', country: 'usa', logo: '🐯', rank: 6, needBlind: true },
  { id: 'columbia', name: 'Columbia University', country: 'usa', logo: '🗽', rank: 12, needBlind: false },
  { id: 'upenn', name: 'UPenn', country: 'usa', logo: '🔔', rank: 13, needBlind: false },
  { id: 'caltech', name: 'Caltech', country: 'usa', logo: '🚀', rank: 15, needBlind: false },
  { id: 'berkeley', name: 'UC Berkeley', country: 'usa', logo: '🐻', rank: 22, needBlind: false },
  { id: 'ucla', name: 'UCLA', country: 'usa', logo: '☀️', rank: 29, needBlind: false },
  { id: 'nyu', name: 'NYU', country: 'usa', logo: '🗽', rank: 35, needBlind: false },
  { id: 'cornell', name: 'Cornell University', country: 'usa', logo: '🍂', rank: 17, needBlind: false },
  { id: 'amherst', name: 'Amherst College', country: 'usa', logo: '🟣', rank: 20, needBlind: true },
  
  // UK
  { id: 'oxford', name: 'Oxford University', country: 'uk', logo: '📖', rank: 4, needBlind: false },
  { id: 'cambridge', name: 'Cambridge University', country: 'uk', logo: '🎓', rank: 7, needBlind: false },
  { id: 'imperial', name: 'Imperial College London', country: 'uk', logo: '👑', rank: 8, needBlind: false },
  { id: 'lse', name: 'LSE', country: 'uk', logo: '💼', rank: 45, needBlind: false },
  { id: 'ucl', name: 'UCL', country: 'uk', logo: '🦁', rank: 9, needBlind: false },
  { id: 'edinburgh', name: 'University of Edinburgh', country: 'uk', logo: '🏰', rank: 27, needBlind: false },
  
  // Europe
  { id: 'eth', name: 'ETH Zurich', country: 'eu', logo: '🇨🇭', rank: 10, needBlind: false },
  { id: 'epfl', name: 'EPFL', country: 'eu', logo: '🇨🇭', rank: 36, needBlind: false },
  { id: 'lmu', name: 'LMU Munich', country: 'eu', logo: '🇩🇪', rank: 54, needBlind: false },
  { id: 'tu_munich', name: 'TU Munich', country: 'eu', logo: '🇩🇪', rank: 49, needBlind: false },
  { id: 'sorbonne', name: 'Sorbonne University', country: 'eu', logo: '🇫🇷', rank: 72, needBlind: false },
  { id: 'amsterdam', name: 'University of Amsterdam', country: 'eu', logo: '🇳🇱', rank: 58, needBlind: false },
  
  // Canada
  { id: 'toronto', name: 'University of Toronto', country: 'canada', logo: '🍁', rank: 21, needBlind: false },
  { id: 'mcgill', name: 'McGill University', country: 'canada', logo: '🍁', rank: 30, needBlind: false },
  { id: 'ubc', name: 'UBC', country: 'canada', logo: '🏔️', rank: 34, needBlind: false },
  
  // Asia
  { id: 'nus', name: 'NUS Singapore', country: 'asia', logo: '🇸🇬', rank: 11, needBlind: false },
  { id: 'ntu', name: 'NTU Singapore', country: 'asia', logo: '🇸🇬', rank: 19, needBlind: false },
  { id: 'hku', name: 'HKU', country: 'asia', logo: '🇭🇰', rank: 26, needBlind: false },
  { id: 'tokyo', name: 'University of Tokyo', country: 'asia', logo: '🇯🇵', rank: 28, needBlind: false },
  { id: 'tsinghua', name: 'Tsinghua University', country: 'asia', logo: '🇨🇳', rank: 14, needBlind: false },
  { id: 'peking', name: 'Peking University', country: 'asia', logo: '🇨🇳', rank: 17, needBlind: false },
  { id: 'kaist', name: 'KAIST', country: 'asia', logo: '🇰🇷', rank: 41, needBlind: false },
  
  // Middle East
  { id: 'kaust', name: 'KAUST', country: 'middle_east', logo: '🇸🇦', rank: 101, needBlind: false },
  { id: 'ksu', name: 'King Saud University', country: 'middle_east', logo: '🇸🇦', rank: 203, needBlind: false },
  { id: 'kfupm', name: 'King Fahd University', country: 'middle_east', logo: '🇸🇦', rank: 186, needBlind: false },
  { id: 'qatar', name: 'Qatar University', country: 'middle_east', logo: '🇶🇦', rank: 224, needBlind: false },
  { id: 'uaeu', name: 'UAE University', country: 'middle_east', logo: '🇦🇪', rank: 296, needBlind: false },
  { id: 'khalifa', name: 'Khalifa University', country: 'middle_east', logo: '🇦🇪', rank: 181, needBlind: false },
  { id: 'auc', name: 'American Univ. in Cairo', country: 'middle_east', logo: '🇪🇬', rank: 411, needBlind: false },
  
  // Kazakhstan (correct world rankings 500+)
  { id: 'nu', name: 'Nazarbayev University', country: 'kz', logo: '🇰🇿', rank: 507, needBlind: false },
  { id: 'kaznu', name: 'КазНУ им. Аль-Фараби', country: 'kz', logo: '🇰🇿', rank: 230, needBlind: false },
  { id: 'satbayev', name: 'Satbayev University', country: 'kz', logo: '🇰🇿', rank: 561, needBlind: false },
  { id: 'kbtu', name: 'KBTU', country: 'kz', logo: '🇰🇿', rank: 601, needBlind: false },
  { id: 'kimep', name: 'KIMEP University', country: 'kz', logo: '🇰🇿', rank: 701, needBlind: false },
  { id: 'enu', name: 'ЕНУ им. Гумилёва', country: 'kz', logo: '🇰🇿', rank: 651, needBlind: false },
] as const;

export type University = typeof TOP_UNIVERSITIES[number];
export type Role = typeof ROLES[number]['id'];
export type IncomeRange = typeof INCOME_RANGES[number]['id'];
export type BudgetRange = typeof BUDGET_RANGES[number]['id'];

// Calculate EFC segment based on income and budget
export function calculateEFCSegment(incomeRange: IncomeRange, budgetRange: BudgetRange): 'low' | 'medium' | 'high' {
  if (incomeRange === 'low' || budgetRange === 'low') {
    return 'low';
  }
  if (incomeRange === 'high' && budgetRange === 'high') {
    return 'high';
  }
  return 'medium';
}