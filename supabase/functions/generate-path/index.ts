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

// Calculate deadline months remaining
function getMonthsUntilDeadline(deadline: string): number {
  const now = new Date();
  const deadlineMap: Record<string, Date> = {
    '2025_fall': new Date(2025, 8, 1), // September 2025
    '2026_fall': new Date(2026, 8, 1),
    '2027_fall': new Date(2027, 8, 1),
    'undecided': new Date(2026, 8, 1), // Default to next year
  };
  const targetDate = deadlineMap[deadline] || deadlineMap['undecided'];
  const months = (targetDate.getFullYear() - now.getFullYear()) * 12 + (targetDate.getMonth() - now.getMonth());
  return Math.max(1, months);
}

// Part 1: Foundation & Research (Month 1-3)
function getFoundationMilestones(targetCountry: string, desiredMajor: string, efcSegment: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Исследование программ по специальности",
      description: `Изучи требования и особенности программ по ${desiredMajor || 'выбранной специальности'} в целевых странах`,
      category: "general",
      priority: "high",
      order_index: 1,
      efc_specific: false,
      metadata: { major: desiredMajor },
      part: 1
    },
    {
      title: "Составить список целевых университетов",
      description: "Выбери 8-12 университетов: 3-4 reach, 4-5 target, 2-3 safety",
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
      title: "Составить список Need-Blind университетов",
      description: "Harvard, Yale, MIT, Princeton, Amherst не учитывают финансы при приёме иностранцев",
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
function getTestPrepMilestones(targetCountry: string, satScore?: number, ieltsScore?: number, englishLevel?: string): Milestone[] {
  const milestones: Milestone[] = [];
  let orderIndex = 10;

  // SAT preparation based on current score
  if (targetCountry === 'usa' || targetCountry === 'canada') {
    if (!satScore || satScore < 1400) {
      milestones.push({
        title: satScore ? `Улучшить SAT с ${satScore} до 1450+` : "Подготовиться к SAT",
        description: satScore && satScore >= 1200 
          ? "Фокус на слабых секциях. Цель: 1450+ для топовых университетов"
          : "Начни с диагностического теста, затем систематическая подготовка",
        category: "exam",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: false,
        metadata: { currentScore: satScore, targetScore: 1450 },
        part: 2
      });
    }
  }

  // IELTS/English preparation based on level
  const needsEnglishPrep = !ieltsScore || ieltsScore < 7.0 || englishLevel === 'beginner' || englishLevel === 'intermediate';
  
  if (needsEnglishPrep) {
    const targetIELTS = targetCountry === 'uk' ? 7.5 : 7.0;
    milestones.push({
      title: ieltsScore ? `Улучшить IELTS с ${ieltsScore} до ${targetIELTS}+` : `Подготовиться к IELTS (цель: ${targetIELTS}+)`,
      description: englishLevel === 'beginner' 
        ? "Начни с интенсивного курса английского, затем подготовка к тесту"
        : "Фокус на Writing и Speaking для достижения целевого балла",
      category: "exam",
      priority: englishLevel === 'beginner' ? "high" : "medium",
      order_index: orderIndex++,
      efc_specific: false,
      metadata: { currentScore: ieltsScore, targetScore: targetIELTS, level: englishLevel },
      part: 2
    });
  }

  // Country-specific tests
  if (targetCountry === 'uk') {
    milestones.push({
      title: "Подготовка к предметным тестам",
      description: "BMAT для медицины, LNAT для права, MAT/TMUA для математики",
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
function getApplicationMilestones(desiredMajor: string, targetCountry: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Создать Activities List",
      description: "Задокументируй все достижения, проекты и волонтёрство за последние 4 года",
      category: "application",
      priority: "high",
      order_index: 20,
      efc_specific: false,
      metadata: {},
      part: 3
    },
    {
      title: "Написать Personal Statement",
      description: "Главное эссе о твоём уникальном опыте и мотивации",
      category: "essay",
      priority: "high",
      order_index: 21,
      efc_specific: false,
      metadata: {},
      part: 3
    },
    {
      title: "Написать Supplemental Essays",
      description: `Эссе \"Why ${desiredMajor}?\" и \"Why this university?\" для каждого вуза`,
      category: "essay",
      priority: "high",
      order_index: 22,
      efc_specific: false,
      metadata: { major: desiredMajor },
      part: 3
    },
    {
      title: "Выбрать учителей для рекомендаций",
      description: "Попроси 2-3 учителей, которые хорошо тебя знают, написать recommendation letters",
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
      title: "Написать UCAS Personal Statement",
      description: "4000 символов о твоей академической страсти и достижениях в выбранной области",
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

// Part 4: Financial Aid (EFC-specific)
function getFinancialMilestones(efcSegment: string, targetCountry: string): Milestone[] {
  const milestones: Milestone[] = [];
  let orderIndex = 30;

  if (efcSegment === 'low') {
    milestones.push(
      {
        title: "Заполнить CSS Profile",
        description: "Обязательная форма для финансовой помощи в топовых университетах США",
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: "Заполнить FAFSA",
        description: "Федеральная форма США (открывается 1 октября)",
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: "Найти внешние стипендии",
        description: "Bolashak, DAAD, Fulbright, Chevening и другие программы",
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
        title: "Исследовать бесплатное образование",
        description: "Германия, Норвегия, Финляндия — бесплатно даже для иностранцев",
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
        title: "Комбинированная стратегия финансирования",
        description: "Подай на Need-based + Merit-based для оптимального покрытия",
        category: "financial",
        priority: "high",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: "Найти Merit стипендии",
        description: "Многие университеты дают $10-30k/год за академические достижения",
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
        title: "Merit-based стипендии",
        description: "Подавайся на стипендии за академические и внеклассные достижения",
        category: "financial",
        priority: "medium",
        order_index: orderIndex++,
        efc_specific: true,
        metadata: {},
        part: 4
      },
      {
        title: "Рассмотреть Early Decision",
        description: "ED увеличивает шансы на 10-15% в топовых университетах",
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
function getSubmissionMilestones(deadline: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Подать Early Applications",
      description: "Early Decision/Action дедлайны: 1-15 ноября",
      category: "application",
      priority: "high",
      order_index: 40,
      efc_specific: false,
      metadata: { deadline: 'early' },
      part: 5
    },
    {
      title: "Подать Regular Applications",
      description: "Дедлайны: 1-15 января для большинства вузов",
      category: "application",
      priority: "high",
      order_index: 41,
      efc_specific: false,
      metadata: { deadline: 'regular' },
      part: 5
    },
    {
      title: "Отслеживать статус заявок",
      description: "Проверяй порталы, отвечай на запросы приёмных комиссий",
      category: "application",
      priority: "medium",
      order_index: 42,
      efc_specific: false,
      metadata: {},
      part: 5
    },
    {
      title: "Принять решение и подтвердить",
      description: "Выбрать вуз и внести депозит до 1 мая",
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
function getParentMilestones(efcSegment: string): Milestone[] {
  const milestones: Milestone[] = [
    {
      title: "Создать финансовый план",
      description: "Оцените общую стоимость и составьте план покрытия расходов",
      category: "financial",
      priority: "high",
      order_index: 1,
      efc_specific: false,
      metadata: {},
      part: 1
    },
    {
      title: "Настроить календарь дедлайнов",
      description: "Создайте общий календарь с ребёнком со всеми важными датами",
      category: "general",
      priority: "high",
      order_index: 2,
      efc_specific: false,
      metadata: {},
      part: 1
    },
    {
      title: "Подготовить финансовые документы",
      description: "Налоговые декларации, справки о доходах, выписки по активам",
      category: "document",
      priority: "high",
      order_index: 3,
      efc_specific: false,
      metadata: {},
      part: 2
    },
    {
      title: "Еженедельные check-in с ребёнком",
      description: "Обсуждайте прогресс и помогайте с организацией процесса",
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
      title: "Изучить все варианты финансовой помощи",
      description: "Need-based гранты, государственные программы, образовательные кредиты",
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

// Comprehensive university database with realistic data
const UNIVERSITY_DATABASE = [
  // USA - Need-Blind for International Students
  { name: 'Harvard University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: true, annualCost: 80000, scholarshipType: 'Need-blind Full Aid', majors: ['business', 'law', 'medicine', 'cs', 'engineering', 'arts', 'sciences'], ranking: 1 },
  { name: 'Yale University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: true, annualCost: 80000, scholarshipType: 'Need-blind Full Aid', majors: ['business', 'law', 'arts', 'sciences', 'medicine'], ranking: 3 },
  { name: 'Princeton University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1510, minIELTS: 7.0, needBlind: true, annualCost: 77000, scholarshipType: 'Need-blind Full Aid', majors: ['engineering', 'sciences', 'arts', 'economics'], ranking: 2 },
  { name: 'MIT', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1520, minIELTS: 7.0, needBlind: true, annualCost: 79000, scholarshipType: 'Need-blind Full Aid', majors: ['cs', 'engineering', 'sciences', 'business'], ranking: 4 },
  { name: 'Amherst College', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1450, minIELTS: 7.0, needBlind: true, annualCost: 76000, scholarshipType: 'Need-blind Full Aid', majors: ['arts', 'sciences', 'economics'], ranking: 25 },
  
  // USA - Top Universities with Aid
  { name: 'Stanford University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: false, annualCost: 82000, scholarshipType: 'Merit + Need-based', majors: ['cs', 'engineering', 'business', 'sciences'], ranking: 5 },
  { name: 'Columbia University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1480, minIELTS: 7.0, needBlind: false, annualCost: 80000, scholarshipType: 'Need-based Aid', majors: ['business', 'law', 'journalism', 'arts'], ranking: 8 },
  { name: 'University of Chicago', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1500, minIELTS: 7.0, needBlind: false, annualCost: 78000, scholarshipType: 'Merit + Need-based', majors: ['economics', 'sciences', 'law'], ranking: 10 },
  { name: 'Duke University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1470, minIELTS: 7.0, needBlind: false, annualCost: 77000, scholarshipType: 'Need-based Aid', majors: ['medicine', 'business', 'engineering'], ranking: 12 },
  { name: 'Northwestern University', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1450, minIELTS: 7.0, needBlind: false, annualCost: 76000, scholarshipType: 'Merit Scholarships', majors: ['journalism', 'business', 'engineering', 'arts'], ranking: 15 },
  
  // USA - State Universities (affordable)
  { name: 'UCLA', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 45000, scholarshipType: 'Limited Aid', majors: ['cs', 'engineering', 'arts', 'sciences'], ranking: 20 },
  { name: 'UC Berkeley', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 47000, scholarshipType: 'Regents Scholarship', majors: ['cs', 'engineering', 'business', 'sciences'], ranking: 18 },
  { name: 'University of Michigan', country: 'USA', countryCode: 'US', region: 'usa', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 55000, scholarshipType: 'Merit Scholarships', majors: ['business', 'engineering', 'medicine'], ranking: 22 },
  
  // UK - Top Universities
  { name: 'University of Oxford', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1470, minIELTS: 7.0, needBlind: false, annualCost: 45000, scholarshipType: 'Reach Oxford + Rhodes', majors: ['law', 'medicine', 'arts', 'sciences', 'business'], ranking: 1 },
  { name: 'University of Cambridge', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1480, minIELTS: 7.0, needBlind: false, annualCost: 45000, scholarshipType: 'Cambridge Trust', majors: ['sciences', 'engineering', 'medicine', 'arts'], ranking: 2 },
  { name: 'Imperial College London', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 42000, scholarshipType: "President's Scholarship", majors: ['engineering', 'cs', 'sciences', 'medicine'], ranking: 6 },
  { name: 'London School of Economics', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1420, minIELTS: 7.0, needBlind: false, annualCost: 40000, scholarshipType: 'LSE Scholarship', majors: ['economics', 'business', 'law', 'politics'], ranking: 8 },
  { name: 'UCL', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 38000, scholarshipType: 'UCL Global Scholarship', majors: ['arts', 'sciences', 'engineering', 'medicine'], ranking: 9 },
  { name: 'University of Edinburgh', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 32000, scholarshipType: 'Edinburgh Global', majors: ['arts', 'sciences', 'medicine', 'business'], ranking: 15 },
  { name: 'University of Manchester', country: 'UK', countryCode: 'GB', region: 'uk', minSAT: 1300, minIELTS: 6.0, needBlind: false, annualCost: 28000, scholarshipType: 'Global Futures', majors: ['engineering', 'business', 'sciences'], ranking: 25 },
  
  // Canada
  { name: 'University of Toronto', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 50000, scholarshipType: 'Lester B. Pearson', majors: ['cs', 'engineering', 'business', 'medicine'], ranking: 1 },
  { name: 'McGill University', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 45000, scholarshipType: 'McGill Scholarships', majors: ['medicine', 'arts', 'sciences', 'law'], ranking: 2 },
  { name: 'University of British Columbia', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 42000, scholarshipType: 'International Leader', majors: ['cs', 'engineering', 'sciences', 'business'], ranking: 3 },
  { name: 'University of Waterloo', country: 'Canada', countryCode: 'CA', region: 'canada', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 40000, scholarshipType: 'International Excellence', majors: ['cs', 'engineering', 'sciences'], ranking: 5 },
  
  // Europe - Free/Low Tuition
  { name: 'ETH Zurich', country: 'Switzerland', countryCode: 'CH', region: 'eu', minSAT: 1400, minIELTS: 7.0, needBlind: false, annualCost: 1500, scholarshipType: 'Excellence Scholarship', majors: ['engineering', 'cs', 'sciences'], ranking: 6 },
  { name: 'TU Munich', country: 'Germany', countryCode: 'DE', region: 'eu', minSAT: 1300, minIELTS: 6.5, needBlind: false, annualCost: 500, scholarshipType: 'Free Tuition', majors: ['engineering', 'cs', 'sciences'], ranking: 10 },
  { name: 'LMU Munich', country: 'Germany', countryCode: 'DE', region: 'eu', minSAT: 1280, minIELTS: 6.5, needBlind: false, annualCost: 500, scholarshipType: 'Free Tuition', majors: ['medicine', 'sciences', 'arts', 'law'], ranking: 15 },
  { name: 'Heidelberg University', country: 'Germany', countryCode: 'DE', region: 'eu', minSAT: 1280, minIELTS: 6.0, needBlind: false, annualCost: 500, scholarshipType: 'Free Tuition', majors: ['medicine', 'sciences', 'law'], ranking: 20 },
  { name: 'University of Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'eu', minSAT: 1300, minIELTS: 6.5, needBlind: false, annualCost: 15000, scholarshipType: 'Holland Scholarship', majors: ['business', 'economics', 'sciences', 'arts'], ranking: 12 },
  { name: 'Delft University', country: 'Netherlands', countryCode: 'NL', region: 'eu', minSAT: 1320, minIELTS: 6.5, needBlind: false, annualCost: 16000, scholarshipType: 'Justus & Louise', majors: ['engineering', 'cs', 'architecture'], ranking: 15 },
  { name: 'KU Leuven', country: 'Belgium', countryCode: 'BE', region: 'eu', minSAT: 1280, minIELTS: 6.5, needBlind: false, annualCost: 5000, scholarshipType: 'Science@Leuven', majors: ['engineering', 'sciences', 'medicine'], ranking: 18 },
  { name: 'University of Copenhagen', country: 'Denmark', countryCode: 'DK', region: 'eu', minSAT: 1280, minIELTS: 6.5, needBlind: false, annualCost: 0, scholarshipType: 'Free for EU (Others: 15k)', majors: ['sciences', 'medicine', 'arts'], ranking: 20 },
  { name: 'Sorbonne University', country: 'France', countryCode: 'FR', region: 'eu', minSAT: 1280, minIELTS: 6.0, needBlind: false, annualCost: 3000, scholarshipType: 'Eiffel Excellence', majors: ['arts', 'sciences', 'law'], ranking: 22 },
  { name: 'Sciences Po', country: 'France', countryCode: 'FR', region: 'eu', minSAT: 1350, minIELTS: 7.0, needBlind: false, annualCost: 15000, scholarshipType: 'Emile Boutmy', majors: ['politics', 'economics', 'law', 'business'], ranking: 25 },
  
  // Asia
  { name: 'National University of Singapore', country: 'Singapore', countryCode: 'SG', region: 'asia', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 35000, scholarshipType: 'Global Merit', majors: ['cs', 'engineering', 'business', 'sciences'], ranking: 8 },
  { name: 'Nanyang Technological University', country: 'Singapore', countryCode: 'SG', region: 'asia', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 32000, scholarshipType: 'ASEAN Scholarship', majors: ['engineering', 'cs', 'business'], ranking: 12 },
  { name: 'University of Hong Kong', country: 'Hong Kong', countryCode: 'HK', region: 'asia', minSAT: 1380, minIELTS: 6.5, needBlind: false, annualCost: 28000, scholarshipType: 'HKU Foundation', majors: ['business', 'law', 'medicine', 'sciences'], ranking: 15 },
  { name: 'HKUST', country: 'Hong Kong', countryCode: 'HK', region: 'asia', minSAT: 1350, minIELTS: 6.5, needBlind: false, annualCost: 27000, scholarshipType: 'HKUST Scholarship', majors: ['cs', 'engineering', 'business'], ranking: 18 },
  { name: 'Seoul National University', country: 'South Korea', countryCode: 'KR', region: 'asia', minSAT: 1350, minIELTS: 6.0, needBlind: false, annualCost: 8000, scholarshipType: 'Korean Government', majors: ['engineering', 'business', 'sciences', 'arts'], ranking: 20 },
  { name: 'KAIST', country: 'South Korea', countryCode: 'KR', region: 'asia', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 7000, scholarshipType: 'Full Tuition Waiver', majors: ['cs', 'engineering', 'sciences'], ranking: 25 },
  { name: 'University of Tokyo', country: 'Japan', countryCode: 'JP', region: 'asia', minSAT: 1400, minIELTS: 6.5, needBlind: false, annualCost: 5000, scholarshipType: 'MEXT Scholarship', majors: ['engineering', 'sciences', 'medicine'], ranking: 10 },
  
  // CIS/Eastern Europe
  { name: 'Nazarbayev University', country: 'Kazakhstan', countryCode: 'KZ', region: 'cis', minSAT: 1200, minIELTS: 6.0, needBlind: false, annualCost: 0, scholarshipType: 'Full Scholarship', majors: ['engineering', 'cs', 'business', 'sciences'], ranking: 1 },
  { name: 'KIMEP University', country: 'Kazakhstan', countryCode: 'KZ', region: 'cis', minSAT: 1100, minIELTS: 5.5, needBlind: false, annualCost: 8000, scholarshipType: 'Merit Scholarship', majors: ['business', 'economics', 'law'], ranking: 3 },
  { name: 'Charles University', country: 'Czech Republic', countryCode: 'CZ', region: 'eu', minSAT: 1200, minIELTS: 6.0, needBlind: false, annualCost: 5000, scholarshipType: 'Czech Government', majors: ['medicine', 'sciences', 'law'], ranking: 30 },
  { name: 'Jagiellonian University', country: 'Poland', countryCode: 'PL', region: 'eu', minSAT: 1200, minIELTS: 6.0, needBlind: false, annualCost: 4000, scholarshipType: 'Polish Government', majors: ['medicine', 'sciences', 'arts'], ranking: 35 },
];

// Calculate match score based on user profile
function calculateMatchScore(
  uni: typeof UNIVERSITY_DATABASE[0],
  satScore: number | undefined,
  ieltsScore: number | undefined,
  efcSegment: string,
  budgetRange: string,
  desiredMajor: string | undefined
): number {
  let score = 70; // Base score
  
  // SAT Score match (up to +15 points)
  if (satScore) {
    if (satScore >= uni.minSAT + 100) score += 15;
    else if (satScore >= uni.minSAT) score += 10;
    else if (satScore >= uni.minSAT - 100) score += 5;
    else score -= 10;
  }
  
  // IELTS Score match (up to +10 points)
  if (ieltsScore) {
    if (ieltsScore >= uni.minIELTS + 0.5) score += 10;
    else if (ieltsScore >= uni.minIELTS) score += 5;
    else score -= 5;
  }
  
  // Financial fit (up to +10 points)
  const budgetMap: Record<string, number> = {
    'under_10k': 10000,
    '10k_30k': 30000,
    '30k_50k': 50000,
    'over_50k': 100000,
  };
  const userBudget = budgetMap[budgetRange] || 30000;
  
  if (efcSegment === 'low' && uni.needBlind) {
    score += 10; // Perfect for low EFC
  } else if (uni.annualCost <= userBudget) {
    score += 8;
  } else if (uni.annualCost <= userBudget * 1.5) {
    score += 3;
  } else {
    score -= 5;
  }
  
  // Major match (up to +5 points)
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
  satScore?: number,
  ieltsScore?: number,
  desiredMajor?: string
): any[] {
  // Filter universities by region if specified
  let candidates = UNIVERSITY_DATABASE;
  
  const regionMap: Record<string, string[]> = {
    'usa': ['usa'],
    'canada': ['canada'],
    'uk': ['uk'],
    'eu': ['eu'],
    'asia': ['asia'],
    'cis': ['cis'],
    'all': ['usa', 'canada', 'uk', 'eu', 'asia', 'cis'],
  };
  
  const targetRegions = regionMap[targetCountry] || regionMap['all'];
  candidates = candidates.filter(u => targetRegions.includes(u.region));
  
  // For low EFC, prioritize need-blind and affordable options
  if (efcSegment === 'low') {
    candidates.sort((a, b) => {
      // Need-blind universities first
      if (a.needBlind && !b.needBlind) return -1;
      if (!a.needBlind && b.needBlind) return 1;
      // Then by cost
      return a.annualCost - b.annualCost;
    });
  }
  
  // Calculate match scores and sort
  const recommendations = candidates.map(uni => ({
    name: uni.name,
    country: uni.country,
    countryCode: uni.countryCode,
    matchScore: calculateMatchScore(uni, satScore, ieltsScore, efcSegment, budgetRange, desiredMajor),
    scholarshipType: uni.scholarshipType,
    needBlind: uni.needBlind,
    annualCost: uni.annualCost,
    reason: generateMatchReason(uni, efcSegment, satScore, ieltsScore, desiredMajor),
  }));
  
  // Sort by match score and take top 8
  recommendations.sort((a, b) => b.matchScore - a.matchScore);
  
  return recommendations.slice(0, 8);
}

function generateMatchReason(
  uni: typeof UNIVERSITY_DATABASE[0], 
  efcSegment: string, 
  satScore?: number,
  ieltsScore?: number,
  desiredMajor?: string
): string {
  const reasons = [];
  
  if (uni.needBlind && efcSegment === 'low') {
    reasons.push('Need-blind для иностранцев');
  }
  if (uni.annualCost < 2000) {
    reasons.push('Бесплатное обучение');
  }
  if (satScore && satScore >= 1450) {
    reasons.push('Твой SAT соответствует требованиям');
  }
  if (desiredMajor && (desiredMajor === 'cs' || desiredMajor === 'engineering')) {
    if (uni.name.includes('MIT') || uni.name.includes('ETH') || uni.name.includes('Stanford')) {
      reasons.push('Топ-программа по твоей специальности');
    }
  }
  
  return reasons.length > 0 ? reasons.join('. ') : 'Подходит под твой профиль';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: PathRequest = await req.json();
    const { 
      role, efcSegment, targetCountry, currentGrade, mainGoal, 
      targetUniversities, satScore, ieltsScore, englishLevel, deadline, desiredMajor 
    } = requestData;

    console.log("Generating path for:", { role, efcSegment, targetCountry, deadline, desiredMajor });

    let milestones: Milestone[] = [];
    let totalParts = 5;

    if (role === 'student') {
      // Part 1: Foundation
      milestones.push(...getFoundationMilestones(targetCountry, desiredMajor || '', efcSegment));
      
      // Part 2: Test Prep
      milestones.push(...getTestPrepMilestones(targetCountry, satScore, ieltsScore, englishLevel));
      
      // Part 3: Application Materials
      milestones.push(...getApplicationMilestones(desiredMajor || '', targetCountry));
      
      // Part 4: Financial
      milestones.push(...getFinancialMilestones(efcSegment, targetCountry));
      
      // Part 5: Submission
      milestones.push(...getSubmissionMilestones(deadline || 'undecided'));
      
    } else {
      // Parent path
      milestones = getParentMilestones(efcSegment);
      totalParts = 3;
    }

    // Sort by order_index
    milestones.sort((a, b) => a.order_index - b.order_index);

    // Generate EFC explanation
    let efcExplanation = '';
    if (efcSegment === 'low') {
      efcExplanation = `План оптимизирован под максимальные стипендии. Фокус на Need-Blind университетах, которые не учитывают финансовое положение при приёме.`;
    } else if (efcSegment === 'medium') {
      efcExplanation = `Комбинированная стратегия: Need-based + Merit-based стипендии для оптимального покрытия стоимости обучения.`;
    } else {
      efcExplanation = `Фокус на Merit-based стипендиях и Early Decision стратегии для повышения шансов в топовых программах.`;
    }

    // Generate university recommendations
    const budgetRange = requestData.budgetRange || 'under_10k';
    const universityRecommendations = generateUniversityRecommendations(
      targetCountry, efcSegment, budgetRange, satScore, ieltsScore, desiredMajor
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
