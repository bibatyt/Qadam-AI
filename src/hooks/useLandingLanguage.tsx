import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LandingLanguage = 'en' | 'ru' | 'kk';

interface LandingLanguageStore {
  language: LandingLanguage;
  setLanguage: (language: LandingLanguage) => void;
}

export const useLandingLanguage = create<LandingLanguageStore>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'landing-language',
    }
  )
);

export const landingTranslations = {
  en: {
    // Header
    bookDemo: 'Book Demo',
    signIn: 'Sign In',
    
    // Hero Section
    efcBadge: 'EFC-Personalization Algorithm',
    heroMainTitle: 'Your personalized path to admission',
    heroHighlight: 'with smart EFC-Algorithm',
    heroSubtitle: 'We create an individual admission plan, deadlines, university and grant recommendations — based on your situation and budget.',
    startFree: 'Start for Free',
    learnMore: 'Learn More',
    stat50Unis: '50+ Universities',
    statPersonalPath: 'Personal Path',
    
    // Book Demo Modal
    bookDemoTitle: 'Book a Free Demo',
    yourName: 'Your Name',
    namePlaceholder: 'Enter your name',
    yourPhone: 'Phone Number',
    submitDemo: 'Request Demo',
    sending: 'Sending...',
    fillAllFields: 'Please fill all fields',
    demoSuccess: 'Request Sent!',
    demoSuccessDesc: 'We will contact you shortly to schedule a demo',
    demoError: 'Failed to send request. Please try again.',
    
    // Process Section
    howItWorks: 'How It Works',
    step1Title: 'Answer 6 Simple Questions',
    step1Desc: 'Role, country, income, budget, goal and timeline — nothing more needed',
    step2Title: 'System Determines Your EFC Segment',
    step2Desc: 'Algorithm analyzes data and determines optimal strategy',
    step3Title: 'Get Your Unique Personal "Path"',
    step3Desc: 'Deadlines, tasks, university and grant recommendations — all personalized',
    
    // Advantages Section
    advantagesTitle: 'Why Qadam AI',
    advantagesSubtitle: 'Smart system that understands your situation',
    advantage1Title: 'Individual path based on your EFC',
    advantage1Desc: 'Algorithm selects plan based on your family\'s financial profile',
    advantage2Title: 'Smart hints and deadlines',
    advantage2Desc: 'Never miss an important date — system reminds you in advance',
    advantage3Title: 'Automatic university filtering',
    advantage3Desc: 'Only universities that fit your budget and profile',
    advantage4Title: 'Real Success Stories',
    advantage4Desc: 'See paths of students with similar data',
    advantage5Title: 'AI strategy optimization',
    advantage5Desc: 'AI analyzes thousands of cases for your plan',
    
    // EFC Section
    efcTitle: 'What is EFC and why do you need it?',
    efcSubtitle: 'Expected Family Contribution — key to right recommendations',
    efcPoint1Title: 'Budget Understanding',
    efcPoint1Desc: 'EFC helps understand how much your family can contribute to education',
    efcPoint2Title: 'Simplified Model',
    efcPoint2Desc: 'We use a simplified model — just 3 questions instead of complex forms',
    efcPoint3Title: 'Accurate Recommendations',
    efcPoint3Desc: 'Algorithm selects universities and grants for your financial profile',
    efcTrustTitle: 'Why is it reliable?',
    efcTrust1: 'Algorithm based on thousands of real cases',
    efcTrust2: 'Real-time personalization',
    efcTrust3: 'No complex forms — everything automatic',
    efcTrust4: 'Data confidentiality guaranteed',
    
    // Success Stories
    successStoriesTitle: 'Success Stories',
    successStoriesSubtitle: 'Real students, real results',
    
    // Footer
    footerCtaTitle: 'Ready to create your personal path?',
    footerCtaSubtitle: 'Free. No credit card. Personal plan in 20 seconds.',
    footerCopyright: '© 2024 Qadam AI. All rights reserved.',
    
    // FAQ
    faq: 'Frequently Asked Questions',
    faq1Question: 'How does AI help with university admission?',
    faq1Answer: 'Our AI analyzes your profile, goals, and target universities to create a personalized roadmap. It provides specific tasks, essay guidance, test preparation tips, and tracks your progress.',
    faq2Question: 'Is Qadam suitable for international students?',
    faq2Answer: 'Yes! Qadam supports admission to universities in USA, UK, Europe, Asia, Turkey, and Kazakhstan. Our AI adapts strategies based on your target country and program.',
    faq3Question: 'How much does Qadam cost?',
    faq3Answer: 'Qadam offers a free tier with basic features. Premium plans unlock AI counselor, personalized roadmaps, and opportunity tracking. Start free and upgrade when ready!',
    faq4Question: 'Can I track my application deadlines?',
    faq4Answer: 'Absolutely! Qadam generates a monthly task calendar with all important deadlines for tests, applications, essays, and recommendations.',
    
    // Dashboard
    taskOfDay: 'Task of the Day',
    approxTime: '~12 min',
    allTasksCompleted: '🎉 All tasks completed!',
    loading: 'Loading...',
    incredible: 'Incredible!',
    comeBackTomorrow: 'Come back tomorrow for new tasks',
    completeAndProgress: 'Complete and move towards your goal!',
    completed: 'Completed!',
    heroOfDay: "You're the hero of the day! All tasks done!",
    almostThere: 'Almost there! Just a little more!',
    goodPace: 'Good pace! Keep going!',
    daysInRow: 'days in a row! You\'re on fire!',
    startWithOneTask: 'Start with one task!',
    checkEssay: 'Check Essay',
    getImpactScore: 'Get Impact Score',
    otherTasks: 'Other Tasks',
    aiMentor: 'AI Mentor',
    clickForHelp: 'Click 💬 on the right if you need help',
    student: 'Student',
    futureStudent: 'Future Student',
    
    // Path Page
    myPath: 'My Path',
    partOf: 'Part',
    of: 'of',
    stepsCompleted: 'steps completed',
    pathNotCreated: 'Path not yet created',
    goThroughOnboarding: 'Complete onboarding to get your personal path',
    start: 'Start',
    recommendedUniversities: 'Recommended Universities',
    match: 'match',
    fitsYourProfile: 'Fits your profile',
    partTasks: 'Tasks',
    planOptimizedForScholarships: 'Plan optimized for maximum scholarships. Focus on Need-Blind universities.',
    combinationStrategy: 'Combination of Need-based and Merit-based strategies.',
    focusOnMerit: 'Focus on Merit scholarships and Early Decision.',
    planForParent: 'Plan configured to support your child in the admission process.',
    stepCompleted: 'Great! Step completed! 🎉',
    errorUpdating: 'Error updating',
    personalPathCreated: 'Personal path created!',
    errorGeneratingPath: 'Error generating path',
    errorResetting: 'Error resetting',
    
    // Essay Engine
    essayAnalysis: 'Essay Analysis',
    uploadEssay: 'Upload Essay',
    essayTitle: 'Essay Title',
    enterTitle: 'Enter title',
    essayContent: 'Essay Content',
    pasteOrType: 'Paste or type your essay here...',
    analyzeEssay: 'Analyze Essay',
    analyzing: 'Analyzing...',
    impactScore: 'Impact Score',
    strengths: 'Strengths',
    improvements: 'Areas for Improvement',
    recommendations: 'Recommendations',
    newEssay: 'New Essay',
    analysisComplete: 'Analysis complete!',
    analysisError: 'Analysis error. Try again.',
    couldNotAnalyze: 'Could not analyze essay',
    
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    language: 'Language',
    logout: 'Log Out',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    error: 'Error',
    success: 'Success',
  },
  ru: {
    // Header
    bookDemo: 'Записаться на демо',
    signIn: 'Войти',
    
    // Hero Section
    efcBadge: 'EFC-Алгоритм персонализации',
    heroMainTitle: 'Ваш персональный путь к поступлению',
    heroHighlight: 'с помощью умного EFC-Алгоритма',
    heroSubtitle: 'Мы создаём индивидуальный план поступления, дедлайны, рекомендации ВУЗов и грантов — на основе вашей ситуации и бюджета.',
    startFree: 'Начать бесплатно',
    learnMore: 'Узнать больше',
    stat50Unis: '50+ университетов',
    statPersonalPath: 'Персональный путь',
    
    // Book Demo Modal
    bookDemoTitle: 'Записаться на бесплатное демо',
    yourName: 'Ваше имя',
    namePlaceholder: 'Введите ваше имя',
    yourPhone: 'Номер телефона',
    submitDemo: 'Отправить заявку',
    sending: 'Отправка...',
    fillAllFields: 'Пожалуйста, заполните все поля',
    demoSuccess: 'Заявка отправлена!',
    demoSuccessDesc: 'Мы свяжемся с вами в ближайшее время',
    demoError: 'Не удалось отправить заявку. Попробуйте снова.',
    
    // Process Section
    howItWorks: 'Как это работает',
    step1Title: 'Отвечаете на 6 простых вопросов',
    step1Desc: 'Роль, страна, доход, бюджет, цель и сроки — больше ничего не нужно',
    step2Title: 'Система определяет ваш EFC-сегмент',
    step2Desc: 'Алгоритм анализирует данные и определяет оптимальную стратегию',
    step3Title: 'Получаете уникальный персональный "Путь"',
    step3Desc: 'Дедлайны, задачи, рекомендации ВУЗов и грантов — всё персонализировано',
    
    // Advantages Section
    advantagesTitle: 'Почему Qadam AI',
    advantagesSubtitle: 'Умная система, которая понимает вашу ситуацию',
    advantage1Title: 'Индивидуальный путь по вашему EFC',
    advantage1Desc: 'Алгоритм подбирает план на основе финансового профиля вашей семьи',
    advantage2Title: 'Умные подсказки и дедлайны',
    advantage2Desc: 'Никогда не пропустите важную дату — система напомнит заранее',
    advantage3Title: 'Автоматическая фильтрация ВУЗов',
    advantage3Desc: 'Только те университеты, которые подходят под ваш бюджет и профиль',
    advantage4Title: 'Реальные Истории Успеха',
    advantage4Desc: 'Видите путь студентов с похожими данными',
    advantage5Title: 'AI-оптимизация стратегии',
    advantage5Desc: 'Искусственный интеллект анализирует тысячи кейсов для вашего плана',
    
    // EFC Section
    efcTitle: 'Что такое EFC и зачем это нужно?',
    efcSubtitle: 'Expected Family Contribution — ключ к правильным рекомендациям',
    efcPoint1Title: 'Понимание бюджета',
    efcPoint1Desc: 'EFC помогает понять, сколько ваша семья может внести на образование',
    efcPoint2Title: 'Упрощённая модель',
    efcPoint2Desc: 'Мы используем упрощённую модель — всего 3 вопроса вместо сложных форм',
    efcPoint3Title: 'Точные рекомендации',
    efcPoint3Desc: 'Алгоритм подбирает ВУЗы и гранты именно под ваш финансовый профиль',
    efcTrustTitle: 'Почему это надёжно?',
    efcTrust1: 'Алгоритм основан на тысячах реальных кейсов',
    efcTrust2: 'Персонализация в реальном времени',
    efcTrust3: 'Никаких сложных форм — всё автоматически',
    efcTrust4: 'Конфиденциальность данных гарантирована',
    
    // Success Stories
    successStoriesTitle: 'Истории успеха',
    successStoriesSubtitle: 'Реальные студенты, реальные результаты',
    
    // Footer
    footerCtaTitle: 'Готовы создать свой персональный путь?',
    footerCtaSubtitle: 'Бесплатно. Без кредитной карты. Персональный план за 20 секунд.',
    footerCopyright: '© 2024 Qadam AI. Все права защищены.',
    
    // FAQ
    faq: 'Частые вопросы',
    faq1Question: 'Как AI помогает с поступлением?',
    faq1Answer: 'Наш AI анализирует ваш профиль, цели и целевые университеты, чтобы создать персональный план. Он предоставляет конкретные задачи, помощь с эссе, советы по подготовке к тестам и отслеживает ваш прогресс.',
    faq2Question: 'Подходит ли Qadam для международных студентов?',
    faq2Answer: 'Да! Qadam поддерживает поступление в университеты США, Великобритании, Европы, Азии, Турции и Казахстана. Наш AI адаптирует стратегии в зависимости от вашей целевой страны и программы.',
    faq3Question: 'Сколько стоит Qadam?',
    faq3Answer: 'Qadam предлагает бесплатный тариф с базовыми функциями. Премиум-планы открывают AI-советника, персональные дорожные карты и отслеживание возможностей. Начните бесплатно!',
    faq4Question: 'Могу ли я отслеживать дедлайны заявок?',
    faq4Answer: 'Конечно! Qadam генерирует помесячный календарь задач со всеми важными дедлайнами для тестов, заявок, эссе и рекомендаций.',
    
    // Dashboard
    taskOfDay: 'Задача дня',
    approxTime: '~12 мин',
    allTasksCompleted: '🎉 Все задачи выполнены!',
    loading: 'Загрузка...',
    incredible: 'Невероятно!',
    comeBackTomorrow: 'Возвращайся завтра за новыми задачами',
    completeAndProgress: 'Выполни и двигайся к цели!',
    completed: 'Выполнено!',
    heroOfDay: 'Ты герой дня! Все задачи выполнены!',
    almostThere: 'Почти у цели! Ещё немного!',
    goodPace: 'Хороший темп! Продолжай!',
    daysInRow: 'дней подряд! Ты в ударе!',
    startWithOneTask: 'Начни с одной задачи!',
    checkEssay: 'Проверить эссе',
    getImpactScore: 'Получи Impact Score',
    otherTasks: 'Другие задачи',
    aiMentor: 'AI Ментор',
    clickForHelp: 'Нажми на 💬 справа, если нужна помощь',
    student: 'Студент',
    futureStudent: 'Будущий студент',
    
    // Path Page
    myPath: 'Мой путь',
    partOf: 'Часть',
    of: 'из',
    stepsCompleted: 'шагов выполнено',
    pathNotCreated: 'Путь ещё не создан',
    goThroughOnboarding: 'Пройдите онбординг, чтобы получить персональный путь',
    start: 'Начать',
    recommendedUniversities: 'Рекомендуемые университеты',
    match: 'match',
    fitsYourProfile: 'Подходит под твой профиль',
    partTasks: 'Задачи',
    planOptimizedForScholarships: 'План оптимизирован под максимальные стипендии. Фокус на Need-Blind университетах.',
    combinationStrategy: 'Комбинация Need-based и Merit-based стратегий.',
    focusOnMerit: 'Фокус на Merit стипендиях и Early Decision.',
    planForParent: 'План настроен для поддержки ребёнка в процессе поступления.',
    stepCompleted: 'Отлично! Шаг выполнен! 🎉',
    errorUpdating: 'Ошибка при обновлении',
    personalPathCreated: 'Персональный путь создан!',
    errorGeneratingPath: 'Ошибка при генерации пути',
    errorResetting: 'Ошибка при сбросе',
    
    // Essay Engine
    essayAnalysis: 'Анализ эссе',
    uploadEssay: 'Загрузить эссе',
    essayTitle: 'Название эссе',
    enterTitle: 'Введите название',
    essayContent: 'Текст эссе',
    pasteOrType: 'Вставьте или напишите ваше эссе здесь...',
    analyzeEssay: 'Анализировать эссе',
    analyzing: 'Анализируем...',
    impactScore: 'Impact Score',
    strengths: 'Сильные стороны',
    improvements: 'Области для улучшения',
    recommendations: 'Рекомендации',
    newEssay: 'Новое эссе',
    analysisComplete: 'Анализ завершён!',
    analysisError: 'Ошибка анализа. Попробуй ещё раз.',
    couldNotAnalyze: 'Не удалось проанализировать эссе',
    
    // Settings
    settings: 'Настройки',
    profile: 'Профиль',
    language: 'Язык',
    logout: 'Выйти',
    
    // Common
    save: 'Сохранить',
    cancel: 'Отмена',
    back: 'Назад',
    next: 'Далее',
    submit: 'Отправить',
    error: 'Ошибка',
    success: 'Успешно',
  },
  kk: {
    // Header
    bookDemo: 'Демоға жазылу',
    signIn: 'Кіру',
    
    // Hero Section
    efcBadge: 'EFC-Жекелендіру алгоритмі',
    heroMainTitle: 'Түсуге арналған жеке жолыңыз',
    heroHighlight: 'ақылды EFC-Алгоритм көмегімен',
    heroSubtitle: 'Біз жеке түсу жоспарын, дедлайндарды, ЖОО және грант ұсыныстарын жасаймыз — сіздің жағдайыңыз бен бюджетіңіз негізінде.',
    startFree: 'Тегін бастау',
    learnMore: 'Көбірек білу',
    stat50Unis: '50+ университет',
    statPersonalPath: 'Жеке жол',
    
    // Book Demo Modal
    bookDemoTitle: 'Тегін демоға жазылу',
    yourName: 'Сіздің атыңыз',
    namePlaceholder: 'Атыңызды енгізіңіз',
    yourPhone: 'Телефон нөмірі',
    submitDemo: 'Өтінім жіберу',
    sending: 'Жіберілуде...',
    fillAllFields: 'Барлық өрістерді толтырыңыз',
    demoSuccess: 'Өтінім жіберілді!',
    demoSuccessDesc: 'Біз сізбен жақын арада байланысамыз',
    demoError: 'Өтінімді жіберу сәтсіз. Қайтадан көріңіз.',
    
    // Process Section
    howItWorks: 'Бұл қалай жұмыс істейді',
    step1Title: '6 қарапайым сұраққа жауап беріңіз',
    step1Desc: 'Рөл, ел, табыс, бюджет, мақсат және мерзім — басқа ештеңе қажет емес',
    step2Title: 'Жүйе сіздің EFC-сегментіңізді анықтайды',
    step2Desc: 'Алгоритм деректерді талдап, оңтайлы стратегияны анықтайды',
    step3Title: 'Бірегей жеке "Жолыңызды" алыңыз',
    step3Desc: 'Дедлайндар, тапсырмалар, ЖОО және грант ұсыныстары — барлығы жекелендірілген',
    
    // Advantages Section
    advantagesTitle: 'Неге Qadam AI',
    advantagesSubtitle: 'Сіздің жағдайыңызды түсінетін ақылды жүйе',
    advantage1Title: 'Сіздің EFC бойынша жеке жол',
    advantage1Desc: 'Алгоритм сіздің отбасыңыздың қаржылық профилі негізінде жоспар таңдайды',
    advantage2Title: 'Ақылды кеңестер мен дедлайндар',
    advantage2Desc: 'Маңызды күнді ешқашан жіберіп алмаңыз — жүйе алдын ала ескертеді',
    advantage3Title: 'Автоматты ЖОО сүзгісі',
    advantage3Desc: 'Тек сіздің бюджетіңіз бен профиліңізге сәйкес университеттер',
    advantage4Title: 'Нақты табыс тарихтары',
    advantage4Desc: 'Ұқсас деректері бар студенттердің жолын көріңіз',
    advantage5Title: 'AI стратегиясын оңтайландыру',
    advantage5Desc: 'AI сіздің жоспарыңыз үшін мыңдаған кейстерді талдайды',
    
    // EFC Section
    efcTitle: 'EFC дегеніміз не және ол не үшін қажет?',
    efcSubtitle: 'Expected Family Contribution — дұрыс ұсыныстарға кілт',
    efcPoint1Title: 'Бюджетті түсіну',
    efcPoint1Desc: 'EFC сіздің отбасыңыздың білімге қанша қоса алатынын түсінуге көмектеседі',
    efcPoint2Title: 'Оңайлатылған модель',
    efcPoint2Desc: 'Біз оңайлатылған модельді қолданамыз — күрделі пішіндердің орнына тек 3 сұрақ',
    efcPoint3Title: 'Дәл ұсыныстар',
    efcPoint3Desc: 'Алгоритм сіздің қаржылық профиліңізге арналған ЖОО мен гранттарды таңдайды',
    efcTrustTitle: 'Неге бұл сенімді?',
    efcTrust1: 'Алгоритм мыңдаған нақты кейстерге негізделген',
    efcTrust2: 'Нақты уақыттағы жекелендіру',
    efcTrust3: 'Күрделі пішіндер жоқ — барлығы автоматты',
    efcTrust4: 'Деректердің құпиялылығы кепілдендірілген',
    
    // Success Stories
    successStoriesTitle: 'Табыс тарихтары',
    successStoriesSubtitle: 'Нақты студенттер, нақты нәтижелер',
    
    // Footer
    footerCtaTitle: 'Жеке жолыңызды жасауға дайынсыз ба?',
    footerCtaSubtitle: 'Тегін. Несие картасыз. 20 секундта жеке жоспар.',
    footerCopyright: '© 2024 Qadam AI. Барлық құқықтар қорғалған.',
    
    // FAQ
    faq: 'Жиі қойылатын сұрақтар',
    faq1Question: 'AI түсуге қалай көмектеседі?',
    faq1Answer: 'Біздің AI сіздің профиліңізді, мақсаттарыңызды және мақсатты университеттерді талдап, жеке жоспар жасайды. Ол нақты тапсырмалар, эссе бойынша көмек, тест дайындығы бойынша кеңестер береді.',
    faq2Question: 'Qadam халықаралық студенттерге сәйкес келе ме?',
    faq2Answer: 'Иә! Qadam АҚШ, Ұлыбритания, Еуропа, Азия, Түркия және Қазақстан университеттеріне түсуді қолдайды. AI мақсатты елге байланысты стратегияларды бейімдейді.',
    faq3Question: 'Qadam қанша тұрады?',
    faq3Answer: 'Qadam базалық функциялары бар тегін тарифті ұсынады. Премиум жоспарлар AI-кеңесшіні, жеке жол карталарын және мүмкіндіктерді бақылауды ашады. Тегін бастаңыз!',
    faq4Question: 'Өтініш дедлайндарын бақылай аламын ба?',
    faq4Answer: 'Әрине! Qadam тесттер, өтініштер, эссе және ұсыныстар үшін барлық маңызды дедлайндармен айлық тапсырма күнтізбесін жасайды.',
    
    // Dashboard
    taskOfDay: 'Күннің тапсырмасы',
    approxTime: '~12 мин',
    allTasksCompleted: '🎉 Барлық тапсырмалар орындалды!',
    loading: 'Жүктелуде...',
    incredible: 'Керемет!',
    comeBackTomorrow: 'Жаңа тапсырмалар үшін ертең келіңіз',
    completeAndProgress: 'Орында және мақсатқа қарай алға жыл!',
    completed: 'Орындалды!',
    heroOfDay: 'Сен күннің батыры! Барлық тапсырмалар орындалды!',
    almostThere: 'Дерлік мақсатта! Тағы аздап!',
    goodPace: 'Жақсы қарқын! Жалғастыр!',
    daysInRow: 'күн қатарынан! Сен керемет!',
    startWithOneTask: 'Бір тапсырмадан баста!',
    checkEssay: 'Эссе тексеру',
    getImpactScore: 'Impact Score алу',
    otherTasks: 'Басқа тапсырмалар',
    aiMentor: 'AI Тәлімгер',
    clickForHelp: 'Көмек қажет болса, оң жақтағы 💬 басыңыз',
    student: 'Студент',
    futureStudent: 'Болашақ студент',
    
    // Path Page
    myPath: 'Менің жолым',
    partOf: 'Бөлім',
    of: 'ішінен',
    stepsCompleted: 'қадам орындалды',
    pathNotCreated: 'Жол әлі жасалмаған',
    goThroughOnboarding: 'Жеке жолыңызды алу үшін онбордингтен өтіңіз',
    start: 'Бастау',
    recommendedUniversities: 'Ұсынылатын университеттер',
    match: 'сәйкестік',
    fitsYourProfile: 'Сіздің профиліңізге сәйкес',
    partTasks: 'Тапсырмалар',
    planOptimizedForScholarships: 'Жоспар максималды стипендияларға оңтайландырылған. Need-Blind университеттеріне фокус.',
    combinationStrategy: 'Need-based және Merit-based стратегияларының комбинациясы.',
    focusOnMerit: 'Merit стипендияларына және Early Decision-ға фокус.',
    planForParent: 'Жоспар балаңызды түсу процесінде қолдауға бапталған.',
    stepCompleted: 'Керемет! Қадам орындалды! 🎉',
    errorUpdating: 'Жаңарту кезінде қате',
    personalPathCreated: 'Жеке жол жасалды!',
    errorGeneratingPath: 'Жол генерациясы кезінде қате',
    errorResetting: 'Қалпына келтіру кезінде қате',
    
    // Essay Engine
    essayAnalysis: 'Эссе талдауы',
    uploadEssay: 'Эссе жүктеу',
    essayTitle: 'Эссе атауы',
    enterTitle: 'Атауын енгізіңіз',
    essayContent: 'Эссе мәтіні',
    pasteOrType: 'Эссеңізді осында қойыңыз немесе жазыңыз...',
    analyzeEssay: 'Эссе талдау',
    analyzing: 'Талдануда...',
    impactScore: 'Impact Score',
    strengths: 'Күшті жақтары',
    improvements: 'Жақсарту аймақтары',
    recommendations: 'Ұсыныстар',
    newEssay: 'Жаңа эссе',
    analysisComplete: 'Талдау аяқталды!',
    analysisError: 'Талдау қатесі. Қайтадан көріңіз.',
    couldNotAnalyze: 'Эссе талдау мүмкін болмады',
    
    // Settings
    settings: 'Параметрлер',
    profile: 'Профиль',
    language: 'Тіл',
    logout: 'Шығу',
    
    // Common
    save: 'Сақтау',
    cancel: 'Болдырмау',
    back: 'Артқа',
    next: 'Келесі',
    submit: 'Жіберу',
    error: 'Қате',
    success: 'Сәтті',
  },
};