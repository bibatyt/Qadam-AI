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

    const systemPrompt = `You are an expert university admissions counselor. Generate a detailed, month-by-month roadmap to help a student achieve their university admission goal. 

IMPORTANT: Respond ONLY with valid JSON, no markdown, no code blocks, just pure JSON.

The roadmap should:
1. Start from ${currentMonth} ${currentYear}
2. Include 8-12 months of planning depending on the goal
3. Each month should have 3-5 specific, actionable tasks
4. Tasks should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
5. Consider the student's current level and target goal
6. Include tasks for: academics, standardized tests, extracurriculars, essays, recommendations, applications

Generate all task titles and descriptions in ${languagePrompt}.

Return ONLY a JSON object with this exact structure (no markdown):
{
  "months": [
    {
      "month": "Month Year",
      "monthIndex": 0,
      "theme": "Short theme description",
      "tasks": [
        {
          "title": "Task title",
          "description": "Detailed description",
          "category": "academic|test|extracurricular|essay|recommendation|application",
          "xpReward": 15
        }
      ]
    }
  ]
}`;

    const userPrompt = `Student Profile:
- Current GPA: ${gpa}
- SAT Score: ${satScore || 'Not taken yet'}
- IELTS/TOEFL Score: ${ieltsScore || 'Not taken yet'}
- Current Grade: ${currentGrade}
- Desired Major: ${desiredMajor}
- Target Country/Region: ${targetCountry}
- Main Goal: ${mainGoal}

Generate a comprehensive month-by-month roadmap starting from ${currentMonth} ${currentYear} to help this student achieve their goal of: "${mainGoal}"

Focus on what's most important for ${targetCountry} universities and the specific goal. Make tasks concrete and actionable.`;

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