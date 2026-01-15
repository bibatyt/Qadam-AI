import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const GOOGLE_SHEETS_WEBHOOK_URL = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackData {
  rating: number | null;
  feedback: string;
  language: string;
  source: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: FeedbackData = await req.json();
    
    console.log("Received feedback:", data);

    // If webhook URL is configured, send to Google Sheets
    if (GOOGLE_SHEETS_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: data.timestamp,
            rating: data.rating ?? "N/A",
            feedback: data.feedback || "No feedback provided",
            language: data.language,
            source: data.source,
          }),
        });

        if (!webhookResponse.ok) {
          console.error("Failed to send to Google Sheets webhook:", await webhookResponse.text());
        } else {
          console.log("Successfully sent to Google Sheets");
        }
      } catch (webhookError) {
        console.error("Webhook error:", webhookError);
        // Continue even if webhook fails - we'll still return success
      }
    } else {
      console.log("No GOOGLE_SHEETS_WEBHOOK_URL configured, feedback logged only");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Feedback received successfully" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Error processing feedback:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
