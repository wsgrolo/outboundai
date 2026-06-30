import { z } from 'zod';

// Zod Schemas for structured outputs
export const ResearchDataSchema = z.object({
  prospect: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    recent_activity: z.array(z.string()),
    bio_summary: z.string(),
  }),
  company: z.object({
    name: z.string(),
    industry: z.string(),
    size: z.string(),
    funding: z.string(),
    recent_news: z.array(z.string()),
    pain_points: z.array(z.string()),
    value_proposition: z.string(),
  }),
  metadata: z.object({
    sources: z.array(z.string()),
  }),
});

export const EmailVariantsSchema = z.object({
  variants: z.array(z.object({
    type: z.enum(['cold_intro', 'value_prop', 'connection']),
    subject_lines: z.array(z.string()),
    body: z.string(),
    personalization_points: z.array(z.string()),
    angle_description: z.string(),
  })),
});

export const SubjectLinesSchema = z.object({
  subject_lines: z.array(z.string()),
});

export const EmailSequenceSchema = z.object({
  steps: z.array(z.object({
    step_number: z.number(),
    type: z.enum(['initial_outreach', 'value_reminder', 'social_proof', 'breakup']),
    subject: z.string(),
    body: z.string(),
    delay_days: z.number(),
    angle_description: z.string(),
  })),
});

export const RewrittenEmailSchema = z.object({
  rewritten_body: z.string(),
});

// Prompt Templates
export const RESEARCH_SYSTEM_PROMPT = `You are an expert sales researcher. Your goal is to extract high-signal sales data from the provided search results about a prospect and their company.
Your output must be a valid JSON object matching the requested schema.
If data is missing, provide a "best guess" based on industry standards and label it as "derived" within the string.`;

export const getResearchUserPrompt = (input: string) => `Research this prospect/company: ${input}
Provide structured information including prospect details, company firmographics, recent news, and potential pain points.`;

export const ANGLE_SYSTEM_PROMPT = `You are a strategic sales consultant. Given a prospect's profile and a seller's product, identify 3 distinct angles for a cold outreach campaign.
Angle 1: Focus on a recent company milestone.
Angle 2: Focus on the prospect's specific role challenges.
Angle 3: Focus on an industry trend the seller's product solves.`;

export const EMAIL_GEN_SYSTEM_PROMPT = `You are a top-tier SDR. Write a cold email that sounds like it was written by a human, not a bot.
Constraints:
- Length: < 120 words.
- Tone: Professional, slightly casual, direct.
- NO fluff: No "hope this finds you well," "my name is," or "I'm writing to."
- Structure: Hook (specific to research) -> Value Gap (the problem) -> Solution (brief) -> Soft CTA.
Provide 3 variants (cold_intro, value_prop, connection) with subject lines and the angles used.`;

export const getEmailGenUserPrompt = (researchData: any, sellerContext: any) => `
Research Data: ${JSON.stringify(researchData, null, 2)}
Seller Context: ${JSON.stringify(sellerContext, null, 2)}
Generate the email sequence.`;

export const SEQUENCE_GEN_SYSTEM_PROMPT = `You are a top-tier SDR manager. Your goal is to design a high-converting email outreach sequence of 3-5 emails.
Each email should have a different strategic angle:
- initial_outreach: A personal hook and brief value prop.
- value_reminder: A follow-up focusing on a specific pain point.
- social_proof: A case study or relevant industry success story.
- breakup: A final respectful email to close the loop.

Recommended delays: Day 1, Day 3, Day 7, Day 14.

Constraints:
- Tone: Professional, slightly casual, direct.
- NO fluff: No "hope this finds you well," "my name is," or "I'm writing to."
- Each email body < 120 words.
Your output must be a valid JSON object matching the requested schema.`;

export const getSequenceGenUserPrompt = (researchData: any, sellerContext: any) => `
Research Data: ${JSON.stringify(researchData, null, 2)}
Seller Context: ${JSON.stringify(sellerContext, null, 2)}
Generate a 3-5 step outreach sequence.`;

export const REWRITE_EMAIL_SYSTEM_PROMPT = `You are an expert editor. Rewrite the provided email body to match the requested tone while preserving all personalization details and the core call to action.
Tones:
- formal: Professional, polished, structured.
- casual: Friendly, conversational, approachable.
- aggressive: Bold, direct, high-urgency.
- friendly: Warm, helpful, empathetic.
- short: Concise, minimalist, to the point.

Constraints:
- Preserving personalization points (names, specific research details) is CRITICAL.
- Do not add fake information.
- The output should be just the rewritten email body wrapped in a JSON object.`;

export const getRewriteEmailUserPrompt = (emailBody: string, tone: string) => `
Email Body: ${emailBody}
Target Tone: ${tone}
Rewrite the email.`;

export const SUBJECT_LINE_SYSTEM_PROMPT = `Generate 5 subject line variants for the provided email.
Focus on: High open rates, curiosity, and relevance.
Avoid: Salesy words (free, offer, discount, help).
Variants should range from "Ultra-short (2 words)" to "Observation-based".`;

export const getSubjectLineUserPrompt = (emailBody: string, angleDescription?: string) => `
Email Body: ${emailBody}
${angleDescription ? `Angle Description: ${angleDescription}` : ''}
Generate 5 subject lines.`;
