import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/openai';
import {
  SUBJECT_LINE_SYSTEM_PROMPT,
  getSubjectLineUserPrompt,
  SubjectLinesSchema,
} from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email_body, angle_description } = body;

    if (!email_body) {
      return NextResponse.json(
        { error: 'Missing email_body' },
        { status: 400 }
      );
    }

    const messages = [
      { role: 'system' as const, content: SUBJECT_LINE_SYSTEM_PROMPT },
      { role: 'user' as const, content: getSubjectLineUserPrompt(email_body, angle_description) },
    ];

    const result = await getChatCompletion(messages, { json: true });

    if (!result) {
      throw new Error('Failed to generate subject lines from AI');
    }

    const parsedData = SubjectLinesSchema.parse(JSON.parse(result));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('AI Subject Gen Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
