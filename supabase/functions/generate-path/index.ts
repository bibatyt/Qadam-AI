import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PathRequest {
  role: 'student' | 'parent';
  efcSegment: 'low' | 'medium' | 'high';
  targetCountry: string;
  currentGrade: string;
  mainGoal: string;
  targetUniversities: string[];
  satScore?: number;
  ieltsScore?: number;
  englishLevel?: string;
  deadline?: string;
  desiredMajor?: string;
  budgetRange?: string;
  language?: 'en' | 'ru' | 'kz';
}

interface Milestone {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  order_index: number;
  efc_specific: boolean;
  metadata: Record<string, any>;
  part: number;
}

type Lang = 'en' | 'ru' | 'kz';

// Translations for milestones
const translations = {
  en: {
    // Part 1: Foundation
    researchPrograms: "Research programs in your major",
    researchProgramsDesc: (major: string) => `Study requirements and features of programs in ${major || 'your chosen field'} in target countries`,
    createUniversityList: "Create target university list",
    createUniversityListDesc: "Select 8-12 universities: 3-4 reach, 4-5 target, 2-3 safety",
    needBlindList: "Create Need-Blind university list",
    needBlindListDesc: "Harvard, Yale, MIT, Princeton, Amherst don't consider finances for international admissions",
    
    // Part 2: Test Prep
    improveSAT: (current: number) => current ? `Improve SAT from ${current} to 1450+` : "Prepare for SAT",
    improveSATDesc: (current: number) => current && current >= 1200 
      ? "Focus on weak sections. Goal: 1450+ for top universities"
      : "Start with diagnostic test, then systematic preparation",
    improveIELTS: (current: number, target: number) => current ? `Improve IELTS from ${current} to ${target}+` : `Prepare for IELTS (goal: ${target}+)`,
    improveIELTSDesc: (level: string) => level === 'beginner' 
      ? "Start with intensive English course, then test preparation"
      : "Focus on Writing and Speaking to achieve target score",
    subjectTests: "Prepare for subject tests",
    subjectTestsDesc: "BMAT for medicine, LNAT for law, MAT/TMUA for mathematics",
    
    // Part 3: Application
    activitiesList: "Create Activities List",
    activitiesListDesc: "Document all achievements, projects, and volunteering for the last 4 years",
    personalStatement: "Write Personal Statement",
    personalStatementDesc: "Main essay about your unique experience and motivation",
    supplementalEssays: "Write Supplemental Essays",
    supplementalEssaysDesc: (major: string) => `"Why ${major}?" and "Why this university?" essays for each school`,
    recommendations: "Choose teachers for recommendations",
    recommendationsDesc: "Ask 2-3 teachers who know you well to write recommendation letters",
    ucasStatement: "Write UCAS Personal Statement",
    ucasStatementDesc: "4000 characters about your academic passion and achievements in chosen field",
    
    // Part 4: Financial
    cssProfile: "Complete CSS Profile",
    cssProfileDesc: "Required form for financial aid at top US universities",
    fafsa: "Complete FAFSA",
    fafsaDesc: "US federal form (opens October 1)",
    externalScholarships: "Find external scholarships",
    externalScholarshipsDesc: "Bolashak, DAAD, Fulbright, Chevening and other programs",
    freeEducation: "Research free education options",
    freeEducationDesc: "Germany, Norway, Finland — free even for international students",
    combinedStrategy: "Combined funding strategy",
    combinedStrategyDesc: "Apply for Need-based + Merit-based for optimal coverage",
    meritScholarships: "Find Merit scholarships",
    meritScholarshipsDesc: "Many universities give $10-30k/year for academic achievements",
    meritBased: "Merit-based scholarships",
    meritBasedDesc: "Apply for scholarships based on academic and extracurricular achievements",
    earlyDecision: "Consider Early Decision",
    earlyDecisionDesc: "ED increases chances by 10-15% at top universities",
    
    // Part 5: Submission
    earlyApps: "Submit Early Applications",
    earlyAppsDesc: "Early Decision/Action deadlines: November 1-15",
    regularApps: "Submit Regular Applications",
    regularAppsDesc: "Deadlines: January 1-15 for most universities",
    trackStatus: "Track application status",
    trackStatusDesc: "Check portals, respond to admission committee requests",
    finalDecision: "Accept and confirm",
    finalDecisionDesc: "Choose university and submit deposit by May 1",
    
    // Parent milestones
    financialPlan: "Create financial plan",
    financialPlanDesc: "Assess total cost and create plan to cover expenses",
    deadlineCalendar: "Set up deadline calendar",
    deadlineCalendarDesc: "Create shared calendar with your child with all important dates",
    financialDocs: "Prepare financial documents",
    financialDocsDesc: "Tax returns, income statements, asset statements",
    weeklyCheckin: "Weekly check-in with child",
    weeklyCheckinDesc: "Discuss progress and help with process organization",
    studyAidOptions: "Study all financial aid options",
    studyAidOptionsDesc: "Need-based grants, government programs, educational loans",
    
    // EFC explanations
    efcLow: "Plan optimized for maximum scholarships. Focus on Need-Blind universities that don't consider financial status in admissions.",
    efcMedium: "Combined strategy: Need-based + Merit-based scholarships for optimal tuition coverage.",
    efcHigh: "Focus on Merit-based scholarships and Early Decision strategy to increase chances at top programs.",
    
    // Match reasons
    needBlindMatch: "Need-blind for international students",
    freeTuition: "Free tuition",
    satMatch: "Your SAT meets requirements",
    topProgram: "Top program in your major",
    fitsProfile: "Fits your profile",
  },
  ru: {
    // Part 1: Foundation
    researchPrograms: "Исследование программ по специальности",
    researchProgramsDesc: (major: string) => `Изучи требования и особенности программ по ${major || 'выбранной специальности'} в целевых странах`,
    createUniversityList: "Составить список целевых университетов",
    createUniversityListDesc: "Выбери 8-12 университетов: 3-4 reach, 4-5 target, 2-3 safety",
    needBlindList: "Составить список Need-Blind университетов",
    needBlindListDesc: "Harvard, Yale, MIT, Princeton, Amherst не учитывают финансы при приёме иностранцев",
    
    // Part 2: Test Prep
    improveSAT: (current: number) => current ? `Улучшить SAT с ${current} до 1450+` : "Подготовиться к SAT",
    improveSATDesc: (current: number) => current && current >= 1200 
      ? "Фокус на слабых секциях. Цель: 1450+ для топовых университетов"
      : "Начни с диагностического теста, затем систематическая подготовка",
    improveIELTS: (current: number, target: number) => current ? `Улучшить IELTS с ${current} до ${target}+` : `Подготовиться к IELTS (цель: ${target}+)`,
    improveIELTSDesc: (level: string) => level === 'beginner' 
      ? "Начни с интенсивного курса английского, затем подготовка к тесту"
      : "Фокус на Writing и Speaking для достижения целевого балла",
    subjectTests: "Подготовка к предметным тестам",
    subjectTestsDesc: "BMAT для медицины, LNAT для права, MAT/TMUA для математики",
    
    // Part 3: Application
    activitiesList: "Создать Activities List",
    activitiesListDesc: "Задокументируй все достижения, проекты и волонтёрство за последние 4 года",
    personalStatement: "Написать Personal Statement",
    personalStatementDesc: "Главное эссе о твоём уникальном опыте и мотивации",
    supplementalEssays: "Написать Supplemental Essays",
    supplementalEssaysDesc: (major: string) => `Эссе "Why ${major}?" и "Why this university?" для каждого вуза`,
    recommendations: "Выбрать учителей для рекомендаций",
    recommendationsDesc: "Попроси 2-3 учителей, которые хорошо тебя знают, написать recommendation letters",
    ucasStatement: "Написать UCAS Personal Statement",
    ucasStatementDesc: "4000 символов о твоей академической страсти и достижениях в выбранной области",
    
    // Part 4: Financial
    cssProfile: "Заполнить CSS Profile",
    cssProfileDesc: "Обязательная форма для финансовой помощи в топовых университетах США",
    fafsa: "Заполнить FAFSA",
    fafsaDesc: "Федеральная форма США (открывается 1 октября)",
    externalScholarships: "Найти внешние стипендии",
    externalScholarshipsDesc: "Bolashak, DAAD, Fulbright, Chevening и другие программы",
    freeEducation: "Исследовать бесплатное образование",
    freeEducationDesc: "Германия, Норвегия, Финляндия — бесплатно даже для иностранцев",
    combinedStrategy: "Комбинированная стратегия финансирования",
    combinedStrategyDesc: "Подай на Need-based + Merit-based для оптимального покрытия",
    meritScholarships: "Найти Merit стипендии",
    meritScholarshipsDesc: "Многие университеты дают $10-30k/год за академические достижения",
    meritBased: "Merit-based стипендии",
    meritBasedDesc: "Подавайся на стипендии за академические и внеклассные достижения",
    earlyDecision: "Рассмотреть Early Decision",
    earlyDecisionDesc: "ED увеличивает шансы на 10-15% в топовых университетах",
    
    // Part 5: Submission
    earlyApps: "Подать Early Applications",
    earlyAppsDesc: "Early Decision/Action дедлайны: 1-15 ноября",
    regularApps: "Подать Regular Applications",
    regularAppsDesc: "Дедлайны: 1-15 января для большинства вузов",
    trackStatus: "Отслеживать статус заявок",
    trackStatusDesc: "Проверяй порталы, отвечай на запросы приёмных комиссий",
    finalDecision: "Принять решение и подтвердить",
    finalDecisionDesc: "Выбрать вуз и внести депозит до 1 мая",
    
    // Parent milestones
    financialPlan: "Создать финансовый план",
    financialPlanDesc: "Оцените общую стоимость и составьте план покрытия расходов",
    deadlineCalendar: "Настроить календарь дедлайнов",
    deadlineCalendarDesc: "Создайте общий календарь с ребёнком со всеми важными датами",
    financialDocs: "Подготовить финансовые документы",
    financialDocsDesc: "Налоговые декларации, справки о доходах, выписки по активам",
    weeklyCheckin: "Еженедельные check-in с ребёнком",
    weeklyCheckinDesc: "Обсуждайте прогресс и помогайте с организацией процесса",
    studyAidOptions: "Изучить все варианты финансовой помощи",
    studyAidOptionsDesc: "Need-based гранты, государственные программы, образовательные кредиты",
    
    // EFC explanations
    efcLow: "План оптимизирован под максимальные стипендии. Фокус на Need-Blind университетах, которые не учитывают финансовое положение при приёме.",
    efcMedium: "Комбинированная стратегия: Need-based + Merit-based стипендии для оптимального покрытия стоимости обучения.",
    efcHigh: "Фокус на Merit-based стипендиях и Early Decision стратегии для повышения шансов в топовых программах.",
    
    // Match reasons
    needBlindMatch: "Need-blind для иностранцев",
    freeTuition: "Бесплатное обучение",
    satMatch: "Твой SAT соответствует требованиям",
    topProgram: "Топ-программа по твоей специальности",
    fitsProfile: "Подходит под твой профиль",
  },
  kz: {
    // Part 1: Foundation
    researchPrograms: "Мамандық бойынша бағдарламаларды зерттеу",
    researchProgramsDesc: (major: string) => `Мақсатты елдердегі ${major || 'таңдалған мамандық'} бағдарламаларының талаптары мен ерекшеліктерін зерттеңіз`,
    createUniversityList: "Мақсатты университеттер тізімін құру",
    createUniversityListDesc: "8-12 университет таңдаңыз: 3-4 reach, 4-5 target, 2-3 safety",
    needBlindList: "Need-Blind университеттер тізімін құру",
    needBlindListDesc: "Harvard, Yale, MIT, Princeton, Amherst шетелдіктерді қабылдауда қаржылық жағдайды ескермейді",
    
    // Part 2: Test Prep
    improveSAT: (current: number) => current ? `SAT-ты ${current}-ден 1450+-ға дейін жақсарту` : "SAT-қа дайындалу",
    improveSATDesc: (current: number) => current && current >= 1200 
      ? "Әлсіз бөлімдерге назар аударыңыз. Мақсат: үздік университеттер үшін 1450+"
      : "Диагностикалық тесттен бастап, жүйелі дайындық",
    improveIELTS: (current: number, target: number) => current ? `IELTS-ті ${current}-ден ${target}+-ға дейін жақсарту` : `IELTS-ке дайындалу (мақсат: ${target}+)`,
    improveIELTSDesc: (level: string) => level === 'beginner' 
      ? "Интенсивті ағылшын курсынан бастап, содан кейін тестке дайындық"
      : "Мақсатты балға жету үшін Writing және Speaking-ке назар аударыңыз",
    subjectTests: "Пәндік тесттерге дайындық",
    subjectTestsDesc: "BMAT медицина үшін, LNAT құқық үшін, MAT/TMUA математика үшін",
    
    // Part 3: Application
    activitiesList: "Activities List құру",
    activitiesListDesc: "Соңғы 4 жылдағы барлық жетістіктерді, жобаларды және волонтерлікті құжаттаңыз",
    personalStatement: "Personal Statement жазу",
    personalStatementDesc: "Сіздің бірегей тәжірибеңіз бен мотивациңыз туралы негізгі эссе",
    supplementalEssays: "Supplemental Essays жазу",
    supplementalEssaysDesc: (major: string) => `Әр университет үшін "Why ${major}?" және "Why this university?" эсселері`,
    recommendations: "Ұсыныстар үшін мұғалімдерді таңдау",
    recommendationsDesc: "Сізді жақсы білетін 2-3 мұғалімнен recommendation letters жазуын сұраңыз",
    ucasStatement: "UCAS Personal Statement жазу",
    ucasStatementDesc: "Таңдалған салада академиялық құмарлығыңыз бен жетістіктеріңіз туралы 4000 таңба",
    
    // Part 4: Financial
    cssProfile: "CSS Profile толтыру",
    cssProfileDesc: "АҚШ-тың үздік университеттерінде қаржылық көмек алу үшін міндетті форма",
    fafsa: "FAFSA толтыру",
    fafsaDesc: "АҚШ федералды формасы (1 қазанда ашылады)",
    externalScholarships: "Сыртқы стипендияларды табу",
    externalScholarshipsDesc: "Болашақ, DAAD, Fulbright, Chevening және басқа бағдарламалар",
    freeEducation: "Тегін білімді зерттеу",
    freeEducationDesc: "Германия, Норвегия, Финляндия — шетелдіктер үшін де тегін",
    combinedStrategy: "Біріктірілген қаржыландыру стратегиясы",
    combinedStrategyDesc: "Оңтайлы қамтуға Need-based + Merit-based өтініш беріңіз",
    meritScholarships: "Merit стипендияларын табу",
    meritScholarshipsDesc: "Көптеген университеттер академиялық жетістіктер үшін жылына $10-30k береді",
    meritBased: "Merit-based стипендиялар",
    meritBasedDesc: "Академиялық және сыныптан тыс жетістіктер үшін стипендияларға өтініш беріңіз",
    earlyDecision: "Early Decision қарастыру",
    earlyDecisionDesc: "ED үздік университеттерде мүмкіндіктерді 10-15%-ға арттырады",
    
    // Part 5: Submission
    earlyApps: "Early Applications тапсыру",
    earlyAppsDesc: "Early Decision/Action мерзімдері: 1-15 қараша",
    regularApps: "Regular Applications тапсыру",
    regularAppsDesc: "Мерзімдер: көптеген университеттер үшін 1-15 қаңтар",
    trackStatus: "Өтініш мәртебесін қадағалау",
    trackStatusDesc: "Порталдарды тексеріңіз, қабылдау комиссиясының сұраныстарына жауап беріңіз",
    finalDecision: "Шешім қабылдау және растау",
    finalDecisionDesc: "Университетті таңдап, 1 мамырға дейін депозит төлеңіз",
    
    // Parent milestones
    financialPlan: "Қаржылық жоспар құру",
    financialPlanDesc: "Жалпы құнын бағалап, шығындарды жабу жоспарын жасаңыз",
    deadlineCalendar: "Мерзімдер күнтізбесін орнату",
    deadlineCalendarDesc: "Балаңызбен барлық маңызды күндері бар ортақ күнтізбе жасаңыз",
    financialDocs: "Қаржылық құжаттарды дайындау",
    financialDocsDesc: "Салық декларациялары, табыс туралы анықтамалар, активтер бойынша көшірмелер",
    weeklyCheckin: "Балаңызбен апталық тексеріс",
    weeklyCheckinDesc: "Прогресті талқылаңыз және процесті ұйымдастыруға көмектесіңіз",
    studyAidOptions: "Барлық қаржылық көмек нұсқаларын зерттеу",
    studyAidOptionsDesc: "Need-based гранттар, мемлекеттік бағдарламалар, білім кредиттері",
    
    // EFC explanations
    efcLow: "Жоспар максималды стипендияларға оңтайландырылған. Қабылдауда қаржылық жағдайды ескермейтін Need-Blind университеттерге назар аударыңыз.",
    efcMedium: "Біріктірілген стратегия: оқу құнын оңтайлы жабу үшін Need-based + Merit-based стипендиялар.",
    efcHigh: "Үздік бағдарламаларда мүмкіндіктерді арттыру үшін Merit-based стипендиялар мен Early Decision стратегиясына назар аударыңыз.",
    
    // Match reasons
    needBlindMatch: "Шетелдіктер үшін Need-blind",
    freeTuition: "Тегін оқу",
    satMatch: "Сіздің SAT талаптарға сәйкес келеді",
    topProgram: "Мамандығыңыз бойынша үздік бағдарлама",
    fitsProfile: "Профиліңізге сәйкес келеді",
  }
};

