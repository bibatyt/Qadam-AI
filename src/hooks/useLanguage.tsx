import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useProfile } from "./useProfile";

type Language = "ru" | "en" | "kk";

interface Translations {
  [key: string]: {
    ru: string;
    en: string;
    kk: string;
  };
}

const translations: Translations = {
  // Navigation
  home: { ru: "Главная", en: "Home", kk: "Басты" },
  path: { ru: "Жол", en: "Path", kk: "Жол" },
  ai: { ru: "AI", en: "AI", kk: "AI" },
  statistics: { ru: "Статистика", en: "Stats", kk: "Статистика" },
  settings: { ru: "Настройки", en: "Settings", kk: "Баптаулар" },
  
  // Dashboard
  welcomeBack: { ru: "С возвращением", en: "Welcome back", kk: "Қош келдіңіз" },
  readyToConquer: { ru: "Готов покорять университеты?", en: "Ready to conquer universities?", kk: "Университеттерді жаулауға дайынсыз ба?" },
  level: { ru: "Уровень", en: "Level", kk: "Деңгей" },
  newbie: { ru: "Новичок", en: "Newbie", kk: "Жаңа бастаған" },
  explorer: { ru: "Исследователь", en: "Explorer", kk: "Зерттеуші" },
  scholar: { ru: "Ученый", en: "Scholar", kk: "Ғалым" },
  master: { ru: "Мастер", en: "Master", kk: "Шебер" },
  xpToLevel: { ru: "XP до Lvl", en: "XP to Lvl", kk: "Lvl-ге дейін XP" },
  days: { ru: "дн.", en: "days", kk: "күн" },
  onFire: { ru: "В огне!", en: "On fire!", kk: "Жанып тұр!" },
  startStreak: { ru: "Начни серию!", en: "Start streak!", kk: "Серияны бастаңыз!" },
  goal: { ru: "ЦЕЛЬ", en: "GOAL", kk: "МАҚСАТ" },
  setGoal: { ru: "Поставить цель", en: "Set a goal", kk: "Мақсат қою" },
  dailyQuests: { ru: "Ежедневные задания", en: "Daily Quests", kk: "Күнделікті тапсырмалар" },
  wisdomOfDay: { ru: "МУДРОСТЬ ДНЯ", en: "WISDOM OF THE DAY", kk: "КҮННІҢ ДАНАЛЫҒЫ" },
  
  // Settings
  profile: { ru: "Профиль", en: "Profile", kk: "Профиль" },
  upload: { ru: "Загрузить", en: "Upload", kk: "Жүктеу" },
  random: { ru: "Случайно", en: "Random", kk: "Кездейсоқ" },
  name: { ru: "Имя", en: "Name", kk: "Аты" },
  yourName: { ru: "Ваше имя", en: "Your name", kk: "Сіздің атыңыз" },
  save: { ru: "Сохранить", en: "Save", kk: "Сақтау" },
  language: { ru: "Язык", en: "Language", kk: "Тіл" },
  testResults: { ru: "Результаты тестов", en: "Test Results", kk: "Тест нәтижелері" },
  saveResults: { ru: "Сохранить результаты", en: "Save Results", kk: "Нәтижелерді сақтау" },
  logout: { ru: "Выйти", en: "Log out", kk: "Шығу" },
  settingsSaved: { ru: "Настройки сохранены!", en: "Settings saved!", kk: "Баптаулар сақталды!" },
  errorSaving: { ru: "Ошибка при сохранении", en: "Error saving", kk: "Сақтау қатесі" },
  languageChanged: { ru: "Язык изменён", en: "Language changed", kk: "Тіл өзгертілді" },
  resultsSaved: { ru: "Результаты сохранены!", en: "Results saved!", kk: "Нәтижелер сақталды!" },
  loggedOut: { ru: "Вы вышли из аккаунта", en: "Logged out", kk: "Сіз аккаунттан шықтыңыз" },
  satError: { ru: "SAT должен быть от 400 до 1600", en: "SAT must be between 400 and 1600", kk: "SAT 400-ден 1600-ге дейін болуы керек" },
  ieltsError: { ru: "IELTS должен быть от 1 до 9", en: "IELTS must be between 1 and 9", kk: "IELTS 1-ден 9-ға дейін болуы керек" },
  avatarUpdated: { ru: "Аватар обновлён!", en: "Avatar updated!", kk: "Аватар жаңартылды!" },
  avatarError: { ru: "Ошибка загрузки аватара", en: "Error uploading avatar", kk: "Аватар жүктеу қатесі" },
  
  // Wisdom quotes
  wisdom1: { 
    ru: "Не просто учись. Покоряй знания, покоряй мир!", 
    en: "Don't just learn. Conquer knowledge, conquer the world!", 
    kk: "Жай ғана оқыма. Білімді меңгер, әлемді жаула!" 
  },
  wisdom2: { 
    ru: "Образование — это не подготовка к жизни; образование — это сама жизнь.", 
    en: "Education is not preparation for life; education is life itself.", 
    kk: "Білім — бұл өмірге дайындық емес; білім — бұл өмірдің өзі." 
  },
  wisdom3: { 
    ru: "Будущее принадлежит тем, кто верит в красоту своей мечты.", 
    en: "The future belongs to those who believe in the beauty of their dreams.", 
    kk: "Болашақ өз арманының сұлулығына сенетіндердікі." 
  },
  wisdom4: { 
    ru: "Единственный способ делать великую работу — любить то, что вы делаете.", 
    en: "The only way to do great work is to love what you do.", 
    kk: "Керемет жұмыс істеудің жалғыз жолы — істеген ісіңді сүю." 
  },

  // Statistics
  xpLast7Days: { ru: "XP за последние 7 дней", en: "XP for last 7 days", kk: "Соңғы 7 күндегі XP" },
  totalXPEarned: { ru: "Всего XP заработано", en: "Total XP earned", kk: "Барлығы жиналған XP" },
  startQuests: { ru: "Начните выполнять задания", en: "Start completing quests", kk: "Тапсырмаларды орындай бастаңыз" },
  toSeeProgress: { ru: "чтобы увидеть прогресс", en: "to see progress", kk: "прогресті көру үшін" },
  outOf1600: { ru: "Из 1600", en: "Out of 1600", kk: "1600-ден" },
  outOf9: { ru: "Из 9.0", en: "Out of 9.0", kk: "9.0-дан" },
  addInSettings: { ru: "Добавьте в настройках", en: "Add in settings", kk: "Баптауларда қосыңыз" },
  overallStats: { ru: "Общая статистика", en: "Overall Statistics", kk: "Жалпы статистика" },
  totalXP: { ru: "Всего XP", en: "Total XP", kk: "Барлық XP" },
  dayStreak: { ru: "Дн. серия", en: "Day streak", kk: "Күн сериясы" },
  addTestResults: { ru: "Добавьте свои результаты тестов в настройках", en: "Add your test results in settings", kk: "Тест нәтижелерін баптауларда қосыңыз" },
  addResults: { ru: "Добавить результаты", en: "Add results", kk: "Нәтижелерді қосу" },
  activity: { ru: "Активность", en: "Activity", kk: "Белсенділік" },
  recentActivity: { ru: "Последняя активность", en: "Recent Activity", kk: "Соңғы белсенділік" },
  
  // Path/Roadmap
  pathTitle: { ru: "Жол картасы", en: "Your Path", kk: "Жол картасы" },
  pathSubtitle: { ru: "Арман университетіне", en: "To your dream university", kk: "Арман университетіне" },
  yourPath: { ru: "Сіздің жолыңыз", en: "Your Path", kk: "Сіздің жолыңыз" },
  createRoadmap: { ru: "Жоспарыңызды жасаңыз", en: "Create Your Plan", kk: "Жоспарыңызды жасаңыз" },
  fillProfileInfo: { ru: "Жеке жоспар үшін деректерді толтырыңыз", en: "Fill in your info for a personalized plan", kk: "Жеке жоспар үшін деректеріңізді толтырыңыз" },
  gpa: { ru: "GPA", en: "GPA", kk: "GPA" },
  currentGradeLabel: { ru: "Сынып", en: "Grade", kk: "Сынып" },
  selectGrade: { ru: "Сыныпты таңдаңыз", en: "Select grade", kk: "Сыныпты таңдаңыз" },
  grade9: { ru: "9-сынып", en: "9th grade", kk: "9-сынып" },
  grade10: { ru: "10-сынып", en: "10th grade", kk: "10-сынып" },
  grade11: { ru: "11-сынып", en: "11th grade", kk: "11-сынып" },
  grade12: { ru: "12-сынып", en: "12th grade", kk: "12-сынып" },
  gapYear: { ru: "Gap Year", en: "Gap Year", kk: "Gap Year" },
  desiredMajor: { ru: "Мамандық", en: "Major", kk: "Мамандық" },
  majorPlaceholder: { ru: "Computer Science, Medicine...", en: "Computer Science, Medicine...", kk: "Computer Science, Medicine..." },
  targetCountry: { ru: "Мақсатты ел", en: "Target Country", kk: "Мақсатты ел" },
  selectCountry: { ru: "Елді таңдаңыз", en: "Select country", kk: "Елді таңдаңыз" },
  mainGoal: { ru: "Басты мақсат", en: "Main Goal", kk: "Басты мақсат" },
  goalPlaceholder: { ru: "Ivy League-ге түсу, грант алу...", en: "Get into Ivy League, win a scholarship...", kk: "Ivy League-ге түсу, грант алу..." },
  generatePlan: { ru: "AI жоспарын жасау", en: "Generate AI Plan", kk: "AI жоспарын жасау" },
  generatingPlan: { ru: "Жоспар жасалуда...", en: "Generating plan...", kk: "Жоспар жасалуда..." },
  roadmapGenerated: { ru: "Жоспар жасалды! 🎉", en: "Plan created! 🎉", kk: "Жоспар жасалды! 🎉" },
  roadmapError: { ru: "Жоспар жасау қатесі", en: "Error creating plan", kk: "Жоспар жасау қатесі" },
  roadmapReset: { ru: "Жоспар қалпына келтірілді", en: "Plan reset", kk: "Жоспар қалпына келтірілді" },
  overallProgress: { ru: "Жалпы прогресс", en: "Overall Progress", kk: "Жалпы прогресс" },
  fillAllFields: { ru: "Барлық міндетті өрістерді толтырыңыз", en: "Please fill all required fields", kk: "Барлық міндетті өрістерді толтырыңыз" },
  
  // Task categories
  academic: { ru: "оқу", en: "academic", kk: "оқу" },
  test: { ru: "тест", en: "test", kk: "тест" },
  extracurricular: { ru: "қосымша", en: "extracurricular", kk: "қосымша" },
  essay: { ru: "эссе", en: "essay", kk: "эссе" },
  recommendation: { ru: "ұсыныс", en: "recommendation", kk: "ұсыныс" },
  application: { ru: "өтініш", en: "application", kk: "өтініш" },
  
  // Counselor
  aiCounselor: { ru: "AI Кеңесші", en: "AI Counselor", kk: "AI Кеңесші" },
  online: { ru: "Онлайн", en: "Online", kk: "Онлайн" },
  askAboutUniversities: { ru: "Университеттер туралы сұраңыз...", en: "Ask about universities...", kk: "Университеттер туралы сұраңыз..." },
  howToWriteEssay: { ru: "Эссе қалай жазу керек?", en: "How to write an essay?", kk: "Эссе қалай жазу керек?" },
  ieltsOrToefl: { ru: "IELTS немесе TOEFL?", en: "IELTS or TOEFL?", kk: "IELTS немесе TOEFL?" },
  howToApply: { ru: "Қалай түсуге болады...", en: "How to apply to...", kk: "Қалай түсуге болады..." },
  deadlines: { ru: "Мерзімдер", en: "Deadlines", kk: "Мерзімдер" },
  aiGreeting: { 
    ru: "Сәлем! Мен Qadam AI 🎓 Университетке түсуге қалай көмектесе аламын?", 
    en: "Hi! I'm Qadam AI 🎓 How can I help you with university admissions?", 
    kk: "Сәлем! Мен Qadam AI 🎓 Университетке түсуге қалай көмектесе аламын?" 
  },
  
  // Auth
  welcomeBackAuth: { ru: "Қош келдіңіз!", en: "Welcome back!", kk: "Қош келдіңіз!" },
  createAccount: { ru: "Аккаунт құру", en: "Create account", kk: "Аккаунт құру" },
  loginToContinue: { ru: "Жолыңызды жалғастыру үшін кіріңіз", en: "Sign in to continue your journey", kk: "Жолыңызды жалғастыру үшін кіріңіз" },
  startYourJourney: { ru: "Арман университетіне жолыңызды бастаңыз", en: "Start your journey to your dream university", kk: "Арман университетіне жолыңызды бастаңыз" },
  signIn: { ru: "Кіру", en: "Sign in", kk: "Кіру" },
  noAccount: { ru: "Аккаунт жоқ па? Құру", en: "No account? Create one", kk: "Аккаунт жоқ па? Құру" },
  hasAccount: { ru: "Аккаунт бар ма? Кіру", en: "Already have an account? Sign in", kk: "Аккаунт бар ма? Кіру" },
  email: { ru: "Email", en: "Email", kk: "Email" },
  password: { ru: "Құпия сөз", en: "Password", kk: "Құпия сөз" },
  
  // Opportunities
  opportunitiesTitle: { ru: "Мүмкіндіктер", en: "Opportunities", kk: "Мүмкіндіктер" },
  opportunitiesSubtitle: { ru: "Олимпиадалар, лагерьлер және зерттеулер", en: "Olympiads, camps & research", kk: "Олимпиадалар, лагерьлер және зерттеулер" },
  opportunities: { ru: "Мүмкіндіктер", en: "Opportunities", kk: "Мүмкіндіктер" },
  filters: { ru: "Сүзгілер", en: "Filters", kk: "Сүзгілер" },
  type: { ru: "Түрі", en: "Type", kk: "Түрі" },
  allTypes: { ru: "Барлық түрлер", en: "All types", kk: "Барлық түрлер" },
  olympiad: { ru: "Олимпиада", en: "Olympiad", kk: "Олимпиада" },
  camp: { ru: "Лагерь", en: "Camp", kk: "Лагерь" },
  research: { ru: "Зерттеу", en: "Research", kk: "Зерттеу" },
  course: { ru: "Курс", en: "Course", kk: "Курс" },
  competition: { ru: "Жарыс", en: "Competition", kk: "Жарыс" },
  levelFilter: { ru: "Деңгей", en: "Level", kk: "Деңгей" },
  allLevels: { ru: "Барлық деңгейлер", en: "All levels", kk: "Барлық деңгейлер" },
  international: { ru: "Халықаралық", en: "International", kk: "Халықаралық" },
  national: { ru: "Ұлттық", en: "National", kk: "Ұлттық" },
  regional: { ru: "Аймақтық", en: "Regional", kk: "Аймақтық" },
  country: { ru: "Ел", en: "Country", kk: "Ел" },
  allCountries: { ru: "Барлық елдер", en: "All countries", kk: "Барлық елдер" },
  generatingOpportunities: { ru: "Мүмкіндіктер жасалуда...", en: "Generating opportunities...", kk: "Мүмкіндіктер жасалуда..." },
  noOpportunities: { ru: "Мүмкіндіктер табылмады", en: "No opportunities found", kk: "Мүмкіндіктер табылмады" },
  generateOpportunities: { ru: "Мүмкіндіктерді табу", en: "Find opportunities", kk: "Мүмкіндіктерді табу" },
  opportunitiesFound: { ru: "мүмкіндік", en: "opportunities", kk: "мүмкіндік" },
  opportunitiesGenerated: { ru: "Мүмкіндіктер табылды! 🎉", en: "Opportunities found! 🎉", kk: "Мүмкіндіктер табылды! 🎉" },
  opportunitiesError: { ru: "Мүмкіндіктерді табу қатесі", en: "Error finding opportunities", kk: "Мүмкіндіктерді табу қатесі" },
  refresh: { ru: "Жаңарту", en: "Refresh", kk: "Жаңарту" },
  free: { ru: "Тегін", en: "Free", kk: "Тегін" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile, updateProfile } = useProfile();
  const [language, setLanguageState] = useState<Language>("ru");

  useEffect(() => {
    if (profile?.language) {
      setLanguageState(profile.language as Language);
    }
  }, [profile?.language]);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    if (profile) {
      await updateProfile({ language: lang });
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.ru || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}