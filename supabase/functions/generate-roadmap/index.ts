import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoadmapInput {
  gpa: number;
  satScore?: number;
  ieltsScore?: number;
  currentGrade: string;
  desiredMajor: string;
  targetCountry: string;
  mainGoal: string;
  language: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gpa, satScore, ieltsScore, currentGrade, desiredMajor, targetCountry, mainGoal, language } = await req.json() as RoadmapInput;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const languagePrompt = language === 'ru' ? 'Russian' : language === 'kk' ? 'Kazakh' : 'English';

    const systemPrompt = `You are a hyper-detailed university admissions counselor. Your task is to generate an EXTREMELY DETAILED, month-by-month roadmap with ACTIONABLE, SPECIFIC tasks.

CRITICAL RULES - EVERY TASK MUST:
1. Be a SELF-CONTAINED action paragraph with MINIMUM 3-4 sentences
2. Include an ACTION VERB: What to do (Study, Write, Submit, Research, Complete, Register, etc.)
3. Include SPECIFIC RESOURCES: Exact websites, books, platforms (e.g., "DAAD.de", "Common App", "Khan Academy SAT Prep", "Cambridge IELTS 18")
4. Include MEASURABLE OUTCOMES: What will be achieved (e.g., "determine if GPA meets requirements", "complete 5 practice essays", "achieve 7.5+ on practice test")
5. Include DEADLINES when applicable
6. NEVER use vague phrases like "study better", "prepare more", "research universities"

EXAMPLE OF BAD TASK (DO NOT DO THIS):
- Title: "GPA Assessment"
- Description: "Check your GPA"

EXAMPLE OF EXCELLENT TASK (DO THIS):
- Title: "Оценка текущего GPA и его соответствие требованиям"
- Description: "Проверить, как текущий средний балл (GPA ${gpa}) конвертируется в немецкую систему оценок (Numerus Clausus) и соответствует ли он средним проходным баллам выбранных программ. Использовать официальный конвертер на сайте anabin.kmk.org для перевода оценок. Создать таблицу сравнения: ваш GPA vs. средний проходной балл для ${desiredMajor} в ТОП-5 университетах ${targetCountry}."

ANOTHER EXCELLENT EXAMPLE:
- Title: "Исследование требований к поступлению в ВУЗы ${targetCountry}"
- Description: "Изучить сайты DAAD (Немецкой службы академических обменов), университетов, которые предлагают программы по ${desiredMajor}. Определить общие требования к аттестату, языковым сертификатам (TOEFL/IELTS, TestDaF/DSH), возможным вступительным экзаменам. Составить чек-лист из минимум 10 пунктов с конкретными требованиями каждого университета и их дедлайнами."

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks.

The roadmap should:
1. Start from ${currentMonth} ${currentYear}
2. Include 8-12 months of detailed planning
3. Each month should have 4-6 HYPER-SPECIFIC tasks with LONG descriptions (3-5 sentences each)
4. Every task description must be a COMPLETE action plan, not just a title expansion
5. Adapt tasks to the student's target country requirements
6. For ${targetCountry} specifically include: required exams, language certificates, specific universities, scholarship programs
7. Make each task description so detailed that a student can follow it WITHOUT additional guidance

Generate all content in ${languagePrompt}.

Return ONLY JSON:
{
  "months": [
    {
      "month": "Month Year",
      "monthIndex": 0,
      "theme": "Short theme (2-4 words)",
      "tasks": [
        {
          "title": "Clear action-oriented title (5-12 words)",
          "description": "DETAILED paragraph with: 1) Exact action steps, 2) Specific resources/websites/books, 3) Measurable outcomes, 4) Why this matters. MINIMUM 3-4 sentences, ideally 5-6 sentences.",
          "category": "academic|test|extracurricular|essay|recommendation|application",
          "xpReward": 15-30 (based on task complexity)
        }
      ]
    }
  ]
}`;

    const isMasters = currentGrade.includes("Bachelor") || currentGrade.includes("Master");
    const isPhD = currentGrade.includes("Master");

    const userPrompt = `Student Profile:
- Current GPA: ${gpa}/4.0
- ${isMasters ? 'GRE/GMAT Score' : 'SAT Score'}: ${satScore || 'Not taken yet'}
- IELTS/TOEFL Score: ${ieltsScore || 'Not taken yet'}  
- Current Level: ${currentGrade}
- Desired Major/Field: ${desiredMajor}
- Target Country: ${targetCountry}
- Main Goal: ${mainGoal}

Generate a HYPER-DETAILED month-by-month roadmap starting from ${currentMonth} ${currentYear}.

${isMasters ? `
GRADUATE SCHOOL SPECIFIC REQUIREMENTS:
1. For Master's/PhD applications, include:
   - GRE General Test preparation (target scores for ${desiredMajor} programs)
   - GRE Subject Test if applicable (Math, Physics, CS, etc.)
   - GMAT for business programs (target 700+ for top schools)
   - Statement of Purpose writing and revision timeline
   - Research proposal preparation (for PhD/research masters)
   - CV/Resume optimization for academic applications
   - Securing strong Letters of Recommendation (3 academic/professional)
   - Contacting potential advisors/PIs (with email templates)
   - Research experience opportunities
   - Publications and conference presentations

2. Top Graduate Programs to consider for ${desiredMajor}:
   - USA: MIT, Stanford, Berkeley, CMU, Harvard, Princeton
   - UK: Oxford, Cambridge, Imperial, LSE, UCL
   - Europe: ETH Zurich, EPFL, TU Munich, KU Leuven
   
3. Funding and Scholarships for Graduate Studies:
   - Fulbright Program (deadline usually Oct)
   - DAAD scholarships for Germany
   - Chevening for UK (Nov deadline)
   - Erasmus Mundus Joint Master Degrees
   - University-specific fellowships and assistantships
   - Research assistantships (RA) and Teaching assistantships (TA)
   - Bolashak scholarship for Kazakhstan citizens

4. Pre-requisite courses and skills:
   - Online MOOCs to fill gaps (Coursera, edX, MIT OpenCourseWare)
   - Research methods and academic writing courses
   - Programming/technical skills relevant to ${desiredMajor}
` : `
UNDERGRADUATE SPECIFIC REQUIREMENTS:
1. For ${targetCountry}, include country-specific requirements:
   - USA: SAT/ACT, Common App, CSS Profile, specific essay prompts
   - UK: UCAS, personal statement, predicted grades, interviews for Oxbridge
   - Germany: Uni-Assist, TestAS, German language requirements (TestDaF/DSH)
   - Europe: Specific country requirements, Erasmus+, Bologna process
   
2. For "${desiredMajor}" major, include:
   - Relevant olympiads and competitions with EXACT names and deadlines
   - Specific research programs (RSI, SSRP, university summer programs)
   - Online courses from Coursera/edX with exact course names
   - Subject-specific tests (SAT Subject, AP, A-levels)
`}

3. For goal "${mainGoal}", prioritize:
   - Ivy League/Top Programs: Research experience, unique projects, outstanding essays
   - Full scholarship: Need-based aid forms, merit scholarships by name
   - Specific university: That university's unique requirements

Make EVERY task actionable with specific steps, resources, and deadlines.`;

    console.log("Calling Lovable AI Gateway for roadmap generation...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "API credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      throw new Error("No content in AI response");
    }

    console.log("AI Response received, parsing JSON...");

    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    let roadmap;
    try {
      roadmap = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw content:", content);
      throw new Error("Failed to parse roadmap from AI");
    }

    console.log("Roadmap generated successfully with", roadmap.months?.length || 0, "months");

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-roadmap function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});