// Get translation helper
function getT(lang: Lang) {
  return translations[lang] || translations.en;
}

// Calculate deadline months remaining
function getMonthsUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineMap: Record<string, Date> = {
    '2025_fall': new Date(2025, 8, 1),
    '2026_fall': new Date(2026, 8, 1),
    '2027_fall': new Date(2027, 8, 1),
    'undecided': new Date(2026, 8, 1),
  };
  const targetDate = deadlineMap[deadline] || deadlineMap['undecided'];
  const months = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
  return Math.max(1, months);
}

// Part 1: Foundation & Research
function getFoundationMilestones(targetCountry: string, desiredMajor: string, efcSegment: string, lang: Lang): Milestone[] {
  const t = getT(lang);
  const milestones: Milestone[] = [
    {
      title: t.researchPrograms,
      description: t.researchProgramsDesc(desiredMajor),
      category: "general",
      priority: "high",
      order_index: 1,
      efc_specific: false,
      metadata: { major: desiredMajor },
      part: 1
    },
    {
      title: t.createUniversityList,
      description: t.createUniversityListDesc,
      category: "general",
      priority: "high",
      order_index: 2,
      efc_specific: false,
      metadata: { country: targetCountry },
      part: 1
    },
  ];

  if (efcSegment === 'low') {
    milestones.push({
      title: t.needBlindList,
      description: t.needBlindListDesc,
      category: "financial",
      priority: "high",
      order_index: 3,
      efc_specific: true,
      metadata: { efcType: 'need-blind' },
      part: 1
    });
  }

  return milestones;
}

