import { PhaseDefinition, RequirementDefinition } from "./types";

type Language = "ru" | "kk" | "en";

interface UserBaseline {
  targetCountry?: string;
  targetMarket?: string;
  exams?: string[];
  goal?: string;
  grade?: string;
  specificGoal?: string;
  academicSnapshot?: {
    sat?: string | number;
    ielts?: string | number;
    gpa?: string | number;
    ent?: string | number;
    toefl?: string | number;
  };
}

// Countries that typically require SAT
const SAT_REQUIRED_COUNTRIES = ["usa", "us", "united states", "сша", "америка"];

// Countries that typically require IELTS/TOEFL
const ENGLISH_TEST_COUNTRIES = [
  "usa", "us", "united states", "сша", "америка",
  "uk", "united kingdom", "великобритания", "англия",
  "canada", "канада",
  "australia", "австралия",
  "new zealand", "новая зеландия",
];

// Countries where ENT is relevant
const ENT_COUNTRIES = ["kazakhstan", "казахстан", "kz"];

// European countries (no SAT, may need language tests)
const EUROPEAN_COUNTRIES = [
  "germany", "германия", "germany", "de",
  "france", "франция", "fr",
  "netherlands", "нидерланды", "nl",
  "spain", "испания", "es",
  "italy", "италия", "it",
  "czech republic", "чехия", "cz",
  "poland", "польша", "pl",
  "austria", "австрия", "at",
  "switzerland", "швейцария", "ch",
];

function normalizeCountry(country?: string): string {
  if (!country) return "";
  return country.toLowerCase().trim();
}

function requiresSAT(baseline: UserBaseline): boolean {
  const country = normalizeCountry(baseline.targetCountry || baseline.targetMarket);
  const goal = (baseline.goal || baseline.specificGoal || "").toLowerCase();
  
  // Check if targeting US/Ivy League
  if (goal.includes("ivy") || goal.includes("лига плюща") || goal.includes("лиги плюща")) {
    return true;
  }
  
  // Check exams list
  if (baseline.exams?.some(e => e.toLowerCase().includes("sat"))) {
    return true;
  }
  
  return SAT_REQUIRED_COUNTRIES.some(c => country.includes(c));
}

function requiresEnglishTest(baseline: UserBaseline): boolean {
  const country = normalizeCountry(baseline.targetCountry || baseline.targetMarket);
  
  // Check exams list
  if (baseline.exams?.some(e => 
    e.toLowerCase().includes("ielts") || 
    e.toLowerCase().includes("toefl")
  )) {
    return true;
  }
  
  return ENGLISH_TEST_COUNTRIES.some(c => country.includes(c));
}

function requiresENT(baseline: UserBaseline): boolean {
  const country = normalizeCountry(baseline.targetCountry || baseline.targetMarket);
  
  // Check exams list
  if (baseline.exams?.some(e => e.toLowerCase().includes("ент") || e.toLowerCase() === "ent")) {
    return true;
  }
  
  return ENT_COUNTRIES.some(c => country.includes(c));
}

function isEuropeanTarget(baseline: UserBaseline): boolean {
  const country = normalizeCountry(baseline.targetCountry || baseline.targetMarket);
  return EUROPEAN_COUNTRIES.some(c => country.includes(c));
}

