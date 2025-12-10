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

// Generate university recommendations
function generateUniversityRecommendations(
  targetCountry: string,
  efcSegment: string,
  satScore?: number,
  desiredMajor?: string
): any[] {
  const recommendations = [];
  
  // Define university pools by criteria
  const needBlindUSA = [
    { name: 'Harvard University', country: 'USA', matchScore: 95, needBlind: true, scholarshipType: 'Need-blind Full Aid' },
    { name: 'MIT', country: 'USA', matchScore: 93, needBlind: true, scholarshipType: 'Need-blind Full Aid' },
    { name: 'Yale University', country: 'USA', matchScore: 92, needBlind: true, scholarshipType: 'Need-blind Full Aid' },
    { name: 'Princeton University', country: 'USA', matchScore: 91, needBlind: true, scholarshipType: 'Need-blind Full Aid' },
    { name: 'Amherst College', country: 'USA', matchScore: 88, needBlind: true, scholarshipType: 'Need-blind Full Aid' },
  ];

  const topUSA = [
    { name: 'Stanford University', country: 'USA', matchScore: 90, needBlind: false, scholarshipType: 'Merit + Need-based' },
    { name: 'Columbia University', country: 'USA', matchScore: 87, needBlind: false, scholarshipType: 'Merit + Need-based' },
    { name: 'UPenn', country: 'USA', matchScore: 85, needBlind: false, scholarshipType: 'Merit + Need-based' },
  ];

  const europeOptions = [
    { name: 'ETH Zurich', country: 'Switzerland', matchScore: 92, needBlind: false, scholarshipType: 'Low Tuition + Excellence Scholarship' },
    { name: 'TU Munich', country: 'Germany', matchScore: 88, needBlind: false, scholarshipType: 'Free Tuition' },
    { name: 'University of Amsterdam', country: 'Netherlands', matchScore: 85, needBlind: false, scholarshipType: 'Holland Scholarship' },
  ];

  const ukOptions = [
    { name: 'Oxford University', country: 'UK', matchScore: 94, needBlind: false, scholarshipType: 'Reach Oxford + Rhodes' },
    { name: 'Cambridge University', country: 'UK', matchScore: 93, needBlind: false, scholarshipType: 'Cambridge Trust' },
    { name: 'Imperial College London', country: 'UK', matchScore: 89, needBlind: false, scholarshipType: 'President\'s Scholarship' },
  ];

  // Select based on criteria
  if (efcSegment === 'low' && (targetCountry === 'usa' || !targetCountry)) {
    recommendations.push(...needBlindUSA.slice(0, 3));
    recommendations.push(...europeOptions.filter(u => u.scholarshipType.includes('Free')).slice(0, 2));
  } else if (targetCountry === 'usa') {
    recommendations.push(...topUSA.slice(0, 3));
    if (satScore && satScore >= 1500) {
      recommendations.push(...needBlindUSA.slice(0, 2));
    }
  } else if (targetCountry === 'uk') {
    recommendations.push(...ukOptions.slice(0, 3));
  } else if (targetCountry === 'eu') {
    recommendations.push(...europeOptions);
  } else {
    // Mix of everything
    recommendations.push(needBlindUSA[0], ukOptions[0], europeOptions[0]);
  }

  // Adjust match scores based on SAT
  return recommendations.map(uni => ({
    ...uni,
    matchScore: satScore && satScore >= 1450 ? Math.min(100, uni.matchScore + 5) : uni.matchScore,
    reason: generateMatchReason(uni, efcSegment, satScore, desiredMajor)
  })).slice(0, 5);
}

function generateMatchReason(uni: any, efcSegment: string, satScore?: number, desiredMajor?: string): string {
  const reasons = [];
  
  if (uni.needBlind && efcSegment === 'low') {
    reasons.push('Need-blind для иностранцев');
  }
  if (uni.scholarshipType.includes('Free')) {
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
    const universityRecommendations = generateUniversityRecommendations(
      targetCountry, efcSegment, satScore, desiredMajor
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