// Part 2: Test Preparation
function getTestPrepMilestones(targetCountry: string, satScore: number | undefined, ieltsScore: number | undefined, englishLevel: string | undefined, lang: Lang): Milestone[] {
  const t = getT(lang);
  const milestones: Milestone[] = [];
  let orderIndex = 10;

  if (targetCountry === 'usa' || targetCountry === 'canada') {
    if (!satScore || satScore < 1400) {
      milestones.push({
        title: t.improveSAT(satScore || 0),
        description: t.improveSATDesc(satScore || 0),
        category: "exam",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: false,
        metadata: { currentScore: satScore, targetScore: 1450 },
        part: 2
      });
    }
  }

  const needsEnglishPrep = !ieltsScore || ieltsScore < 7.0 || englishLevel === 'beginner' || englishLevel === 'intermediate';
  
  if (needsEnglishPrep) {
    const targetIELTS = targetCountry === 'uk' ? 7.5 : 7.0;
    milestones.push({
      title: t.improveIELTS(ieltsScore || 0, targetIELTS),
      description: t.improveIELTSDesc(englishLevel || ''),
      category: "exam",
      priority: englishLevel === 'beginner' ? "high" : "medium",
      order_index: orderIndex++,
      efc_specific: false,
      metadata: { currentScore: ieltsScore, targetScore: targetIELTS, level: englishLevel },
      part: 2
    });
  }

  if (targetCountry === 'uk') {
    milestones.push({
      title: t.subjectTests,
      description: t.subjectTestsDesc,
      category: "exam",
      priority: "medium",
      order_index: orderIndex++,
      efc_specific: false,
      metadata: {},
      part: 2
    });
  }

  return milestones;
}

