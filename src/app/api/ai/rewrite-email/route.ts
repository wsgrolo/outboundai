import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/openai';
import {
  REWRITE_EMAIL_SYSTEM_PROMPT,
  getRewriteEmailUserPrompt,
  RewrittenEmailSchema,
} from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email_body, tone } = body;

    if (!email_body || !tone) {
      return NextResponse.json(
        { error: 'Missing email_body or tone' },
        { status: 400 }
      );
    }

    const messages = [
      { role: 'system' as const, content: REWRITE_EMAIL_SYSTEM_PROMPT },
      { role: 'user' as const, content: getRewriteEmailUserPrompt(email_body, tone) },
    ];

    const result = await getChatCompletion(messages, { json: true });

    if (!result) {
      throw new Error('Failed to rewrite email from AI');
    }

    const parsedData = RewrittenEmailSchema.parse(JSON.parse(result));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('AI Email Rewrite Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
