import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubmissionData {
  submissionId: string;
  userId: string;
  phase: "foundation" | "differentiation" | "proof" | "leverage";
  submissionType: string;
  data: Record<string, any>;
  userBaseline: Record<string, any>;
  language?: "ru" | "kk" | "en";
}

interface VerificationResult {
  approved: boolean;
  reason: string;
  cooldownHours?: number;
  requirementsMet?: string[];
  unlockNextPhase?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { submissionId, userId, phase, submissionType, data, userBaseline, language = "ru" } = await req.json() as SubmissionData;

    console.log("Verifying submission:", { submissionId, phase, submissionType });

    // Build verification prompt based on phase and submission type
    const verificationPrompt = buildVerificationPrompt(phase, submissionType, data, userBaseline, language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: getSystemPrompt(language) },
          { role: "user", content: verificationPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "submit_verification_result",
              description: "Submit the verification result for the phase submission",
              parameters: {
                type: "object",
                properties: {
                  approved: {
                    type: "boolean",
                    description: "Whether the submission meets the criteria"
                  },
                  reason: {
                    type: "string",
                    description: "Specific, factual explanation of the decision. If rejected, state EXACTLY what is missing or invalid."
                  },
                  cooldownHours: {
                    type: "number",
                    description: "Hours before user can resubmit (only if rejected). Default 24 for minor issues, 72 for major issues."
                  },
                  requirementsMet: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of requirement keys that were verified as met"
                  }
                },
                required: ["approved", "reason"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "submit_verification_result" } },
        temperature: 0.1, // Low temperature for consistent, strict evaluation
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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("No verification result from AI");
    }

    const result: VerificationResult = JSON.parse(toolCall.function.arguments);
    console.log("AI verification result:", result);

    // Update submission status
    const newStatus = result.approved ? "approved" : "rejected";
    const cooldownUntil = result.cooldownHours && !result.approved
      ? new Date(Date.now() + result.cooldownHours * 60 * 60 * 1000).toISOString()
      : null;

    await supabase
      .from("phase_submissions")
      .update({
        status: newStatus,
        ai_feedback: result.reason,
        reviewed_at: new Date().toISOString(),
        cooldown_until: cooldownUntil,
      })
      .eq("id", submissionId);

    // If approved, update requirements
    if (result.approved && result.requirementsMet) {
      for (const reqKey of result.requirementsMet) {
        await supabase
          .from("phase_requirements")
          .upsert({
            user_id: userId,
            phase: phase,
            requirement_key: reqKey,
            requirement_label: getRequirementLabel(reqKey, language),
            completed: true,
            completed_at: new Date().toISOString(),
            proof_link: data.proofLink || data.link || null,
            proof_data: data,
          }, {
            onConflict: "user_id,phase,requirement_key"
          });
      }

      // Check if all phase requirements are now met
      const phaseComplete = await checkPhaseCompletion(supabase, userId, phase);
      
      if (phaseComplete) {
        // Unlock next phase
        const nextPhase = getNextPhase(phase);
        if (nextPhase) {
          const unlockField = `${nextPhase}_unlocked`;
          const completeField = `${phase}_completed`;
          
          await supabase
            .from("phase_progress")
            .update({
              [completeField]: true,
              [unlockField]: true,
              current_phase: nextPhase,
            })
            .eq("user_id", userId);
        }
        
        result.unlockNextPhase = true;
      }
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error verifying submission:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getSystemPrompt(language: string): string {
  const langText = language === "ru" ? "Russian" : language === "kk" ? "Kazakh" : "English";
  
  return `You are a STRICT university admissions officer evaluating student submissions.

CRITICAL BEHAVIORAL RULES:
- NO encouragement
- NO motivation
- NO emotional language
- NO comparison with other students
- Only factual approval or rejection with specific reasons
- Your tone is calm, professional, and selective

EVALUATION PRINCIPLES:
- Proof over claims: Evidence must be verifiable
- Links must be accessible and real
- Scores must be documented
- Generic or vague submissions are REJECTED
- School-level achievements are NOT sufficient for Phase 2+
- Unmeasurable results are REJECTED

If criteria are not met, state EXACTLY what is missing.
Do not soften rejections.
Do not offer alternatives.

Respond with your verification result in ${langText}.`;
}

function buildVerificationPrompt(
  phase: string,
  submissionType: string,
  data: Record<string, any>,
  userBaseline: Record<string, any>,
  language: string
): string {
  const prompts: Record<string, Record<string, string>> = {
    foundation: {
      sat_diagnostic: `
VERIFY SAT DIAGNOSTIC SUBMISSION

Student claims: SAT diagnostic score of ${data.score}
Proof provided: ${data.proofLink || "No link provided"}
Proof type: ${data.proofType || "Not specified"} (should be Bluebook or Khan Academy)

REQUIREMENTS TO APPROVE:
- Score must be ≥1350
- Proof link must be from official source (College Board Bluebook or Khan Academy)
- Screenshot or link must show actual score

Evaluate and determine:
- Is the proof link valid and verifiable?
- Is the score clearly visible and ≥1350?
- Is the source legitimate (not self-reported without evidence)?

If ANY requirement is missing, REJECT with specific reason.`,

      project_topic: `
VERIFY PROJECT TOPIC SUBMISSION

Student's project topic: "${data.topicName || "Not provided"}"
Project description: "${data.description || "Not provided"}"
Proof link: ${data.proofLink || "No link provided"}
Platform: ${data.platform || "Not specified"} (should be GitHub, Google Doc, or Notion)

REQUIREMENTS TO APPROVE:
- Topic must exist and be clearly stated
- Link must point to actual content (not empty repo/doc)
- Description must indicate genuine work, not just an idea

If link is empty, inaccessible, or content is placeholder, REJECT.`,

      mock_sat_completion: `
VERIFY MOCK SAT COMPLETION

Student claims: ${data.attemptCount || 0} mock SAT attempts
Best score claimed: ${data.bestScore || "Not provided"}
Proof links: ${JSON.stringify(data.proofLinks || [])}

REQUIREMENTS TO APPROVE:
- At least 3 full mock SAT attempts documented
- Best score must be ≥1450
- Each attempt must have verifiable proof

Evaluate each proof link for validity.
If fewer than 3 attempts or best score <1450, REJECT.`,

      self_analysis: `
VERIFY SELF-ANALYSIS SUBMISSION

Student submitted structured self-analysis:
- Strengths identified: ${JSON.stringify(data.strengths || [])}
- Weaknesses identified: ${JSON.stringify(data.weaknesses || [])}
- Improvement plan: ${data.improvementPlan || "Not provided"}

REQUIREMENTS TO APPROVE:
- Must have at least 2 specific strengths
- Must have at least 2 specific weaknesses  
- Improvement plan must be concrete and measurable
- No vague or generic statements

If any field is empty or contains generic text like "I need to improve", REJECT.`
    },

    differentiation: {
      track_selection: `
VERIFY TRACK SELECTION

Student selected track: ${data.track || "Not selected"}
Valid tracks: Research, Startup, Olympiad, Social Impact

REQUIREMENTS TO APPROVE:
- Track must be one of the four valid options
- Student must commit to ONE track only

If invalid track or multiple tracks, REJECT.`,

      public_artifact: `
VERIFY PUBLIC ARTIFACT

Track: ${data.track}
Artifact link: ${data.artifactLink || "No link provided"}
Artifact type: ${data.artifactType || "Not specified"}

REQUIREMENTS BY TRACK:
- Research: Published paper, preprint, or research repository
- Startup: Live product, demo, or pitch deck with traction data
- Olympiad: Official competition results page
- Social Impact: Project website, media coverage, or organizational page

EVALUATE:
- Is the link publicly accessible?
- Does it demonstrate actual work, not just intentions?
- Is it beyond school-level (national/international scope)?

REJECT if link is broken, private, or shows school-level work only.`,

      measurable_metric: `
VERIFY MEASURABLE METRIC

Track: ${data.track}
Metric claimed: ${data.metricValue} ${data.metricUnit || ""}
Metric type: ${data.metricType || "Not specified"}
Proof: ${data.proofLink || "No proof provided"}

REQUIREMENTS:
- Metric must be a specific NUMBER
- Must have supporting evidence
- Must be verifiable from external source

Examples of ACCEPTABLE metrics:
- "500 users", "3 papers submitted", "Top 10% nationally", "$5000 raised"

Examples of REJECTED metrics:
- "Many people helped", "Good feedback", "Significant impact"

REJECT if metric is vague, unverifiable, or unsupported.`,

      external_validation: `
VERIFY EXTERNAL VALIDATION

Track: ${data.track}
Validation type: ${data.validationType} (mentor/competition/users)
Evidence provided: ${data.evidence || "None"}
Proof link: ${data.proofLink || "No link"}

REQUIREMENTS:
- Must have external party confirming the work
- Competition: Official results or certificate
- Mentor: Verifiable affiliation of mentor
- Users: Analytics or testimonials with source

REJECT if validation is self-reported without external evidence.`
    },

    proof: {
      recommender_identification: `
VERIFY RECOMMENDER IDENTIFICATION

Recommenders identified:
1. ${data.recommender1?.name || "Not provided"} - ${data.recommender1?.role || "No role"} - ${data.recommender1?.affiliation || "No affiliation"}
2. ${data.recommender2?.name || "Not provided"} - ${data.recommender2?.role || "No role"} - ${data.recommender2?.affiliation || "No affiliation"}

REQUIREMENTS:
- At least 2 recommenders identified
- Each must have clear name, role, and institutional affiliation
- Role must be teacher, professor, mentor, or supervisor (not family/friend)

FLAG weak recommenders:
- Same institution for both
- Non-academic roles
- Vague affiliations

REJECT if fewer than 2 valid recommenders.`,

      honors_recognition: `
VERIFY HONORS/RECOGNITION

Honor claimed: ${data.honorName || "Not specified"}
Level: ${data.level || "Not specified"} (should be school/regional/national/international)
Proof: ${data.proofLink || "No link"}
Issuing organization: ${data.issuingOrg || "Not specified"}

REQUIREMENTS:
- Must be verifiable formal recognition
- Issuing organization must be identifiable
- Proof must show student's name and the award

REJECT if:
- Self-issued certificates
- Participation certificates only
- No verifiable organization
- School-level only (for Phase 3, need regional+ for unlock)`,

      narrative_structure: `
VERIFY ADMISSIONS NARRATIVE

Narrative structure submitted:
- Who I am: "${data.whoIAm || "Not provided"}"
- What I built: "${data.whatIBuilt || "Not provided"}"
- Why it matters: "${data.whyItMatters || "Not provided"}"

REQUIREMENTS:
- All three sections must be completed
- Each section: 2-4 sentences, specific, not generic
- Must connect logically (identity → action → impact)
- No clichés ("I've always been passionate about...")
- No unverifiable claims

REJECT if:
- Any section is empty
- Generic statements without specifics
- Disconnected narrative
- Claims not supported by previous submissions`
    },

    leverage: {
      university_list: `
VERIFY UNIVERSITY LIST

Reach schools: ${JSON.stringify(data.reachSchools || [])}
Match schools: ${JSON.stringify(data.matchSchools || [])}
Safety schools: ${JSON.stringify(data.safetySchools || [])}

REQUIREMENTS:
- At least 2 Reach, 3 Match, 2 Safety schools
- Schools must be real universities
- Classification must be reasonable based on profile

APPROVE if list is complete and realistic.`,

      scholarship_strategy: `
VERIFY SCHOLARSHIP STRATEGY

Target scholarships: ${JSON.stringify(data.scholarships || [])}
Aid strategy: ${data.aidStrategy || "Not provided"}
Financial need documented: ${data.financialNeedDocs ? "Yes" : "No"}

REQUIREMENTS:
- At least 3 specific scholarships identified
- Deadlines known for each
- Strategy must match student's profile and needs

APPROVE if strategy is specific and actionable.`
    }
  };

  return prompts[phase]?.[submissionType] || `Unknown submission type: ${phase}/${submissionType}`;
}

function getRequirementLabel(reqKey: string, language: string): string {
  const labels: Record<string, Record<string, string>> = {
    ru: {
      sat_diagnostic_1350: "SAT диагностика ≥1350",
      project_topic: "Тема долгосрочного проекта",
      mock_sat_3x: "3 пробных SAT",
      mock_sat_1450: "Лучший балл ≥1450",
      self_analysis: "Структурированный самоанализ",
      track_selection: "Выбор направления",
      public_artifact: "Публичный артефакт",
      measurable_metric: "Измеримая метрика",
      external_validation: "Внешняя валидация",
      recommender_1: "Рекомендатель 1",
      recommender_2: "Рекомендатель 2",
      honors_recognition: "Награды и признание",
      narrative_approved: "Нарратив одобрен",
      university_list: "Список университетов",
      scholarship_strategy: "Стратегия стипендий",
    },
    kk: {
      sat_diagnostic_1350: "SAT диагностикасы ≥1350",
      project_topic: "Ұзақ мерзімді жоба тақырыбы",
      mock_sat_3x: "3 сынақ SAT",
      mock_sat_1450: "Үздік балл ≥1450",
      self_analysis: "Құрылымды өзін-өзі талдау",
      track_selection: "Бағыт таңдау",
      public_artifact: "Жария артефакт",
      measurable_metric: "Өлшенетін метрика",
      external_validation: "Сыртқы валидация",
      recommender_1: "Ұсынушы 1",
      recommender_2: "Ұсынушы 2",
      honors_recognition: "Марапаттар мен мойындау",
      narrative_approved: "Баяндама бекітілді",
      university_list: "Университеттер тізімі",
      scholarship_strategy: "Стипендия стратегиясы",
    },
    en: {
      sat_diagnostic_1350: "SAT Diagnostic ≥1350",
      project_topic: "Long-term Project Topic",
      mock_sat_3x: "3 Mock SAT Attempts",
      mock_sat_1450: "Best Score ≥1450",
      self_analysis: "Structured Self-Analysis",
      track_selection: "Track Selection",
      public_artifact: "Public Artifact",
      measurable_metric: "Measurable Metric",
      external_validation: "External Validation",
      recommender_1: "Recommender 1",
      recommender_2: "Recommender 2",
      honors_recognition: "Honors & Recognition",
      narrative_approved: "Narrative Approved",
      university_list: "University List",
      scholarship_strategy: "Scholarship Strategy",
    }
  };
  
  return labels[language]?.[reqKey] || labels.en[reqKey] || reqKey;
}

async function checkPhaseCompletion(
  supabase: any,
  userId: string,
  phase: string
): Promise<boolean> {
  const requiredKeys: Record<string, string[]> = {
    foundation: ["sat_diagnostic_1350", "project_topic", "mock_sat_3x", "mock_sat_1450", "self_analysis"],
    differentiation: ["track_selection", "public_artifact", "measurable_metric", "external_validation"],
    proof: ["recommender_1", "recommender_2", "honors_recognition", "narrative_approved"],
    leverage: ["university_list", "scholarship_strategy"],
  };

  const required = requiredKeys[phase] || [];
  
  const { data: completedReqs } = await supabase
    .from("phase_requirements")
    .select("requirement_key")
    .eq("user_id", userId)
    .eq("phase", phase)
    .eq("completed", true);

  const completedKeys = new Set((completedReqs || []).map((r: any) => r.requirement_key));
  
  return required.every(key => completedKeys.has(key));
}

function getNextPhase(currentPhase: string): string | null {
  const order = ["foundation", "differentiation", "proof", "leverage"];
  const currentIndex = order.indexOf(currentPhase);
  return currentIndex < order.length - 1 ? order[currentIndex + 1] : null;
}