// Part 3: Application Materials
function getApplicationMilestones(desiredMajor: string, targetCountry: string, lang: Lang): Milestone[] {
  const t = getT(lang);
  const milestones: Milestone[] = [
    {
      title: t.activitiesList,
      description: t.activitiesListDesc,
      category: "application",
      priority: "high",
      order_index: 20,
      efc_specific: false,
      metadata: {},
      part: 3
    },
    {
      title: t.personalStatement,
      description: t.personalStatementDesc,
      category: "essay",
      priority: "high",
      order_index: 21,
      efc_specific: false,
      metadata: {},
      part: 3
    },
    {
      title: t.supplementalEssays,
      description: t.supplementalEssaysDesc(desiredMajor),
      category: "essay",
      priority: "high",
      order_index: 22,
      efc_specific: false,
      metadata: { major: desiredMajor },
      part: 3
    },
    {
      title: t.recommendations,
      description: t.recommendationsDesc,
      category: "document",
      priority: "medium",
      order_index: 23,
      efc_specific: false,
      metadata: {},
      part: 3
    },
  ];

  if (targetCountry === 'uk') {
    milestones.push({
      title: t.ucasStatement,
      description: t.ucasStatementDesc,
      category: "essay",
      priority: "high",
      order_index: 24,
      efc_specific: false,
      metadata: {},
      part: 3
    });
  }

  return milestones;
}

