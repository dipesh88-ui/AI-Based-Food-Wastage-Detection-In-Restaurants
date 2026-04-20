import Groq from 'groq-sdk';

export interface SummarizeWeeklyWasteDataInput {
  weeklyWasteData: string;
}

export interface SummarizeWeeklyWasteDataOutput {
  summary: string;
}

export async function summarizeWeeklyWasteData(
  input: SummarizeWeeklyWasteDataInput
): Promise<SummarizeWeeklyWasteDataOutput> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
  if (!apiKey || apiKey === 'INSERT_YOUR_GROQ_API_KEY_HERE') {
    return {
      summary: "This is a mocked summary of your weekly waste data. Overall, food waste has slightly increased. Focus on reducing vegetable and rice wastage this week."
    };
  }
  const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });
  
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are an AI assistant for restaurant managers. Your task is to summarize the weekly waste data provided to you in a concise and understandable format. Highlight key trends and areas of concern so the manager can quickly grasp the overall waste situation and make informed decisions. Make sure to focus on the most important points, and keep it brief. Ensure your output is a JSON object with a single "summary" key.

Weekly Waste Data: ${input.weeklyWasteData}`
      }
    ],
    response_format: { type: 'json_object' }
  });

  const text = response.choices[0]?.message?.content;
  if (!text) {
    throw new Error('No response from Groq');
  }

  return JSON.parse(text) as SummarizeWeeklyWasteDataOutput;
}
