import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/openai';
import {
  ANGLE_SYSTEM_PROMPT,
  EMAIL_GEN_SYSTEM_PROMPT,
  getEmailGenUserPrompt,
  EmailVariantsSchema,
} from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { research_data, seller_context } = body;

    if (!research_data || !seller_context) {
      return NextResponse.json(
        { error: 'Missing research_data or seller_context' },
        { status: 400 }
      );
    }

    // Step 1: Angle Identification (Internal step, or integrated into the generation prompt)
    // For efficiency, we can combine Angle generation and Email generation in one prompt
    // but the system prompt already mentions angles.

    const messages = [
      { role: 'system' as const, content: `${ANGLE_SYSTEM_PROMPT}\n\n${EMAIL_GEN_SYSTEM_PROMPT}` },
      { role: 'user' as const, content: getEmailGenUserPrompt(research_data, seller_context) },
    ];

    const result = await getChatCompletion(messages, { json: true });

    if (!result) {
      throw new Error('Failed to generate emails from AI');
    }

    const parsedData = EmailVariantsSchema.parse(JSON.parse(result));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
