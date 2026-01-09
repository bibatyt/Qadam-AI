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
      specificGoal
    } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get current date for realistic planning
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const currentMonthName = now.toLocaleDateString(language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US", { month: "long" });
    
    const yearsUntilTarget = targetYear - currentYear;
    const monthsUntilTarget = Math.max(1, (yearsUntilTarget * 12) - currentMonth);

    const langText = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";
    
    // Calculate month names for stages
    const getMonthName = (monthsFromNow: number) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() + monthsFromNow);
      return date.toLocaleDateString(language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US", { month: "long", year: "numeric" });
    };

    // Dynamic stage periods based on current date and target year
    const stagePeriods = {
      stage1Start: getMonthName(0),
      stage1End: getMonthName(2),
      stage2Start: getMonthName(3),
      stage2End: getMonthName(5),
      stage3Start: getMonthName(6),
      stage3End: getMonthName(8),
      stage4Start: getMonthName(9),
      stage4End: getMonthName(11),
      stage5Start: getMonthName(12),
      stage5End: getMonthName(14),
    };

    const systemPrompt = `You are an expert university admission counselor specializing in helping students from Kazakhstan apply to universities.

CRITICAL: Today's date is ${now.toLocaleDateString(language === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" })}. 
The student is targeting admission in ${targetYear}. They have approximately ${monthsUntilTarget} months to prepare.

IMPORTANT: Respond ONLY with valid JSON, no markdown or explanations.

The response must be a JSON object with this exact structure:
{
  "stages": [
    {
      "id": "1",
      "name": "Stage name in ${langText}",
      "period": "${stagePeriods.stage1Start} — ${stagePeriods.stage1End}",
      "goal": "Main goal for this stage in ${langText}",
      "milestones": [
        {
          "id": "1-1",
          "title": "Short milestone title",
          "description": "1-2 sentence explanation",
          "status": "not_started"
        }
      ],
      "details": {
        "subjects": ["Subject 1", "Subject 2"],
        "exams": ["Exam goal 1", "Exam goal 2"],
        "skills": ["Skill 1", "Skill 2"],
        "projects": ["Project/competition 1", "Project 2"],
        "weeklyActions": ["Weekly action 1", "Weekly action 2", "Weekly action 3"]
      }
    }
  ],
  "currentStage": "1",
  "recommendations": [
    "Personalized recommendation 1",
    "Personalized recommendation 2",
    "Personalized recommendation 3"
  ],
  "warnings": [
    "Warning about common mistake 1",
    "Warning 2",
    "Warning 3"
  ],
  "urgentAction": "Most important action to take THIS WEEK",
  "expectedProgressByMonth": {
    "1": 8,
    "3": 20,
    "6": 40,
    "9": 65,
    "12": 85
  }
}

STAGE NAMING GUIDELINES (${langText}):
${language === "ru" ? `
- Stage 1: "Подготовка и анализ" (Preparation & Analysis)
- Stage 2: "Экзамены" (Examinations)
- Stage 3: "Эссе и документы" (Essays & Documents)
- Stage 4: "Подача заявок" (Applications)
- Stage 5: "Финальные шаги" (Final Steps)
` : language === "kk" ? `
- Stage 1: "Дайындық және талдау" (Preparation & Analysis)
- Stage 2: "Емтихандар" (Examinations)
- Stage 3: "Эссе және құжаттар" (Essays & Documents)
- Stage 4: "Өтінімдер беру" (Applications)
- Stage 5: "Соңғы қадамдар" (Final Steps)
` : `
- Stage 1: "Preparation & Analysis"
- Stage 2: "Examinations"
- Stage 3: "Essays & Documents"
- Stage 4: "Applications"
- Stage 5: "Final Steps"
`}

Generate EXACTLY 5 stages with 3-5 milestones each.
Make milestones SPECIFIC to the student's profile - mention their actual exams, scores, and goals.
All dates and periods must be realistic starting from TODAY.
Language for ALL content: ${langText}`;

    // Build personalized context
    let personalContext = "";
    
    if (ieltsScore) {
      const score = parseFloat(ieltsScore);
      if (score < 6.0) {
        personalContext += `\n⚠️ IELTS score (${score}) is below minimum requirements for most universities. PRIORITIZE English improvement.`;
      } else if (score < 7.0) {
        personalContext += `\nIELTS score (${score}) is acceptable but could be improved for competitive universities.`;
      } else {
        personalContext += `\n✓ IELTS score (${score}) is strong - focus on other areas.`;
      }
    }
    
    if (satScore) {
      const score = parseInt(satScore);
      if (score < 1200) {
        personalContext += `\n⚠️ SAT score (${score}) needs significant improvement for competitive universities.`;
      } else if (score < 1400) {
        personalContext += `\nSAT score (${score}) is good but could be improved for top universities.`;
      } else {
        personalContext += `\n✓ SAT score (${score}) is competitive.`;
      }
    }
    
    if (gpa) {
      const gpaNum = parseFloat(gpa);
      if (gpaNum < 4.0) {
        personalContext += `\nGPA (${gpaNum}/5) is moderate - focus on improvement and extracurriculars.`;
      } else {
        personalContext += `\n✓ GPA (${gpaNum}/5) is strong.`;
      }
    }

    if (needScholarship) {
      personalContext += `\n💰 NEEDS SCHOLARSHIP - include financial aid applications, CSS Profile, FAFSA deadlines.`;
    }

    if (specificGoal?.toLowerCase().includes("ivy") || specificGoal?.toLowerCase().includes("топ") || specificGoal?.toLowerCase().includes("harvard") || specificGoal?.toLowerCase().includes("mit")) {
      personalContext += `\n🎯 AMBITIOUS GOAL (${specificGoal}) - include competitive positioning, research opportunities, and backup strategies.`;
    }

    const userPrompt = `Create a PERSONALIZED ${monthsUntilTarget}-month admission roadmap for this student:

📅 TIMELINE:
- Today: ${now.toLocaleDateString(language === "ru" ? "ru-RU" : "en-US", { day: "numeric", month: "long", year: "numeric" })}
- Target admission: ${targetYear}
- Time available: ~${monthsUntilTarget} months

👤 STUDENT PROFILE:
- Current grade: ${grade}
- Goal: ${goal === "local" ? "Kazakhstan universities" : "International universities"}
- Specific dream: "${specificGoal || "Top university admission"}"
- Specialty interest: ${specialty || "Undecided"}

📊 CURRENT SCORES:
- English level: ${englishLevel || "Unknown"}
- IELTS: ${ieltsScore || "Not taken"}
- SAT: ${satScore || "Not taken"}
- ЕНТ: ${entScore || "Not taken"}
- GPA: ${gpa || "Unknown"}/5

📝 EXAMS PLANNING:
${exams.map((e: string) => `- ${e}`).join("\n")}

${personalContext}

INSTRUCTIONS:
1. Create 5 SEQUENTIAL stages with REAL dates starting from TODAY
2. Each stage should have 3-5 SPECIFIC milestones with actionable tasks
3. Include EXACT exam dates/deadlines where known (IELTS tests are available monthly, SAT typically in March, May, August, October, December)
4. Mention SPECIFIC universities if goal is international (Harvard, MIT, Stanford for ambitious; state schools for moderate)
5. For scholarship seekers: include CSS Profile (Oct 1), FAFSA, university-specific deadlines
6. Weekly actions should be CONCRETE (e.g., "Solve 20 SAT math problems" not "Study math")
7. Subjects should include specific preparation materials/courses

Make this plan feel PERSONAL - reference their actual scores, goals, and timeline throughout.`;

    console.log("Generating personalized roadmap with Lovable AI...");
    console.log("Student profile:", { grade, goal, exams, targetYear, ieltsScore, satScore, gpa, specialty, needScholarship });
    
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
    
    // Flatten milestones for backward compatibility
    const allMilestones = pathData.stages?.flatMap((stage: any, stageIndex: number) => 
      (stage.milestones || []).map((m: any, mIndex: number) => ({
        ...m,
        id: m.id || `${stageIndex + 1}-${mIndex + 1}`,
        category: stage.name,
        order: stageIndex * 10 + mIndex + 1,
        stageId: stage.id,
      }))
    ) || [];
    
    console.log("Path generated successfully with", pathData.stages?.length, "stages and", allMilestones.length, "total milestones");
    
    // Return both formats for flexibility
    return new Response(
      JSON.stringify({
        ...pathData,
        milestones: allMilestones,
        currentStage: pathData.currentStage || pathData.stages?.[0]?.name || "",
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