const translations = {
  ru: {
    // Foundation
    foundationName: "Foundation",
    foundationSubtitle: "Строим базу",
    foundationDesc: "Создание академического фундамента",
    
    // SAT requirements
    satDiagLabel: "SAT диагностика ≥1350",
    satDiagDesc: "Пройдите SAT диагностику и получите ≥1350 баллов",
    satMock3Label: "3 пробных SAT",
    satMock3Desc: "Пройдите минимум 3 полных пробных теста SAT",
    satMock1450Label: "Лучший балл ≥1450",
    satMock1450Desc: "Достигните минимум 1450 баллов в пробном SAT",
    
    // IELTS requirements
    ieltsDiagLabel: "IELTS диагностика ≥6.5",
    ieltsDiagDesc: "Пройдите пробный IELTS и получите ≥6.5 баллов",
    ieltsTarget7Label: "Целевой IELTS ≥7.0",
    ieltsTarget7Desc: "Достигните целевого балла IELTS 7.0+",
    
    // TOEFL requirements
    toeflDiagLabel: "TOEFL диагностика ≥90",
    toeflDiagDesc: "Пройдите пробный TOEFL и получите ≥90 баллов",
    toeflTarget100Label: "Целевой TOEFL ≥100",
    toeflTarget100Desc: "Достигните целевого балла TOEFL 100+",
    
    // ENT requirements
    entDiagLabel: "ЕНТ диагностика ≥100",
    entDiagDesc: "Пройдите пробный ЕНТ и оцените текущий уровень",
    entMock3Label: "3 пробных ЕНТ",
    entMock3Desc: "Пройдите минимум 3 полных пробных теста ЕНТ",
    entTarget120Label: "Целевой ЕНТ ≥120",
    entTarget120Desc: "Достигните целевого балла ЕНТ 120+",
    
    // GPA requirements
    gpaAnalysisLabel: "Анализ GPA",
    gpaAnalysisDesc: "Проанализируйте текущий GPA и определите план улучшения",
    gpaTargetLabel: "Целевой GPA ≥4.0",
    gpaTargetDesc: "Разработайте план достижения GPA 4.0+",
    
    // Project requirements
    projectLabel: "Тема долгосрочного проекта",
    projectDesc: "Выберите и начните работу над долгосрочным проектом",
    
    // Self analysis
    selfAnalysisLabel: "Структурированный самоанализ",
    selfAnalysisDesc: "Проанализируйте свои сильные и слабые стороны",
    
    // Portfolio for European
    portfolioLabel: "Портфолио работ",
    portfolioDesc: "Соберите портфолио академических и творческих работ",
    
    // Motivation letter
    motivationLabel: "Мотивационное письмо",
    motivationDesc: "Подготовьте черновик мотивационного письма",
    
    // Differentiation
    diffName: "Differentiation",
    diffSubtitle: "Выделяемся",
    diffDesc: "Станьте неординарным кандидатом",
    trackLabel: "Выбор направления",
    trackDesc: "Выберите ОДНО направление: Research, Startup, Olympiad, или Social Impact",
    artifactLabel: "Публичный артефакт",
    artifactDesc: "Создайте публично доступный результат",
    metricLabel: "Измеримая метрика",
    metricDesc: "Предоставьте конкретную числовую метрику",
    validationLabel: "Внешняя валидация",
    validationDesc: "Получите подтверждение от ментора или соревнования",
    
    // Proof
    proofName: "Proof",
    proofSubtitle: "Доказываем",
    proofDesc: "Конвертируйте достижения в аргументы",
    rec1Label: "Рекомендатель 1",
    rec1Desc: "Определите первого рекомендателя",
    rec2Label: "Рекомендатель 2",
    rec2Desc: "Определите второго рекомендателя",
    honorsLabel: "Награды и признание",
    honorsDesc: "Загрузите доказательства наград",
    narrativeLabel: "Нарратив одобрен",
    narrativeDesc: "Структура: Кто я → Что я создал → Почему это важно",
    
    // Leverage
    leverageName: "Leverage",
    leverageSubtitle: "Конвертируем",
    leverageDesc: "Превратите профиль в предложения",
    uniListLabel: "Список университетов",
    uniListDesc: "Сформируйте список: Reach / Match / Safety",
    scholarshipLabel: "Стратегия финансирования",
    scholarshipDesc: "Определите стипендии и финансовую стратегию",
    
    // Unlock conditions
    unlockSAT: "SAT диагностика ≥1350 с верифицированным доказательством",
    unlockIELTS: "IELTS ≥7.0 с верифицированным результатом",
    unlockTOEFL: "TOEFL ≥100 с верифицированным результатом",
    unlockENT: "ЕНТ ≥120 с верифицированным результатом",
    unlockProject: "Тема проекта выбрана и работа начата",
    unlockSelfAnalysis: "Структурированный самоанализ заполнен",
    unlockOneProject: "Минимум 1 завершённый проект с измеримым результатом",
    unlockPublicProof: "Публично верифицируемое доказательство",
    unlockRecommenders: "2 подтверждённых рекомендателя",
    unlockNationalAward: "Минимум 1 награда национального уровня",
    unlockAllPhases: "Завершение всех предыдущих фаз",
  },
  kk: {
    // Foundation
    foundationName: "Foundation",
    foundationSubtitle: "Негіз құру",
    foundationDesc: "Академиялық негіз құру",
    
    // SAT requirements
    satDiagLabel: "SAT диагностикасы ≥1350",
    satDiagDesc: "SAT диагностикасынан өтіп, ≥1350 балл алыңыз",
    satMock3Label: "3 сынақ SAT",
    satMock3Desc: "Кемінде 3 толық сынақ SAT тесттерінен өтіңіз",
    satMock1450Label: "Үздік балл ≥1450",
    satMock1450Desc: "Сынақ SAT-та кемінде 1450 балл алыңыз",
    
    // IELTS requirements
    ieltsDiagLabel: "IELTS диагностикасы ≥6.5",
    ieltsDiagDesc: "Сынақ IELTS өтіп, ≥6.5 балл алыңыз",
    ieltsTarget7Label: "Мақсатты IELTS ≥7.0",
    ieltsTarget7Desc: "IELTS 7.0+ мақсатты баллына жетіңіз",
    
    // TOEFL requirements  
    toeflDiagLabel: "TOEFL диагностикасы ≥90",
    toeflDiagDesc: "Сынақ TOEFL өтіп, ≥90 балл алыңыз",
    toeflTarget100Label: "Мақсатты TOEFL ≥100",
    toeflTarget100Desc: "TOEFL 100+ мақсатты баллына жетіңіз",
    
    // ENT requirements
    entDiagLabel: "ҰБТ диагностикасы ≥100",
    entDiagDesc: "Сынақ ҰБТ өтіп, деңгейіңізді бағалаңыз",
    entMock3Label: "3 сынақ ҰБТ",
    entMock3Desc: "Кемінде 3 толық сынақ ҰБТ тесттерінен өтіңіз",
    entTarget120Label: "Мақсатты ҰБТ ≥120",
    entTarget120Desc: "ҰБТ 120+ мақсатты баллына жетіңіз",
    
    // GPA requirements
    gpaAnalysisLabel: "GPA талдауы",
    gpaAnalysisDesc: "Ағымдағы GPA талдап, жақсарту жоспарын жасаңыз",
    gpaTargetLabel: "Мақсатты GPA ≥4.0",
    gpaTargetDesc: "GPA 4.0+ жету жоспарын жасаңыз",
    
    // Project requirements
    projectLabel: "Ұзақ мерзімді жоба тақырыбы",
    projectDesc: "Ұзақ мерзімді жобаны таңдап, жұмысты бастаңыз",
    
    // Self analysis
    selfAnalysisLabel: "Құрылымды өзін-өзі талдау",
    selfAnalysisDesc: "Күшті және әлсіз жақтарыңызды талдаңыз",
    
    // Portfolio
    portfolioLabel: "Жұмыстар портфолиосы",
    portfolioDesc: "Академиялық және шығармашылық жұмыстар портфолиосын жинаңыз",
    
    // Motivation letter
    motivationLabel: "Мотивациялық хат",
    motivationDesc: "Мотивациялық хаттың жобасын дайындаңыз",
    
    // Differentiation
    diffName: "Differentiation",
    diffSubtitle: "Ерекшелену",
    diffDesc: "Ерекше үміткер болыңыз",
    trackLabel: "Бағытты таңдау",
    trackDesc: "БІР бағытты таңдаңыз: Research, Startup, Olympiad, немесе Social Impact",
    artifactLabel: "Жария артефакт",
    artifactDesc: "Жария қол жетімді нәтиже жасаңыз",
    metricLabel: "Өлшенетін метрика",
    metricDesc: "Нақты сандық метрика ұсыныңыз",
    validationLabel: "Сыртқы растау",
    validationDesc: "Тәлімгерден немесе жарыстан растау алыңыз",
    
    // Proof
    proofName: "Proof",
    proofSubtitle: "Дәлелдеу",
    proofDesc: "Жетістіктерді дәлелдерге айналдырыңыз",
    rec1Label: "1-ші ұсынушы",
    rec1Desc: "Бірінші ұсынушыны анықтаңыз",
    rec2Label: "2-ші ұсынушы",
    rec2Desc: "Екінші ұсынушыны анықтаңыз",
    honorsLabel: "Марапаттар",
    honorsDesc: "Марапаттар дәлелдерін жүктеңіз",
    narrativeLabel: "Нарратив мақұлданды",
    narrativeDesc: "Құрылым: Мен кіммін → Не жасадым → Неге маңызды",
    
    // Leverage
    leverageName: "Leverage",
    leverageSubtitle: "Түрлендіру",
    leverageDesc: "Профильді ұсыныстарға айналдырыңыз",
    uniListLabel: "Университеттер тізімі",
    uniListDesc: "Тізімді құрыңыз: Reach / Match / Safety",
    scholarshipLabel: "Қаржыландыру стратегиясы",
    scholarshipDesc: "Стипендиялар мен қаржы стратегиясын анықтаңыз",
    
    // Unlock conditions
    unlockSAT: "SAT диагностикасы ≥1350 расталған дәлелмен",
    unlockIELTS: "IELTS ≥7.0 расталған нәтижемен",
    unlockTOEFL: "TOEFL ≥100 расталған нәтижемен",
    unlockENT: "ҰБТ ≥120 расталған нәтижемен",
    unlockProject: "Жоба тақырыбы таңдалды және жұмыс басталды",
    unlockSelfAnalysis: "Құрылымды өзін-өзі талдау толтырылды",
    unlockOneProject: "Кемінде 1 аяқталған жоба өлшенетін нәтижемен",
    unlockPublicProof: "Жария тексерілетін дәлел",
    unlockRecommenders: "2 расталған ұсынушы",
    unlockNationalAward: "Кемінде 1 ұлттық деңгейдегі марапат",
    unlockAllPhases: "Барлық алдыңғы фазаларды аяқтау",
  },
  en: {
    // Foundation
    foundationName: "Foundation",
    foundationSubtitle: "Building the base",
    foundationDesc: "Creating academic foundation",
    
    // SAT requirements
    satDiagLabel: "SAT Diagnostic ≥1350",
    satDiagDesc: "Complete SAT diagnostic and achieve ≥1350",
    satMock3Label: "3 SAT Practice Tests",
    satMock3Desc: "Complete at least 3 full SAT practice tests",
    satMock1450Label: "Best Score ≥1450",
    satMock1450Desc: "Achieve at least 1450 on a practice SAT",
    
    // IELTS requirements
    ieltsDiagLabel: "IELTS Diagnostic ≥6.5",
    ieltsDiagDesc: "Complete practice IELTS and achieve ≥6.5",
    ieltsTarget7Label: "Target IELTS ≥7.0",
    ieltsTarget7Desc: "Achieve target IELTS score of 7.0+",
    
    // TOEFL requirements
    toeflDiagLabel: "TOEFL Diagnostic ≥90",
    toeflDiagDesc: "Complete practice TOEFL and achieve ≥90",
    toeflTarget100Label: "Target TOEFL ≥100",
    toeflTarget100Desc: "Achieve target TOEFL score of 100+",
    
    // ENT requirements
    entDiagLabel: "ENT Diagnostic ≥100",
    entDiagDesc: "Complete practice ENT and assess your level",
    entMock3Label: "3 ENT Practice Tests",
    entMock3Desc: "Complete at least 3 full ENT practice tests",
    entTarget120Label: "Target ENT ≥120",
    entTarget120Desc: "Achieve target ENT score of 120+",
    
    // GPA requirements
    gpaAnalysisLabel: "GPA Analysis",
    gpaAnalysisDesc: "Analyze current GPA and create improvement plan",
    gpaTargetLabel: "Target GPA ≥4.0",
    gpaTargetDesc: "Create a plan to achieve GPA 4.0+",
    
    // Project requirements
    projectLabel: "Long-term Project Topic",
    projectDesc: "Choose and start working on a long-term project",
    
    // Self analysis
    selfAnalysisLabel: "Structured Self-Analysis",
    selfAnalysisDesc: "Analyze your strengths and weaknesses",
    
    // Portfolio
    portfolioLabel: "Work Portfolio",
    portfolioDesc: "Collect portfolio of academic and creative works",
    
    // Motivation letter
    motivationLabel: "Motivation Letter",
    motivationDesc: "Prepare motivation letter draft",
    
    // Differentiation
    diffName: "Differentiation",
    diffSubtitle: "Stand Out",
    diffDesc: "Become an extraordinary candidate",
    trackLabel: "Track Selection",
    trackDesc: "Choose ONE track: Research, Startup, Olympiad, or Social Impact",
    artifactLabel: "Public Artifact",
    artifactDesc: "Create publicly accessible result",
    metricLabel: "Measurable Metric",
    metricDesc: "Provide specific numerical metric",
    validationLabel: "External Validation",
    validationDesc: "Get confirmation from mentor or competition",
    
    // Proof
    proofName: "Proof",
    proofSubtitle: "Prove It",
    proofDesc: "Convert achievements into arguments",
    rec1Label: "Recommender 1",
    rec1Desc: "Identify first recommender",
    rec2Label: "Recommender 2",
    rec2Desc: "Identify second recommender",
    honorsLabel: "Honors & Recognition",
    honorsDesc: "Upload proof of awards",
    narrativeLabel: "Narrative Approved",
    narrativeDesc: "Structure: Who I am → What I built → Why it matters",
    
    // Leverage
    leverageName: "Leverage",
    leverageSubtitle: "Convert",
    leverageDesc: "Turn profile into offers",
    uniListLabel: "University List",
    uniListDesc: "Build list: Reach / Match / Safety",
    scholarshipLabel: "Funding Strategy",
    scholarshipDesc: "Identify scholarships and financial strategy",
    
    // Unlock conditions
    unlockSAT: "SAT diagnostic ≥1350 with verified proof",
    unlockIELTS: "IELTS ≥7.0 with verified result",
    unlockTOEFL: "TOEFL ≥100 with verified result",
    unlockENT: "ENT ≥120 with verified result",
    unlockProject: "Project topic selected and work started",
    unlockSelfAnalysis: "Structured self-analysis completed",
    unlockOneProject: "At least 1 completed project with measurable result",
    unlockPublicProof: "Publicly verifiable proof",
    unlockRecommenders: "2 confirmed recommenders",
    unlockNationalAward: "At least 1 national level award",
    unlockAllPhases: "Completion of all previous phases",
  },
};