// Part 4: Financial Aid
function getFinancialMilestones(efcSegment: string, targetCountry: string, lang: Lang): Milestone[] {
  const t = getT(lang);
  const milestones: Milestone[] = [];
  let orderIndex = 30;

  if (efcSegment === 'low') {
    milestones.push(
      {
        title: t.cssProfile,
        description: t.cssProfileDesc,
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: t.fafsa,
        description: t.fafsaDesc,
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: t.externalScholarships,
        description: t.externalScholarshipsDesc,
        category: "financial",
        priority: "medium",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      }
    );

    if (targetCountry === 'eu') {
      milestones.push({
        title: t.freeEducation,
        description: t.freeEducationDesc,
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      });
    }
  } else if (efcSegment === 'medium') {
    milestones.push(
      {
        title: t.combinedStrategy,
        description: t.combinedStrategyDesc,
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: t.meritScholarships,
        description: t.meritScholarshipsDesc,
        category: "financial",
        priority: "medium",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      }
    );
  } else {
    milestones.push(
      {
        title: t.meritBased,
        description: t.meritBasedDesc,
        category: "financial",
        priority: "medium",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: t.earlyDecision,
        description: t.earlyDecisionDesc,
        category: "application",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      }
    );
  }

  return milestones;
}

// Part 5: Submission & Follow-up
function getSubmissionMilestones(deadline: string, lang: Lang): Milestone[] {
  const t = getT(lang);
  const milestones: Milestone[] = [
    {
      title: t.earlyApps,
      description: t.earlyAppsDesc,
      category: "application",
      priority: "high",
      order_index: 40,
      efc_specific: false,
      metadata: { deadline: 'early' },
      part: 5
    },
    {
      title: t.regularApps,
      description: t.regularAppsDesc,
      category: "application",
      priority: "high",
      order_index: 41,
      efc_specific: false,
      metadata: { deadline: 'regular' },
      part: 5
    },
    {
      title: t.trackStatus,
      description: t.trackStatusDesc,
      category: "application",
      priority: "medium",
      order_index: 42,
      efc_specific: false,
      metadata: {},
      part: 5
    },
    {
      title: t.finalDecision,
      description: t.finalDecisionDesc,
      category: "general",
      priority: "high",
      order_index: 43,
      efc_specific: false,
      metadata: {},
      part: 5
    },
  ];

  return milestones;
}

