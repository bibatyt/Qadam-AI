import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { major, goal, country, language = 'en' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating opportunities for:", { major, goal, country, language });

    const langInstructions: Record<string, string> = {
      en: "Respond in English",
      ru: "Respond in Russian (Русский)",
      kk: "Respond in Kazakh (Қазақша)"
    };

    const langInstruction = langInstructions[language] || langInstructions.en;

    const systemPrompt = `You are an expert education counselor specializing in extracurricular opportunities for university admissions.
${langInstruction}

Generate a JSON array of 6-8 relevant opportunities (olympiads, competitions, research programs, summer camps, online courses) for a student with the following profile:
- Desired Major: ${major || "Not specified"}
- Main Goal: ${goal || "Get into a top university"}
- Target Country/Region: ${country || "Global"}

IMPORTANT RULES:
1. Include a mix of: Olympiads (2), Research Programs (2), Summer Camps (1), Online Courses (1), Competitions (2)
2. Include REAL, existing programs with actual websites
3. Include local opportunities for Kazakhstan, Turkey, and Central Asia if relevant
4. Prioritize programs that are prestigious and relevant to the student's major
5. Include both international and regional opportunities

Return ONLY valid JSON array with this exact structure (no markdown, no explanation):
[
  {
    "id": "unique-id-1",
    "name": "Program Name",
    "type": "olympiad|camp|research|course|competition",
    "relevance": "Brief explanation of how this relates to the student's major",
    "deadline": "Month Year (e.g., January 2025)",
    "url": "https://actual-official-website.com",
    "description": "1-2 sentences about what the student will gain",
    "country": "Country/Region",
    "level": "international|national|regional",
    "free": true
  }
]`;

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
          { role: "user", content: `Generate opportunities for a student interested in ${major || "various fields"} with the goal of ${goal || "university admission"}, targeting ${country || "global"} universities.` }
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from AI");
    }
    
    console.log("AI Response received, parsing JSON...");

    // Parse JSON from the response
    let opportunities;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        opportunities = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON array found in response");
      }
    } catch (parseError) {
      console.error("JSON parse error, attempting to repair truncated response...");
      
      // Try to repair truncated JSON array
      const lastBrace = content.lastIndexOf("}");
      if (lastBrace > 0) {
        try {
          // Find the start of the array
          const arrayStart = content.indexOf("[");
          if (arrayStart >= 0) {
            const repaired = content.substring(arrayStart, lastBrace + 1) + "]";
            opportunities = JSON.parse(repaired);
            console.log(`Recovered ${opportunities.length} items from truncated response`);
          } else {
            throw new Error("Cannot find array start");
          }
        } catch (repairError) {
          console.error("Repair failed:", repairError);
          console.error("Raw content:", content.substring(0, 500));
          throw new Error("Failed to parse opportunities from AI response");
        }
      } else {
        console.error("Raw content:", content.substring(0, 500));
        throw new Error("Cannot parse truncated response");
      }
    }

    console.log(`Generated ${opportunities.length} opportunities`);

    return new Response(JSON.stringify({ opportunities }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-opportunities:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