export function getAdaptivePhaseDefinitions(
  language: Language,
  baseline: UserBaseline
): PhaseDefinition[] {
  const t = translations[language];
  
  // Build Foundation requirements based on user baseline
  const foundationRequirements: RequirementDefinition[] = [];
  const foundationUnlockConditions: string[] = [];
  
  // SAT requirements (only for US-targeted students)
  if (requiresSAT(baseline)) {
    foundationRequirements.push(
      {
        key: "sat_diagnostic_1350",
        label: t.satDiagLabel,
        description: t.satDiagDesc,
        submissionType: "sat_diagnostic",
        fields: [
          { name: "score", label: "Score", type: "number", required: true, validation: { min: 400, max: 1600 } },
          { name: "proofType", label: "Source", type: "select", required: true, options: [
            { value: "bluebook", label: "College Board Bluebook" },
            { value: "khan", label: "Khan Academy" },
          ]},
          { name: "proofLink", label: "Proof Link", type: "url", required: true },
        ],
      },
      {
        key: "mock_sat_3x",
        label: t.satMock3Label,
        description: t.satMock3Desc,
        submissionType: "mock_sat_completion",
        fields: [
          { name: "attemptCount", label: "Attempts", type: "number", required: true, validation: { min: 3 } },
          { name: "bestScore", label: "Best Score", type: "number", required: true },
          { name: "proofLinks", label: "Proof Links", type: "textarea", required: true },
        ],
      },
      {
        key: "mock_sat_1450",
        label: t.satMock1450Label,
        description: t.satMock1450Desc,
        submissionType: "mock_sat_completion",
        fields: [],
      }
    );
    foundationUnlockConditions.push(t.unlockSAT);
  }
  
  // IELTS/TOEFL requirements
  if (requiresEnglishTest(baseline)) {
    const hasIelts = baseline.exams?.some(e => e.toLowerCase().includes("ielts"));
    const hasToefl = baseline.exams?.some(e => e.toLowerCase().includes("toefl"));
    
    if (hasIelts || (!hasToefl && requiresEnglishTest(baseline))) {
      foundationRequirements.push(
        {
          key: "ielts_diagnostic",
          label: t.ieltsDiagLabel,
          description: t.ieltsDiagDesc,
          submissionType: "ielts_diagnostic",
          fields: [
            { name: "score", label: "Score", type: "number", required: true, validation: { min: 1, max: 9 } },
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        },
        {
          key: "ielts_target_7",
          label: t.ieltsTarget7Label,
          description: t.ieltsTarget7Desc,
          submissionType: "ielts_completion",
          fields: [
            { name: "score", label: "Score", type: "number", required: true, validation: { min: 7 } },
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        }
      );
      foundationUnlockConditions.push(t.unlockIELTS);
    }
    
    if (hasToefl) {
      foundationRequirements.push(
        {
          key: "toefl_diagnostic",
          label: t.toeflDiagLabel,
          description: t.toeflDiagDesc,
          submissionType: "toefl_diagnostic",
          fields: [
            { name: "score", label: "Score", type: "number", required: true, validation: { min: 0, max: 120 } },
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        },
        {
          key: "toefl_target_100",
          label: t.toeflTarget100Label,
          description: t.toeflTarget100Desc,
          submissionType: "toefl_completion",
          fields: [
            { name: "score", label: "Score", type: "number", required: true, validation: { min: 100 } },
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        }
      );
      foundationUnlockConditions.push(t.unlockTOEFL);
    }
  }
  
  // ENT requirements (for Kazakhstan local universities)
  if (requiresENT(baseline)) {
    foundationRequirements.push(
      {
        key: "ent_diagnostic",
        label: t.entDiagLabel,
        description: t.entDiagDesc,
        submissionType: "ent_diagnostic",
        fields: [
          { name: "score", label: "Score", type: "number", required: true, validation: { min: 0, max: 140 } },
          { name: "proofLink", label: "Proof Link", type: "url", required: true },
        ],
      },
      {
        key: "ent_mock_3x",
        label: t.entMock3Label,
        description: t.entMock3Desc,
        submissionType: "ent_completion",
        fields: [
          { name: "attemptCount", label: "Attempts", type: "number", required: true, validation: { min: 3 } },
          { name: "bestScore", label: "Best Score", type: "number", required: true },
        ],
      },
      {
        key: "ent_target_120",
        label: t.entTarget120Label,
        description: t.entTarget120Desc,
        submissionType: "ent_completion",
        fields: [
          { name: "score", label: "Score", type: "number", required: true, validation: { min: 120 } },
          { name: "proofLink", label: "Proof Link", type: "url", required: true },
        ],
      }
    );
    foundationUnlockConditions.push(t.unlockENT);
  }
  
  // European-specific requirements
  if (isEuropeanTarget(baseline)) {
    foundationRequirements.push(
      {
        key: "portfolio",
        label: t.portfolioLabel,
        description: t.portfolioDesc,
        submissionType: "portfolio",
        fields: [
          { name: "portfolioLink", label: "Portfolio Link", type: "url", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
        ],
      },
      {
        key: "motivation_letter",
        label: t.motivationLabel,
        description: t.motivationDesc,
        submissionType: "motivation_letter",
        fields: [
          { name: "letterLink", label: "Letter Link", type: "url", required: true },
        ],
      }
    );
  }
  
  // Always include project and self-analysis
  foundationRequirements.push(
    {
      key: "project_topic",
      label: t.projectLabel,
      description: t.projectDesc,
      submissionType: "project_topic",
      fields: [
        { name: "topicName", label: "Project Name", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        { name: "proofLink", label: "Project Link", type: "url", required: true },
      ],
    },
    {
      key: "gpa_analysis",
      label: t.gpaAnalysisLabel,
      description: t.gpaAnalysisDesc,
      submissionType: "gpa_analysis",
      fields: [
        { name: "currentGPA", label: "Current GPA", type: "text", required: true },
        { name: "targetGPA", label: "Target GPA", type: "text", required: true },
        { name: "improvementPlan", label: "Improvement Plan", type: "textarea", required: true },
      ],
    },
    {
      key: "self_analysis",
      label: t.selfAnalysisLabel,
      description: t.selfAnalysisDesc,
      submissionType: "self_analysis",
      fields: [
        { name: "strengths", label: "Strengths", type: "textarea", required: true },
        { name: "weaknesses", label: "Weaknesses", type: "textarea", required: true },
        { name: "improvementPlan", label: "Improvement Plan", type: "textarea", required: true },
      ],
    }
  );
  
  foundationUnlockConditions.push(t.unlockProject, t.unlockSelfAnalysis);
  
  return [
    {
      id: "foundation",
      number: 1,
      name: t.foundationName,
      subtitle: t.foundationSubtitle,
      description: t.foundationDesc,
      color: "from-blue-500 to-indigo-600",
      icon: "foundation",
      requirements: foundationRequirements,
      unlockConditions: foundationUnlockConditions,
    },
    {
      id: "differentiation",
      number: 2,
      name: t.diffName,
      subtitle: t.diffSubtitle,
      description: t.diffDesc,
      color: "from-purple-500 to-pink-600",
      icon: "differentiation",
      requirements: [
        {
          key: "track_selection",
          label: t.trackLabel,
          description: t.trackDesc,
          submissionType: "track_selection",
          fields: [
            { name: "track", label: "Track", type: "select", required: true, options: [
              { value: "research", label: "Research" },
              { value: "startup", label: "Startup" },
              { value: "olympiad", label: "Olympiad" },
              { value: "social_impact", label: "Social Impact" },
            ]},
          ],
        },
        {
          key: "public_artifact",
          label: t.artifactLabel,
          description: t.artifactDesc,
          submissionType: "public_artifact",
          fields: [
            { name: "artifactType", label: "Type", type: "text", required: true },
            { name: "artifactLink", label: "Link", type: "url", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
          ],
        },
        {
          key: "measurable_metric",
          label: t.metricLabel,
          description: t.metricDesc,
          submissionType: "measurable_metric",
          fields: [
            { name: "metricType", label: "Metric Type", type: "text", required: true },
            { name: "metricValue", label: "Value", type: "number", required: true },
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        },
        {
          key: "external_validation",
          label: t.validationLabel,
          description: t.validationDesc,
          submissionType: "external_validation",
          fields: [
            { name: "validationType", label: "Type", type: "select", required: true, options: [
              { value: "mentor", label: "Mentor" },
              { value: "competition", label: "Competition" },
              { value: "users", label: "Users" },
            ]},
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        },
      ],
      unlockConditions: [t.unlockOneProject, t.unlockPublicProof],
    },
    {
      id: "proof",
      number: 3,
      name: t.proofName,
      subtitle: t.proofSubtitle,
      description: t.proofDesc,
      color: "from-emerald-500 to-teal-600",
      icon: "proof",
      requirements: [
        {
          key: "recommender_1",
          label: t.rec1Label,
          description: t.rec1Desc,
          submissionType: "recommender_identification",
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "role", label: "Role", type: "text", required: true },
            { name: "affiliation", label: "Organization", type: "text", required: true },
          ],
        },
        {
          key: "recommender_2",
          label: t.rec2Label,
          description: t.rec2Desc,
          submissionType: "recommender_identification",
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "role", label: "Role", type: "text", required: true },
            { name: "affiliation", label: "Organization", type: "text", required: true },
          ],
        },
        {
          key: "honors_recognition",
          label: t.honorsLabel,
          description: t.honorsDesc,
          submissionType: "honors_recognition",
          fields: [
            { name: "honorName", label: "Award Name", type: "text", required: true },
            { name: "level", label: "Level", type: "select", required: true, options: [
              { value: "school", label: "School" },
              { value: "regional", label: "Regional" },
              { value: "national", label: "National" },
              { value: "international", label: "International" },
            ]},
            { name: "proofLink", label: "Proof Link", type: "url", required: true },
          ],
        },
        {
          key: "narrative_approved",
          label: t.narrativeLabel,
          description: t.narrativeDesc,
          submissionType: "narrative_structure",
          fields: [
            { name: "whoIAm", label: "Who I Am", type: "textarea", required: true },
            { name: "whatIBuilt", label: "What I Built", type: "textarea", required: true },
            { name: "whyItMatters", label: "Why It Matters", type: "textarea", required: true },
          ],
        },
      ],
      unlockConditions: [t.unlockRecommenders, t.unlockNationalAward],
    },
    {
      id: "leverage",
      number: 4,
      name: t.leverageName,
      subtitle: t.leverageSubtitle,
      description: t.leverageDesc,
      color: "from-amber-500 to-orange-600",
      icon: "leverage",
      requirements: [
        {
          key: "university_list",
          label: t.uniListLabel,
          description: t.uniListDesc,
          submissionType: "university_list",
          fields: [
            { name: "reachSchools", label: "Reach", type: "textarea", required: true },
            { name: "matchSchools", label: "Match", type: "textarea", required: true },
            { name: "safetySchools", label: "Safety", type: "textarea", required: true },
          ],
        },
        {
          key: "scholarship_strategy",
          label: t.scholarshipLabel,
          description: t.scholarshipDesc,
          submissionType: "scholarship_strategy",
          fields: [
            { name: "scholarships", label: "Target Scholarships", type: "textarea", required: true },
            { name: "aidStrategy", label: "Strategy", type: "textarea", required: true },
          ],
        },
      ],
      unlockConditions: [t.unlockAllPhases],
    },
  ];
}