// Parent-specific milestones
function getParentMilestones(efcSegment: string, lang: Lang): Milestone[] {
  const t = getT(lang);
  const milestones: Milestone[] = [
    {
      title: t.financialPlan,
      description: t.financialPlanDesc,
      category: "financial",
      priority: "high",
      order_index: 1,
      efc_specific: false,
      metadata: {},
      part: 1
    },
    {
      title: t.deadlineCalendar,
      description: t.deadlineCalendarDesc,
      category: "general",
      priority: "high",
      order_index: 2,
      efc_specific: false,
      metadata: {},
      part: 1
    },
    {
      title: t.financialDocs,
      description: t.financialDocsDesc,
      category: "document",
      priority: "high",
      order_index: 3,
      efc_specific: false,
      metadata: {},
      part: 2
    },
    {
      title: t.weeklyCheckin,
      description: t.weeklyCheckinDesc,
      category: "general",
      priority: "medium",
      order_index: 4,
      efc_specific: false,
      metadata: {},
      part: 2
    },
  ];

  if (efcSegment === 'low') {
    milestones.push({
      title: t.studyAidOptions,
      description: t.studyAidOptionsDesc,
      category: "financial",
      priority: "high",
      order_index: 5,
      efc_specific: true,
      metadata: {},
      part: 3
    });
  }

  return milestones;
}

