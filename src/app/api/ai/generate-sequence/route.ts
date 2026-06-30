import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/openai';
import {
  SEQUENCE_GEN_SYSTEM_PROMPT,
  getSequenceGenUserPrompt,
  EmailSequenceSchema,
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

    const messages = [
      { role: 'system' as const, content: SEQUENCE_GEN_SYSTEM_PROMPT },
      { role: 'user' as const, content: getSequenceGenUserPrompt(research_data, seller_context) },
    ];

    const result = await getChatCompletion(messages, { json: true });

    if (!result) {
      throw new Error('Failed to generate sequence from AI');
    }

    const parsedData = EmailSequenceSchema.parse(JSON.parse(result));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('AI Sequence Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
