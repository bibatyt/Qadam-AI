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
  path: { ru: "Путь", en: "Path", kk: "Жол" },
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
  pathTitle: { ru: "Карта пути", en: "Your Path", kk: "Жол картасы" },
  pathSubtitle: { ru: "К университету мечты", en: "To your dream university", kk: "Арман университетіне" },
  yourPath: { ru: "Ваш путь", en: "Your Path", kk: "Сіздің жолыңыз" },
  createRoadmap: { ru: "Создайте свой план", en: "Create Your Plan", kk: "Жоспарыңызды жасаңыз" },
  fillProfileInfo: { ru: "Заполните данные для персонального плана", en: "Fill in your info for a personalized plan", kk: "Жеке жоспар үшін деректеріңізді толтырыңыз" },
  gpa: { ru: "GPA", en: "GPA", kk: "GPA" },
  currentGradeLabel: { ru: "Класс", en: "Grade", kk: "Сынып" },
  selectGrade: { ru: "Выберите класс", en: "Select grade", kk: "Сыныпты таңдаңыз" },
  grade9: { ru: "9 класс", en: "9th grade", kk: "9-сынып" },
  grade10: { ru: "10 класс", en: "10th grade", kk: "10-сынып" },
  grade11: { ru: "11 класс", en: "11th grade", kk: "11-сынып" },
  grade12: { ru: "12 класс", en: "12th grade", kk: "12-сынып" },
  gapYear: { ru: "Gap Year", en: "Gap Year", kk: "Gap Year" },
  desiredMajor: { ru: "Специальность", en: "Major", kk: "Мамандық" },
  majorPlaceholder: { ru: "Computer Science, Медицина...", en: "Computer Science, Medicine...", kk: "Computer Science, Medicine..." },
  targetCountry: { ru: "Целевая страна", en: "Target Country", kk: "Мақсатты ел" },
  selectCountry: { ru: "Выберите страну", en: "Select country", kk: "Елді таңдаңыз" },
  mainGoal: { ru: "Главная цель поступления", en: "Main Admission Goal", kk: "Түсудің басты мақсаты" },
  goalPlaceholder: { 
    ru: "Моя цель: Поступить в [Университет/Лига], на [Профессию], с [Грантом/Финансированием]. Укажите все детали...", 
    en: "My goal: Get into [University/League], study [Major], with [Scholarship/Funding]. Include all details...", 
    kk: "Менің мақсатым: [Университет/Лига]-ға түсу, [Мамандық] оқу, [Грант/Қаржыландыру] алу. Барлық мәліметтерді көрсетіңіз..." 
  },
  goalMinLength: { ru: "Минимум 15 символов для детального плана", en: "Minimum 15 characters for detailed plan", kk: "Толық жоспар үшін кемінде 15 таңба" },
  goalTooShort: { ru: "Опишите цель подробнее (минимум 15 символов)", en: "Describe your goal in more detail (min 15 characters)", kk: "Мақсатыңызды толығырақ сипаттаңыз (кемінде 15 таңба)" },
  generatePlan: { ru: "Создать AI план", en: "Generate AI Plan", kk: "AI жоспарын жасау" },
  generatingPlan: { ru: "Создание плана...", en: "Generating plan...", kk: "Жоспар жасалуда..." },
  roadmapGenerated: { ru: "План создан! 🎉", en: "Plan created! 🎉", kk: "Жоспар жасалды! 🎉" },
  roadmapError: { ru: "Ошибка создания плана", en: "Error creating plan", kk: "Жоспар жасау қатесі" },
  roadmapReset: { ru: "План сброшен", en: "Plan reset", kk: "Жоспар қалпына келтірілді" },
  overallProgress: { ru: "Общий прогресс", en: "Overall Progress", kk: "Жалпы прогресс" },
  fillAllFields: { ru: "Заполните все обязательные поля", en: "Please fill all required fields", kk: "Барлық міндетті өрістерді толтырыңыз" },
  
  // Task categories
  academic: { ru: "учёба", en: "academic", kk: "оқу" },
  test: { ru: "тест", en: "test", kk: "тест" },
  extracurricular: { ru: "доп. занятия", en: "extracurricular", kk: "қосымша" },
  essay: { ru: "эссе", en: "essay", kk: "эссе" },
  recommendation: { ru: "рекомендация", en: "recommendation", kk: "ұсыныс" },
  application: { ru: "заявка", en: "application", kk: "өтініш" },
  
  // Counselor
  aiCounselor: { ru: "AI Консультант", en: "AI Counselor", kk: "AI Кеңесші" },
  online: { ru: "Онлайн", en: "Online", kk: "Онлайн" },
  askAboutUniversities: { ru: "Спросите об университетах...", en: "Ask about universities...", kk: "Университеттер туралы сұраңыз..." },
  howToWriteEssay: { ru: "Как написать эссе?", en: "How to write an essay?", kk: "Эссе қалай жазу керек?" },
  ieltsOrToefl: { ru: "IELTS или TOEFL?", en: "IELTS or TOEFL?", kk: "IELTS немесе TOEFL?" },
  howToApply: { ru: "Как поступить в...", en: "How to apply to...", kk: "Қалай түсуге болады..." },
  deadlines: { ru: "Дедлайны", en: "Deadlines", kk: "Мерзімдер" },
  aiGreeting: { 
    ru: "Привет! Я Qadam AI 🎓 Как я могу помочь с поступлением в университет?", 
    en: "Hi! I'm Qadam AI 🎓 How can I help you with university admissions?", 
    kk: "Сәлем! Мен Qadam AI 🎓 Университетке түсуге қалай көмектесе аламын?" 
  },
  
  // Auth
  welcomeBackAuth: { ru: "С возвращением!", en: "Welcome back!", kk: "Қош келдіңіз!" },
  createAccount: { ru: "Создать аккаунт", en: "Create account", kk: "Аккаунт құру" },
  loginToContinue: { ru: "Войдите, чтобы продолжить ваш путь", en: "Sign in to continue your journey", kk: "Жолыңызды жалғастыру үшін кіріңіз" },
  startYourJourney: { ru: "Начните свой путь к университету мечты", en: "Start your journey to your dream university", kk: "Арман университетіне жолыңызды бастаңыз" },
  signIn: { ru: "Войти", en: "Sign in", kk: "Кіру" },
  noAccount: { ru: "Нет аккаунта? Создать", en: "No account? Create one", kk: "Аккаунт жоқ па? Құру" },
  hasAccount: { ru: "Уже есть аккаунт? Войти", en: "Already have an account? Sign in", kk: "Аккаунт бар ма? Кіру" },
  email: { ru: "Email", en: "Email", kk: "Email" },
  password: { ru: "Пароль", en: "Password", kk: "Құпия сөз" },
  
  // Opportunities
  opportunitiesTitle: { ru: "Возможности", en: "Opportunities", kk: "Мүмкіндіктер" },
  opportunitiesSubtitle: { ru: "Олимпиады, лагеря и исследования", en: "Olympiads, camps & research", kk: "Олимпиадалар, лагерьлер және зерттеулер" },
  opportunities: { ru: "Возможности", en: "Opportunities", kk: "Мүмкіндіктер" },
  filters: { ru: "Фильтры", en: "Filters", kk: "Сүзгілер" },
  type: { ru: "Тип", en: "Type", kk: "Түрі" },
  allTypes: { ru: "Все типы", en: "All types", kk: "Барлық түрлер" },
  olympiad: { ru: "Олимпиада", en: "Olympiad", kk: "Олимпиада" },
  camp: { ru: "Лагерь", en: "Camp", kk: "Лагерь" },
  research: { ru: "Исследование", en: "Research", kk: "Зерттеу" },
  course: { ru: "Курс", en: "Course", kk: "Курс" },
  competition: { ru: "Конкурс", en: "Competition", kk: "Жарыс" },
  levelFilter: { ru: "Уровень", en: "Level", kk: "Деңгей" },
  allLevels: { ru: "Все уровни", en: "All levels", kk: "Барлық деңгейлер" },
  international: { ru: "Международный", en: "International", kk: "Халықаралық" },
  national: { ru: "Национальный", en: "National", kk: "Ұлттық" },
  regional: { ru: "Региональный", en: "Regional", kk: "Аймақтық" },
  country: { ru: "Страна", en: "Country", kk: "Ел" },
  allCountries: { ru: "Все страны", en: "All countries", kk: "Барлық елдер" },
  generatingOpportunities: { ru: "Загрузка возможностей...", en: "Generating opportunities...", kk: "Мүмкіндіктер жасалуда..." },
  noOpportunities: { ru: "Возможности не найдены", en: "No opportunities found", kk: "Мүмкіндіктер табылмады" },
  generateOpportunities: { ru: "Найти возможности", en: "Find opportunities", kk: "Мүмкіндіктерді табу" },
  opportunitiesFound: { ru: "возможностей", en: "opportunities", kk: "мүмкіндік" },
  opportunitiesGenerated: { ru: "Возможности найдены! 🎉", en: "Opportunities found! 🎉", kk: "Мүмкіндіктер табылды! 🎉" },
  opportunitiesError: { ru: "Ошибка поиска возможностей", en: "Error finding opportunities", kk: "Мүмкіндіктерді табу қатесі" },
  refresh: { ru: "Обновить", en: "Refresh", kk: "Жаңарту" },
  free: { ru: "Бесплатно", en: "Free", kk: "Тегін" },
  leaveReview: { ru: "Оставить отзыв", en: "Leave a Review", kk: "Пікір қалдыру" },
  helpUsImprove: { ru: "Помогите нам стать лучше", en: "Help us improve", kk: "Бізге жақсаруға көмектесіңіз" },
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