// University database
const UNIVERSITY_DATABASE = [
  // USA - Need-Blind
  { name: 'Harvard University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: true, annualCost: 80000, scholarshipType: 'Need-blind Full Aid', majors: ['business', 'law', 'medicine', 'cs', 'engineering', 'arts', 'sciences'], ranking: 1 },
  { name: 'Yale University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: true, annualCost: 80000, scholarshipType: 'Need-blind Full Aid', majors: ['business', 'law', 'arts', 'sciences', 'medicine'], ranking: 3 },
  { name: 'Princeton University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1510, minIELTS: 7.0, needBlind: true, annualCost: 77000, scholarshipType: 'Need-blind Full Aid', majors: ['engineering', 'sciences', 'arts', 'economics'], ranking: 2 },
  { name: 'MIT', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1520, minIELTS: 7.0, needBlind: true, annualCost: 79000, scholarshipType: 'Need-blind Full Aid', majors: ['cs', 'engineering', 'sciences', 'business'], ranking: 4 },
  { name: 'Amherst College', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1450, minIELTS: 7.0, needBlind: true, annualCost: 76000, scholarshipType: 'Need-blind Full Aid', majors: ['arts', 'sciences', 'economics'], ranking: 25 },
  
  // USA - Top Universities
  { name: 'Stanford University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: false, annualCost: 82000, scholarshipType: 'Merit + Need-based', majors: ['cs', 'engineering', 'business', 'sciences'], ranking: 5 },
  { name: 'Columbia University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1480, minIELTS: 7.0, needBlind: false, annualCost: 80000, scholarshipType: 'Need-based Aid', majors: ['business', 'law', 'journalism', 'arts'], ranking: 8 },
  { name: 'University of Chicago', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: false, annualCost: 78000, scholarshipType: 'Merit + Need-based', majors: ['economics', 'sciences', 'law'], ranking: 10 },
  { name: 'Duke University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1470, minIELTS: 7.0, needBlind: false, annualCost: 77000, scholarshipType: 'Need-based Aid', majors: ['medicine', 'business', 'engineering'], ranking: 12 },
  { name: 'Northwestern University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1450, minIELTS: 7.0, needBlind: false, annualCost: 76000, scholarshipType: 'Merit Scholarships', majors: ['journalism', 'business', 'engineering', 'arts'], ranking: 15 },
  
  // USA - State Universities
  { name: 'UCLA', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 45000, scholarshipType: 'Limited Aid', majors: ['cs', 'engineering', 'arts', 'sciences'], ranking: 20 },
  { name: 'UC Berkeley', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 47000, scholarshipType: 'Regents Scholarship', majors: ['cs', 'engineering', 'business', 'sciences'], ranking: 18 },
  { name: 'University of Michigan', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 55000, scholarshipType: 'Merit Scholarships', majors: ['business', 'engineering', 'medicine'], ranking: 22 },
  
  // UK
  { name: 'University of Oxford', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1470, minIELTS: 7.0, needBlind: false, annualCost: 45000, scholarshipType: 'Reach Oxford + Rhodes', majors: ['law', 'medicine', 'arts', 'sciences', 'business'], ranking: 1 },
  { name: 'University of Cambridge', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1480, minIELTS: 7.0, needBlind: false, annualCost: 45000, scholarshipType: 'Cambridge Trust', majors: ['sciences', 'engineering', 'medicine', 'arts'], ranking: 2 },
  { name: 'Imperial College London', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 42000, scholarshipType: "President's Scholarship", majors: ['engineering', 'cs', 'sciences', 'medicine'], ranking: 6 },
  { name: 'London School of Economics', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1420, minIELTS: 7.0, needBlind: false, annualCost: 40000, scholarshipType: 'LSE Scholarship', majors: ['economics', 'business', 'law', 'politics'], ranking: 8 },
  { name: 'UCL', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 38000, scholarshipType: 'UCL Global Scholarship', majors: ['arts', 'sciences', 'engineering', 'medicine'], ranking: 9 },
  
  // Canada
  { name: 'University of Toronto', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 50000, scholarshipType: 'Lester B. Pearson', majors: ['cs', 'engineering', 'business', 'medicine'], ranking: 1 },
  { name: 'McGill University', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 45000, scholarshipType: 'McGill Scholarships', majors: ['medicine', 'arts', 'sciences', 'law'], ranking: 2 },
  { name: 'University of British Columbia', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 42000, scholarshipType: 'International Leader', majors: ['cs', 'engineering', 'sciences', 'business'], ranking: 3 },
  
  // Europe
  { name: 'ETH Zurich', country: 'Switzerland', countryCode: 'CH', region: 'eu', minSAT: 1400, minIELTS: 7.0, needBlind: false, annualCost: 1500, scholarshipType: 'Excellence Scholarship', majors: ['engineering', 'cs', 'sciences'], ranking: 6 },
  { name: 'TU Munich', country: 'Germany', countryCode: 'DE', region: 'eu', minSAT: 1300, minIELTS: 6.5, needBlind: false, annualCost: 500, scholarshipType: 'Free Tuition', majors: ['engineering', 'cs', 'sciences'], ranking: 10 },
  { name: 'University of Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'eu', minSAT: 1300, minIELTS: 6.5, needBlind: false, annualCost: 15000, scholarshipType: 'Holland Scholarship', majors: ['business', 'economics', 'sciences', 'arts'], ranking: 12 },
  
  // Asia
  { name: 'National University of Singapore', country: 'Singapore', countryCode: 'SG', region: 'asia', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 35000, scholarshipType: 'Global Merit', majors: ['cs', 'engineering', 'business', 'sciences'], ranking: 8 },
  { name: 'University of Hong Kong', country: 'Hong Kong', countryCode: 'HK', region: 'asia', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 28000, scholarshipType: 'HKU Foundation', majors: ['business', 'law', 'medicine', 'sciences'], ranking: 15 },
  
  // Middle East
  { name: 'NYU Abu Dhabi', country: 'UAE', countryCode: 'AE', region: 'middle_east', minSAT: 1400, minIELTS: 7.0, needBlind: true, annualCost: 0, scholarshipType: 'Full Scholarship', majors: ['arts', 'sciences', 'engineering', 'business'], ranking: 1 },
  { name: 'KAUST', country: 'Saudi Arabia', countryCode: 'SA', region: 'middle_east', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 0, scholarshipType: 'KAUST Fellowship', majors: ['engineering', 'cs', 'sciences'], ranking: 2 },
  { name: 'Qatar University', country: 'Qatar', countryCode: 'QA', region: 'middle_east', minSAT: 1200, minIELTS: 6.0, needBlind: false, annualCost: 5000, scholarshipType: 'Qatar Scholarship', majors: ['engineering', 'business', 'sciences'], ranking: 3 },
  { name: 'American University of Sharjah', country: 'UAE', countryCode: 'AE', region: 'middle_east', minSAT: 1250, minIELTS: 6.0, needBlind: false, annualCost: 25000, scholarshipType: 'Merit Scholarship', majors: ['engineering', 'business', 'arts'], ranking: 4 },
  
  // Kazakhstan
  { name: 'Nazarbayev University', country: 'Kazakhstan', countryCode: 'KZ', region: 'cis', minSAT: 1200, minIELTS: 6.0, needBlind: false, annualCost: 0, scholarshipType: 'Full Scholarship', majors: ['engineering', 'cs', 'business', 'sciences'], ranking: 500 },
  { name: 'KIMEP University', country: 'Kazakhstan', countryCode: 'KZ', region: 'cis', minSAT: 1100, minIELTS: 5.5, needBlind: false, annualCost: 8000, scholarshipType: 'Merit Scholarship', majors: ['business', 'economics', 'law'], ranking: 600 },
];

// Calculate match score
function calculateMatchScore(
  uni: typeof UNIVERSITY_DATABASE[0],
  satScore: number | undefined,
  ieltsScore: number | undefined,
  efcSegment: string,
  budgetRange: string,
  desiredMajor: string | undefined
): number {
  let score = 70;
  
  if (satScore) {
    if (satScore >= uni.minSAT + 100) score += 15;
    else if (satScore >= uni.minSAT) score += 10;
    else if (satScore >= uni.minSAT - 100) score += 5;
    else score -= 10;
  }
  
  if (ieltsScore) {
    if (ieltsScore >= uni.minIELTS + 0.5) score += 10;
    else if (ieltsScore >= uni.minIELTS) score += 5;
    else score -= 5;
  }
  
  const budgetMap: Record<string, number> = {
    'under_10k': 10000,
    '10k_30k': 30000,
    '30k_50k': 50000,
    'over_50k': 100000,
  };
  const userBudget = budgetMap[budgetRange] || 30000;
  
  if (efcSegment === 'low' && uni.needBlind) {
    score += 10;
  } else if (uni.annualCost <= userBudget) {
    score += 8;
  } else if (uni.annualCost <= userBudget * 1.5) {
    score += 3;
  } else {
    score -= 5;
  }
  
  if (desiredMajor) {
    const majorLower = desiredMajor.toLowerCase();
    const majorMap: Record<string, string[]> = {
      'cs': ['cs', 'computer science', 'программирование', 'it'],
      'engineering': ['engineering', 'инженерия', 'механика'],
      'business': ['business', 'бизнес', 'менеджмент', 'mba', 'economics'],
      'medicine': ['medicine', 'медицина', 'биология', 'pre-med'],
      'law': ['law', 'право', 'юриспруденция'],
      'arts': ['arts', 'искусство', 'дизайн', 'humanities'],
      'sciences': ['sciences', 'physics', 'chemistry', 'math', 'физика', 'химия'],
    };
    
    for (const [key, keywords] of Object.entries(majorMap)) {
      if (keywords.some(k => majorLower.includes(k)) && uni.majors.includes(key)) {
        score += 5;
        break;
      }
    }
  }
  
  return Math.min(99, Math.max(50, score));
}

// Generate university recommendations
function generateUniversityRecommendations(
  targetCountry: string,
  efcSegment: string,
  budgetRange: string,
  satScore: number | undefined,
  ieltsScore: number | undefined,
  desiredMajor: string | undefined,
  lang: Lang
): any[] {
  let candidates = UNIVERSITY_DATABASE;
  
  const regionMap: Record<string, string[]> = {
    'usa': ['usa'],
    'canada': ['canada'],
    'uk': ['uk'],
    'eu': ['eu'],
    'asia': ['asia'],
    'cis': ['cis'],
    'middle_east': ['middle_east'],
    'all': ['usa', 'canada', 'uk', 'eu', 'asia', 'cis', 'middle_east'],
  };
  
  const targetRegions = regionMap[targetCountry] || regionMap['all'];
  candidates = candidates.filter(u => targetRegions.includes(u.region));
  
  if (efcSegment === 'low') {
    candidates.sort((a, b) => {
      if (a.needBlind && !b.needBlind) return -1;
      if (!a.needBlind && b.needBlind) return 1;
      return a.annualCost - b.annualCost;
    });
  }
  
  const t = getT(lang);
  const recommendations = candidates.map(uni => ({
    name: uni.name,
    country: uni.country,
    countryCode: uni.countryCode,
    matchScore: calculateMatchScore(uni, satScore, ieltsScore, efcSegment, budgetRange, desiredMajor),
    scholarshipType: uni.scholarshipType,
    needBlind: uni.needBlind,
    annualCost: uni.annualCost,
    reason: generateMatchReason(uni, efcSegment, satScore, ieltsScore, desiredMajor, lang),
  }));
  
  recommendations.sort((a, b) => b.matchScore - a.matchScore);
  
  return recommendations.slice(0, 8);
}

function generateMatchReason(
  uni: typeof UNIVERSITY_DATABASE[0], 
  efcSegment: string, 
  satScore: number | undefined,
  ieltsScore: number | undefined,
  desiredMajor: string | undefined,
  lang: Lang
): string {
  const t = getT(lang);
  const reasons = [];
  
  if (uni.needBlind && efcSegment === 'low') {
    reasons.push(t.needBlindMatch);
  }
  if (uni.annualCost < 2000) {
    reasons.push(t.freeTuition);
  }
  if (satScore && satScore >= 1450) {
    reasons.push(t.satMatch);
  }
  if (desiredMajor && (desiredMajor === 'cs' || desiredMajor === 'engineering')) {
    if (uni.name.includes('MIT') || uni.name.includes('ETH') || uni.name.includes('Stanford')) {
      reasons.push(t.topProgram);
    }
  }
  
  return reasons.length > 0 ? reasons.join('. ') : t.fitsProfile;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: PathRequest = await req.json();
    const { 
      role, efcSegment, targetCountry, currentGrade, mainGoal, 
      targetUniversities, satScore, ieltsScore, englishLevel, deadline, desiredMajor,
      language = 'en'
    } = requestData;

    const lang: Lang = language as Lang;

    console.log("Generating path for:", { role, efcSegment, targetCountry, deadline, desiredMajor, language });

    let milestones: Milestone[] = [];
    let totalParts = 5;

    if (role === 'student') {
      milestones.push(...getFoundationMilestones(targetCountry, desiredMajor || '', efcSegment, lang));
      milestones.push(...getTestPrepMilestones(targetCountry, satScore, ieltsScore, englishLevel, lang));
      milestones.push(...getApplicationMilestones(desiredMajor || '', targetCountry, lang));
      milestones.push(...getFinancialMilestones(efcSegment, targetCountry, lang));
      milestones.push(...getSubmissionMilestones(deadline || 'undecided', lang));
    } else {
      milestones = getParentMilestones(efcSegment, lang);
      totalParts = 3;
    }

    milestones.sort((a, b) => a.order_index - b.order_index);

    const t = getT(lang);
    let efcExplanation = '';
    if (efcSegment === 'low') {
      efcExplanation = t.efcLow;
    } else if (efcSegment === 'medium') {
      efcExplanation = t.efcMedium;
    } else {
      efcExplanation = t.efcHigh;
    }

    const budgetRange = requestData.budgetRange || 'under_10k';
    const universityRecommendations = generateUniversityRecommendations(
      targetCountry, efcSegment, budgetRange, satScore, ieltsScore, desiredMajor, lang
    );

    return new Response(
      JSON.stringify({ 
        milestones,
        efcExplanation,
        efcSegment,
        role,
        totalParts,
        universityRecommendations
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating path:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
