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

    const systemPrompt = `You are an elite university admissions counselor with expertise in getting students into top universities worldwide. Generate an EXTREMELY DETAILED, month-by-month roadmap with SPECIFIC, CONCRETE actions.

CRITICAL RULES FOR TASK GENERATION:
1. NEVER use vague language like "research universities" or "prepare for tests"
2. ALWAYS include SPECIFIC names, numbers, and deadlines
3. Each task MUST have a clear, measurable outcome
4. Include EXACT resources, websites, and programs by name

EXAMPLE OF BAD TASK: "Research universities in Germany"
EXAMPLE OF GOOD TASK: "Create a spreadsheet comparing TU Munich, LMU Munich, Heidelberg, and RWTH Aachen for ${desiredMajor}. Include: admission requirements, tuition fees, language requirements, application deadlines (TU Munich: Jan 15, LMU: Jan 15), and scholarship opportunities (DAAD, Deutschlandstipendium)"

EXAMPLE OF BAD TASK: "Improve English skills"  
EXAMPLE OF GOOD TASK: "Complete Cambridge IELTS 18 Practice Test 1-2. Target: Reading 7.5+, Listening 7.5+. Use official British Council IELTS prep materials. Schedule speaking practice 3x/week on italki.com"

EXAMPLE OF BAD TASK: "Work on extracurriculars"
EXAMPLE OF GOOD TASK: "Register for USABO (USA Biology Olympiad) Open Exam (deadline: Feb 1). Complete chapters 1-5 of Campbell Biology 12th edition. Join Biology Olympiad Discord server for peer study groups"

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks.

The roadmap should:
1. Start from ${currentMonth} ${currentYear}
2. Include 8-12 months of planning
3. Each month should have 4-6 HYPER-SPECIFIC tasks
4. Every task must include: specific program names, exact deadlines, concrete numbers/targets, recommended resources
5. Adapt tasks to the student's target country requirements
6. For ${targetCountry} specifically include: required exams, language certificates, specific universities, scholarship programs

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
          "title": "Concise but specific title (max 10 words)",
          "description": "DETAILED description with: 1) Exact actions to take, 2) Specific resources/websites, 3) Measurable outcomes, 4) Deadlines if applicable. Minimum 3 sentences.",
          "category": "academic|test|extracurricular|essay|recommendation|application",
          "xpReward": 15
        }
      ]
    }
  ]
}`;

    const userPrompt = `Student Profile:
- Current GPA: ${gpa}/4.0
- SAT Score: ${satScore || 'Not taken yet'}
- IELTS/TOEFL Score: ${ieltsScore || 'Not taken yet'}  
- Current Grade: ${currentGrade}
- Desired Major: ${desiredMajor}
- Target Country: ${targetCountry}
- Main Goal: ${mainGoal}

Generate a HYPER-DETAILED month-by-month roadmap starting from ${currentMonth} ${currentYear}.

REQUIREMENTS:
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

3. For goal "${mainGoal}", prioritize:
   - Ivy League/Top 20: Research, unique projects, outstanding essays
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