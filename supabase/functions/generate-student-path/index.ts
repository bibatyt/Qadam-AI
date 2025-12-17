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
    const { grade, goal, exams, targetYear, language = "ru" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const currentYear = new Date().getFullYear();
    const yearsUntilTarget = targetYear - currentYear;

    const systemPrompt = `You are an expert university admission counselor. Generate a clear, actionable admission path for a high school student.

IMPORTANT: Respond ONLY with valid JSON, no markdown or explanations.

The response must be a JSON object with this exact structure:
{
  "milestones": [
    {
      "id": "unique-id",
      "title": "Short milestone title",
      "description": "1-2 sentence explanation",
      "status": "not_started",
      "category": "category name",
      "order": 1
    }
  ],
  "currentStage": "Current stage description"
}

Categories to use: "preparation", "exams", "documents", "applications", "final"
Status must always be "not_started" for new milestones.
Generate 8-12 milestones that are realistic and actionable.
Language for content: ${language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English"}`;

    const userPrompt = `Create an admission path for:
- Grade: ${grade}
- Goal: ${goal === "local" ? "Local/National University" : "International University"}
- Main exams: ${exams.join(", ")}
- Target intake year: ${targetYear} (${yearsUntilTarget} year${yearsUntilTarget > 1 ? "s" : ""} from now)

Generate milestones that are specific to these exams and timeline. Include exam preparation, document preparation, and application steps.`;

    console.log("Generating path with Lovable AI...");
    
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

    const pathData = JSON.parse(cleanedContent);
    
    console.log("Path generated successfully with", pathData.milestones?.length, "milestones");

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
