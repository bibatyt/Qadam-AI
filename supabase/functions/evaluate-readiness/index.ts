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
      gpa,
      englishLevel,
      ieltsScore,
      targetCountries,
      annualBudget,
      intendedMajor,
      extracurriculars,
      grade,
      age,
      language = "ru"
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const langText = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";

    const systemPrompt = `You are an Admission Readiness Evaluation System for high school students.

Your task:
1. Analyze the student profile.
2. Calculate an Admission Readiness Score from 0 to 100.
3. Identify strengths, weaknesses, and risks.
4. Recommend a personalized admission strategy.

Scoring logic (total 100 points):
- GPA contributes up to 30 points (5.0 = 30pts, 4.0 = 24pts, 3.0 = 18pts, etc.)
- English level contributes up to 25 points (IELTS 8.0+ = 25pts, 7.0 = 20pts, 6.5 = 17pts, 6.0 = 14pts, etc.)
- Extracurriculars contribute up to 20 points (based on quality, leadership, impact)
- Budget-country match contributes up to 15 points (can they afford target countries?)
- Profile clarity and readiness contributes up to 10 points (how complete/clear is their profile?)

IMPORTANT RULES:
- Be realistic and honest
- Do NOT guarantee admission
- Focus on guidance, not motivation
- Use clear, structured language

IMPORTANT: Respond ONLY with valid JSON, no markdown or explanations.

The response must be a JSON object with this exact structure:
{
  "readinessScore": <number 0-100>,
  "scoreBreakdown": {
    "gpa": <number 0-30>,
    "english": <number 0-25>,
    "extracurriculars": <number 0-20>,
    "budgetMatch": <number 0-15>,
    "profileClarity": <number 0-10>
  },
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "weaknesses": [
    "Weakness 1",
    "Weakness 2",
    "Weakness 3"
  ],
  "riskLevel": "Low" | "Medium" | "High",
  "riskExplanation": "Brief explanation of the risk level",
  "strategies": [
    {
      "title": "Strategy title",
      "description": "Detailed description of the strategy"
    }
  ],
  "roadmap": [
    {
      "month": "Month 1-2",
      "focus": "Focus area",
      "actions": ["Action 1", "Action 2"]
    }
  ]
}

Language for ALL content: ${langText}`;

    const userPrompt = `Evaluate admission readiness for a student with these details:

ACADEMIC PROFILE:
- GPA: ${gpa || "Not provided"} (out of 5.0 scale)
- Current Grade: ${grade || "Not provided"}
- Age: ${age || "Not provided"}

ENGLISH PROFICIENCY:
- General Level: ${englishLevel || "Not provided"}
- IELTS Score: ${ieltsScore || "Not taken yet"}

TARGET GOALS:
- Target Countries: ${targetCountries?.join(", ") || "Not specified"}
- Intended Major: ${intendedMajor || "Not decided"}

FINANCIAL:
- Annual Budget (USD): ${annualBudget || "Not specified"}

EXTRACURRICULAR ACTIVITIES:
${extracurriculars || "None provided"}

Please:
1. Calculate the Admission Readiness Score with detailed breakdown
2. List 3-5 key strengths
3. Identify 3-5 weaknesses/gaps
4. Assess risk level (Low/Medium/High) with explanation
5. Provide 3 recommended admission strategies
6. Create a 6-12 month improvement roadmap with specific actions`;

    console.log("Evaluating admission readiness with Lovable AI...");

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

    const evaluationData = JSON.parse(cleanedContent);

    console.log("Evaluation completed, score:", evaluationData.readinessScore);

    return new Response(
      JSON.stringify(evaluationData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error evaluating readiness:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
