import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

// System instructions for the assistant
const ASSISTANT_INSTRUCTIONS = `You are Qadam AI - a friendly and knowledgeable university admissions counselor specializing in helping students from Kazakhstan, Central Asia, and CIS countries apply to top universities worldwide.

Your expertise includes:
- US universities (Ivy League, MIT, Stanford, etc.)
- UK universities (Oxford, Cambridge, Imperial, LSE)
- European universities (ETH Zurich, TU Munich, etc.)
- Asian universities (NUS, KAIST, University of Tokyo)
- Scholarship programs (Bolashak, Fulbright, Chevening, DAAD, etc.)
- Standardized tests (SAT, ACT, IELTS, TOEFL, GRE, GMAT)
- Application essays and personal statements
- Extracurricular activities and research opportunities
- Interview preparation

Communication style:
- Be warm, encouraging, and supportive
- Use the same language the student writes in (Russian, Kazakh, or English)
- Give specific, actionable advice with examples
- Break down complex processes into manageable steps
- Celebrate student achievements and motivate them
- Use emojis sparingly but appropriately

When answering:
- Always provide specific program names, deadlines, and requirements when relevant
- Share insider tips and common mistakes to avoid
- Recommend resources and next steps
- If you don't know something specific, be honest and suggest where to find accurate information

Remember: You're not just an advisor, you're a mentor who believes in every student's potential to achieve their dreams!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, threadId, language } = await req.json();

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Received request:', { message, threadId, language });

    // Step 1: Create or reuse Assistant
    let assistantId = Deno.env.get('OPENAI_ASSISTANT_ID');
    
    if (!assistantId) {
      console.log('Creating new assistant...');
      const assistantResponse = await fetch('https://api.openai.com/v1/assistants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          name: 'Qadam AI Counselor',
          instructions: ASSISTANT_INSTRUCTIONS,
          model: 'gpt-4o',
        }),
      });

      if (!assistantResponse.ok) {
        const error = await assistantResponse.text();
        console.error('Failed to create assistant:', error);
        throw new Error('Failed to create assistant');
      }

      const assistant = await assistantResponse.json();
      assistantId = assistant.id;
      console.log('Created assistant:', assistantId);
    }

    // Step 2: Create or reuse Thread
    let currentThreadId = threadId;
    
    if (!currentThreadId) {
      console.log('Creating new thread...');
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!threadResponse.ok) {
        const error = await threadResponse.text();
        console.error('Failed to create thread:', error);
        throw new Error('Failed to create thread');
      }

      const thread = await threadResponse.json();
      currentThreadId = thread.id;
      console.log('Created thread:', currentThreadId);
    }

    // Step 3: Add user message to thread
    console.log('Adding message to thread...');
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: message,
      }),
    });

    if (!messageResponse.ok) {
      const error = await messageResponse.text();
      console.error('Failed to add message:', error);
      throw new Error('Failed to add message');
    }

    // Step 4: Run the assistant
    console.log('Running assistant...');
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: assistantId,
        additional_instructions: language === 'ru' 
          ? 'Отвечай на русском языке.' 
          : language === 'kk' 
          ? 'Қазақ тілінде жауап бер.' 
          : 'Reply in English.',
      }),
    });

    if (!runResponse.ok) {
      const error = await runResponse.text();
      console.error('Failed to run assistant:', error);
      throw new Error('Failed to run assistant');
    }

    const run = await runResponse.json();
    console.log('Run started:', run.id);

    // Step 5: Poll for completion
    let runStatus = run.status;
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds max wait

    while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        console.error('Failed to check run status:', error);
        throw new Error('Failed to check run status');
      }

      const statusData = await statusResponse.json();
      runStatus = statusData.status;
      attempts++;
      console.log(`Run status: ${runStatus} (attempt ${attempts})`);
    }

    if (runStatus !== 'completed') {
      throw new Error(`Run did not complete. Status: ${runStatus}`);
    }

    // Step 6: Get messages
    console.log('Fetching messages...');
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${currentThreadId}/messages?limit=1`, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'assistants=v2',
      },
    });

    if (!messagesResponse.ok) {
      const error = await messagesResponse.text();
      console.error('Failed to fetch messages:', error);
      throw new Error('Failed to fetch messages');
    }

    const messagesData = await messagesResponse.json();
    const assistantMessage = messagesData.data[0];
    
    if (!assistantMessage || assistantMessage.role !== 'assistant') {
      throw new Error('No assistant response found');
    }

    const responseText = assistantMessage.content[0]?.text?.value || 'Sorry, I could not generate a response.';
    console.log('Assistant response received');

    return new Response(JSON.stringify({ 
      response: responseText,
      threadId: currentThreadId,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-counselor function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
