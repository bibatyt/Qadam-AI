import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LandingLanguage = 'en' | 'ru' | 'kz';

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
    
    // Hero
    aiPowered: 'AI-powered education',
    heroTitle: 'Get into your',
    heroTitleHighlight: 'Dream University',
    heroTitleEnd: 'with AI',
    heroDescription: 'Your personal AI assistant will guide you from the first step to admission to top universities worldwide',
    startJourney: 'Start Your Journey',
    freeConsultation: 'Free Consultation',
    successRate: 'Success Rate',
    universities: 'Universities',
    
    // Features
    whyQadam: 'Why Qadam?',
    globalAccess: 'Global Access',
    globalAccessDesc: 'Strategies for USA, Europe, Asia, and more',
    aiPersonalization: 'AI Personalization',
    aiPersonalizationDesc: 'Individual preparation plan tailored to your profile',
    goalAdmission: 'Goal — Admission',
    goalAdmissionDesc: 'Focus on results: from first steps to enrollment',
    community: 'Community',
    communityDesc: 'Join thousands of students worldwide',
    
    // Process
    howItWorks: 'How It Works?',
    step1Title: 'Tell About Yourself',
    step1Desc: 'Fill your profile: grades, tests, goals and interests',
    step2Title: 'Get AI Plan',
    step2Desc: 'AI will create a personalized monthly preparation plan',
    step3Title: 'Get Into Your Dream',
    step3Desc: 'Follow the plan, complete tasks and get into a top university',
    
    // Testimonials
    successStories: 'Success Stories',
    testimonial1Quote: 'Thanks to Qadam, I prepared the perfect essay and got a scholarship to NIS. The AI advisor helped at every step!',
    testimonial1Author: 'Almas M.',
    testimonial1Uni: 'NU',
    testimonial2Quote: 'The gamification system motivated me to prepare every day. A 90-day streak helped me score 1500+ on SAT!',
    testimonial2Author: 'Timur A.',
    testimonial2Uni: 'MIT',
    
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
    
    // Footer CTA
    readyToStart: 'Ready to start your journey?',
    footerDesc: 'Join thousands of students already on their way to their dream university',
    startFree: 'Start Free',
    
    // Footer
    copyright: '© 2024 Qadam. All rights reserved.',
  },
  ru: {
    // Header
    bookDemo: 'Записаться на демо',
    signIn: 'Войти',
    
    // Hero
    aiPowered: 'AI-powered образование',
    heroTitle: 'Поступи в университет',
    heroTitleHighlight: 'мечты',
    heroTitleEnd: 'с AI',
    heroDescription: 'Персональный AI-помощник проведёт тебя от первого шага до зачисления в топовые университеты мира',
    startJourney: 'Начать путь',
    freeConsultation: 'Бесплатная консультация',
    successRate: 'Успех',
    universities: 'Университетов',
    
    // Features
    whyQadam: 'Почему Qadam?',
    globalAccess: 'Глобальный доступ',
    globalAccessDesc: 'Стратегии для США, Европы, Азии и других регионов',
    aiPersonalization: 'AI-персонализация',
    aiPersonalizationDesc: 'Индивидуальный план подготовки под ваш профиль',
    goalAdmission: 'Цель — поступление',
    goalAdmissionDesc: 'Фокус на результате: от первых шагов до зачисления',
    community: 'Сообщество',
    communityDesc: 'Присоединяйтесь к тысячам студентов по всему миру',
    
    // Process
    howItWorks: 'Как это работает?',
    step1Title: 'Расскажи о себе',
    step1Desc: 'Заполни профиль: оценки, тесты, цели и интересы',
    step2Title: 'Получи AI-план',
    step2Desc: 'AI создаст персональный план подготовки по месяцам',
    step3Title: 'Поступи в мечту',
    step3Desc: 'Следуй плану, выполняй задания и поступи в топовый университет',
    
    // Testimonials
    successStories: 'Истории успеха',
    testimonial1Quote: 'Благодаря Qadam я подготовил идеальное эссе и получил стипендию в НИШ. AI-советник помог на каждом шаге!',
    testimonial1Author: 'Алмас М.',
    testimonial1Uni: 'NU',
    testimonial2Quote: 'Система геймификации мотивировала меня готовиться каждый день. Серия в 90 дней помогла мне набрать 1500+ на SAT!',
    testimonial2Author: 'Тимур А.',
    testimonial2Uni: 'MIT',
    
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
    
    // Footer CTA
    readyToStart: 'Готов начать свой путь?',
    footerDesc: 'Присоединяйся к тысячам студентов, которые уже на пути к университету мечты',
    startFree: 'Начать бесплатно',
    
    // Footer
    copyright: '© 2024 Qadam. Все права защищены.',
  },
  kz: {
    // Header
    bookDemo: 'Демоға жазылу',
    signIn: 'Кіру',
    
    // Hero
    aiPowered: 'AI-қуатты білім',
    heroTitle: 'AI көмегімен',
    heroTitleHighlight: 'арман университетіне',
    heroTitleEnd: 'түс',
    heroDescription: 'Жеке AI-көмекшіңіз сізді алғашқы қадамнан әлемнің үздік университеттеріне түсуге дейін жетелейді',
    startJourney: 'Жолды бастау',
    freeConsultation: 'Тегін кеңес',
    successRate: 'Сәттілік',
    universities: 'Университет',
    
    // Features
    whyQadam: 'Неге Qadam?',
    globalAccess: 'Жаһандық қолжетімділік',
    globalAccessDesc: 'АҚШ, Еуропа, Азия және басқа аймақтар үшін стратегиялар',
    aiPersonalization: 'AI-жекелендіру',
    aiPersonalizationDesc: 'Сіздің профиліңізге бейімделген жеке дайындық жоспары',
    goalAdmission: 'Мақсат — түсу',
    goalAdmissionDesc: 'Нәтижеге бағыт: алғашқы қадамнан қабылдауға дейін',
    community: 'Қоғамдастық',
    communityDesc: 'Әлем бойынша мыңдаған студенттерге қосылыңыз',
    
    // Process
    howItWorks: 'Бұл қалай жұмыс істейді?',
    step1Title: 'Өзіңіз туралы айтыңыз',
    step1Desc: 'Профиліңізді толтырыңыз: бағалар, тесттер, мақсаттар мен қызығушылықтар',
    step2Title: 'AI-жоспар алыңыз',
    step2Desc: 'AI айлық дайындық жоспарын жасайды',
    step3Title: 'Арманыңызға түсіңіз',
    step3Desc: 'Жоспарды орындаңыз, тапсырмаларды орындаңыз және үздік университетке түсіңіз',
    
    // Testimonials
    successStories: 'Табыс тарихтары',
    testimonial1Quote: 'Qadam арқасында мен тамаша эссе дайындап, НЗМ-ге стипендия алдым. AI-кеңесші әр қадамда көмектесті!',
    testimonial1Author: 'Алмас М.',
    testimonial1Uni: 'NU',
    testimonial2Quote: 'Геймификация жүйесі мені күн сайын дайындалуға ынталандырды. 90 күндік серия SAT-та 1500+ ұпай жинауға көмектесті!',
    testimonial2Author: 'Тимур А.',
    testimonial2Uni: 'MIT',
    
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
    
    // Footer CTA
    readyToStart: 'Жолыңызды бастауға дайынсыз ба?',
    footerDesc: 'Арман университетіне жетуге жетудің жолындағы мыңдаған студенттерге қосылыңыз',
    startFree: 'Тегін бастау',
    
    // Footer
    copyright: '© 2024 Qadam. Барлық құқықтар қорғалған.',
  },
};
