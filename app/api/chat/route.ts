import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '@/lib/agent/prompt';
import { classifySituation } from '@/lib/agent/tools';
import { searchLaw } from '@/lib/rag';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
  conversationId: z.string().uuid().optional().nullable(),
  category: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
});

// Models prioritized by proven reliability and zero 503 rates
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
];

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parsed = chatSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { message, conversationId, category: rawCat, language } = parsed.data;

    // 1. Situation Analysis & Classification
    const classified = classifySituation(message);
    const category = rawCat || classified.category;

    // 2. Auth & User check
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // Guest demo permitted
    }

    // 3. RAG Retrieval over Pakistani law
    const legalMatches = await searchLaw(message, category);

    const contextText = legalMatches
      .map(
        (m, idx) =>
          `[Source ${idx + 1}: ${m.law_name} - ${m.section}]\n${m.content}`
      )
      .join('\n\n');

    // 4. Initialize Gemini
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service configuration error: missing API key' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const userPrompt = `
USER QUERY:
${message}

DETECTED SITUATION CATEGORY: ${category.toUpperCase()}
USER LANGUAGE / PREFERENCE: ${language || 'Auto-detect (respond in matching language)'}

GROUNDED PAKISTANI LEGAL STATUTES & PRECEDENTS:
${contextText || 'No specific statute retrieved; provide general constitutional rights and safe guidance under Pakistani jurisdiction.'}

INSTRUCTION:
Generate a personalized, intelligent 7-section Action Brief strictly addressing the user's specific facts above. Ground all legal statements in real Pakistani statutes (PPC, CrPC, PECA, Constitution). Never give a generic or unrelated response. Cite the exact laws and sections.
`;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let succeeded = false;
        let lastErrorMsg = '';

        for (const modelName of CANDIDATE_MODELS) {
          if (succeeded) break;

          for (let attempt = 1; attempt <= 2; attempt++) {
            try {
              const model = genAI.getGenerativeModel({
                model: modelName,
                systemInstruction: SYSTEM_PROMPT,
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 2048,
                },
              });

              // Attempt streaming first
              try {
                const resultStream = await model.generateContentStream(userPrompt);
                let emitted = false;

                for await (const chunk of resultStream.stream) {
                  const text = chunk.text();
                  if (text) {
                    controller.enqueue(encoder.encode(text));
                    emitted = true;
                  }
                }

                if (emitted) {
                  succeeded = true;
                  break;
                }
              } catch (streamErr: any) {
                // If SSE streaming failed due to 503, fallback to non-streaming generateContent
                const nonStreamRes = await model.generateContent(userPrompt);
                const fullText = nonStreamRes.response.text();
                if (fullText) {
                  controller.enqueue(encoder.encode(fullText));
                  succeeded = true;
                  break;
                }
              }
            } catch (err: any) {
              lastErrorMsg = err.message || 'Model error';
              console.warn(`Model ${modelName} attempt ${attempt} failed:`, lastErrorMsg);
              await new Promise((r) => setTimeout(r, 600));
            }
          }
        }

        if (!succeeded) {
          // Do NOT return a fake template! Return an honest error message.
          controller.enqueue(
            encoder.encode(
              `## ⚠️ Service Temporarily Busy\n\nOur AI legal engine is currently experiencing high demand. Please click the button below to retry your specific question: "${message}".\n\n*Error details: ${lastErrorMsg}*`
            )
          );
        }

        controller.close();
      },
    });

    // Save message asynchronously if user is authenticated
    if (userId && conversationId) {
      (async () => {
        try {
          const admin = createAdminClient();
          await admin.from('messages').insert({
            conversation_id: conversationId,
            user_id: userId,
            role: 'user',
            content: message,
          });
        } catch (dbErr) {
          console.error('Failed to log message to DB:', dbErr);
        }
      })();
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Detected-Category': category,
        'X-Sources-Count': String(legalMatches.length),
        'X-Legal-Sources': encodeURIComponent(
          JSON.stringify(
            legalMatches.map((m) => ({
              law_name: m.law_name,
              section: m.section,
              similarity: m.similarity,
            }))
          )
        ),
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
