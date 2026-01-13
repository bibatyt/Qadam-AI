import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      grade, 
      goal, 
      exams, 
      targetYear, 
      language = "ru",
      englishLevel,
      ieltsScore,
      entScore,
      satScore,
      gpa,
      specialty,
      needScholarship,
      specificGoal,
      targetUniversity
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get current date for realistic planning
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentMonthName = now.toLocaleDateString(language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US", { month: "long", year: "numeric" });
    
    const yearsUntilTarget = targetYear - currentYear;
    const monthsUntilTarget = Math.max(1, (yearsUntilTarget * 12) - currentMonth + 8); // Until August admission

    const langText = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";

    const systemPrompt = `You are Qadam AI — an elite university admissions strategist and personal mentor.

CRITICAL RULES:
- You are NOT a task generator
- You are a STRATEGIC MENTOR who provides CLARITY, not lists
- Maximum 3 actions at any time
- Every recommendation must have a clear WHY, METRIC, and NEXT TRIGGER
- Think like a mentor coaching towards admission, not a checklist generator

TODAY'S DATE: ${now.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
MONTHS UNTIL ADMISSION: ${monthsUntilTarget}

Respond ONLY with valid JSON in ${langText} language. No markdown, no explanations.

The response must follow this EXACT structure:
{
  "goalDefinition": {
    "targetUniversity": "Specific university name or 'Top US Universities'",
    "goal": "1-2 sentence minimum clear goal statement",
    "intendedMajor": "Specific major/field",
    "applicationCycle": "Fall ${targetYear} / Spring ${targetYear}",
    "scholarshipGoal": "Full-ride / Partial / Self-funded",
    "academicSnapshot": {
      "gpa": "X/5",
      "ielts": "X.X or 'Not taken'",
      "sat": "XXXX or 'Not taken'",
      "ent": "XXX or 'Not taken'"
    }
  },
  "strategy": {
    "pillars": [
      {
        "id": "1",
        "name": "Pillar name",
        "description": "Why this pillar is critical",
        "icon": "academics|english|spike|research|narrative|leadership"
      }
    ]
  },
  "currentPhase": {
    "phase": "foundation|differentiation|application",
    "phaseName": "Phase 1: Foundation / Phase 2: Differentiation / Phase 3: Application",
    "explanation": "Brief explanation why this phase is active NOW based on timeline and profile"
  },
  "thisMonthFocus": {
    "objective": "ONE measurable improvement only",
    "month": "${currentMonthName}",
    "whyItMatters": "How this objective directly increases admission chances"
  },
  "highImpactActions": [
    {
      "id": "1",
      "description": "Clear, specific action description",
      "impact": "high|medium|low",
      "impactLabel": "🟢 High / 🟡 Medium / 🔴 Low",
      "whyNow": "Why this action matters RIGHT NOW",
      "deadline": "Specific date or timeframe"
    }
  ],
  "successMetric": {
    "condition": "Clear, measurable condition that proves progress",
    "examples": ["Example metric 1", "Example metric 2"]
  },
  "nextTrigger": {
    "trigger": "What happens AFTER the metric is met",
    "unlocksPhase": "Next phase or area to unlock"
  },
  "progressPercent": 0
}

PILLAR ICONS: Use ONLY these values: academics, english, spike, research, narrative, leadership

IMPACT LEVELS:
- high (🟢): Required for admission - without this, application will fail
- medium (🟡): Strengthens profile significantly
- low (🔴): Optional enhancement

Generate EXACTLY 3 high-impact actions, no more.
Make everything SPECIFIC to this student's profile and goals.
All text must be in ${langText}.`;

    const userPrompt = `Generate a Qadam AI strategic roadmap for this student:

👤 STUDENT PROFILE:
- Current grade: ${grade}
- Goal destination: ${goal === "local" ? "Kazakhstan universities" : "International universities (primarily USA)"}
- Dream university: "${targetUniversity || specificGoal || "Top university in chosen country"}"
- Intended major: ${specialty || "Undecided"}

📊 CURRENT ACADEMIC STANDING:
- GPA: ${gpa || "Unknown"}/5
- English level: ${englishLevel || "Unknown"}
- IELTS score: ${ieltsScore || "Not taken yet"}
- SAT score: ${satScore || "Not taken yet"}
- ЕНТ score: ${entScore || "Not taken yet"}

📅 TIMELINE:
- Today: ${currentMonthName}
- Target admission: Fall ${targetYear}
- Months remaining: ${monthsUntilTarget}

📝 EXAMS PLANNED:
${exams.map((e: string) => `- ${e}`).join("\n")}

💰 SCHOLARSHIP: ${needScholarship ? "NEEDS financial aid - critical factor" : "Self-funded or partial"}

PHASE CLASSIFICATION RULES:
- Phase 1 (Foundation): >12 months until admission, GPA/test prep focus
- Phase 2 (Differentiation): 6-12 months, building spike activities, leadership
- Phase 3 (Application): <6 months, essays, applications, interviews

Based on ${monthsUntilTarget} months remaining, classify correctly.

Generate a STRATEGIC, MENTOR-LIKE roadmap. Focus on WHAT MATTERS MOST right now.
NO generic advice. EVERY recommendation must be SPECIFIC to this profile.
Language: ${langText}`;

    console.log("Generating Qadam AI strategic roadmap...");
    console.log("Student profile:", { grade, goal, exams, targetYear, ieltsScore, satScore, gpa, specialty, needScholarship, targetUniversity });
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");
    
    // Clean and parse JSON
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    const pathData = JSON.parse(cleanedContent);
    
    // Calculate initial progress based on phase
    let progressPercent = 0;
    if (pathData.currentPhase?.phase === "foundation") {
      progressPercent = 5;
    } else if (pathData.currentPhase?.phase === "differentiation") {
      progressPercent = 35;
    } else if (pathData.currentPhase?.phase === "application") {
      progressPercent = 65;
    }
    
    pathData.progressPercent = progressPercent;
    
    console.log("Qadam AI roadmap generated successfully");
    console.log("Current phase:", pathData.currentPhase?.phase);
    console.log("Actions count:", pathData.highImpactActions?.length);
    
    return new Response(
      JSON.stringify(pathData),
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
