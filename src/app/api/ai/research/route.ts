import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/openai';
import {
  RESEARCH_SYSTEM_PROMPT,
  getResearchUserPrompt,
  ResearchDataSchema,
} from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linkedin_url, company_name, prospect_name, job_title } = body;

    const input = [
      linkedin_url && `LinkedIn: ${linkedin_url}`,
      company_name && `Company: ${company_name}`,
      prospect_name && `Name: ${prospect_name}`,
      job_title && `Title: ${job_title}`,
    ]
      .filter(Boolean)
      .join(', ');

    if (!input) {
      return NextResponse.json(
        { error: 'Missing research input' },
        { status: 400 }
      );
    }

    // In a production environment, we would fetch real-time search results here
    // using an API like Perplexity, Serper, or OpenAI Search.
    // For now, we rely on the LLM's knowledge and the provided input.
    
    const messages = [
      { role: 'system' as const, content: RESEARCH_SYSTEM_PROMPT },
      { role: 'user' as const, content: getResearchUserPrompt(input) },
    ];

    const result = await getChatCompletion(messages, { json: true });

    if (!result) {
      throw new Error('Failed to get research data from AI');
    }

    const parsedData = ResearchDataSchema.parse(JSON.parse(result));

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('AI Research Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
