import OpenAI from 'openai';

const getApiKey = () => {
  const key = process.env.OPENAI_API_KEY;
  if (!key && process.env.NODE_ENV === 'production') {
    // Only warn during build if key is missing, unless we are actually running
    console.warn('Warning: OPENAI_API_KEY is not set');
  }
  return key || 'dummy-key';
};

export const openai = new OpenAI({
  apiKey: getApiKey(),
});

export async function getChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: {
    model?: string;
    json?: boolean;
    temperature?: number;
  } = {}
) {
  const { model = 'gpt-4o', json = false, temperature = 0.7 } = options;

  const response = await openai.chat.completions.create({
    model,
    messages,
    response_format: json ? { type: 'json_object' } : undefined,
    temperature,
  });

  return response.choices[0].message.content;
}
