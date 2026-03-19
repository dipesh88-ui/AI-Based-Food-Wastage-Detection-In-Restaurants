'use server';
/**
 * @fileOverview Summarizes weekly waste data to provide restaurant managers with a concise overview.
 *
 * - summarizeWeeklyWasteData - A function that takes weekly waste data and returns a summary.
 * - SummarizeWeeklyWasteDataInput - The input type for the summarizeWeeklyWasteData function.
 * - SummarizeWeeklyWasteDataOutput - The return type for the summarizeWeeklyWasteData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWeeklyWasteDataInputSchema = z.object({
  weeklyWasteData: z
    .string()
    .describe(
      'A string containing the weekly waste data, including types and amounts of wasted food.'
    ),
});
export type SummarizeWeeklyWasteDataInput = z.infer<typeof SummarizeWeeklyWasteDataInputSchema>;

const SummarizeWeeklyWasteDataOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the weekly waste data, highlighting key trends and areas of concern.'
    ),
});
export type SummarizeWeeklyWasteDataOutput = z.infer<typeof SummarizeWeeklyWasteDataOutputSchema>;

export async function summarizeWeeklyWasteData(
  input: SummarizeWeeklyWasteDataInput
): Promise<SummarizeWeeklyWasteDataOutput> {
  return summarizeWeeklyWasteDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeWeeklyWasteDataPrompt',
  input: {schema: SummarizeWeeklyWasteDataInputSchema},
  output: {schema: SummarizeWeeklyWasteDataOutputSchema},
  prompt: `You are an AI assistant for restaurant managers. Your task is to summarize the weekly waste data provided to you in a concise and understandable format. Highlight key trends and areas of concern so the manager can quickly grasp the overall waste situation and make informed decisions. Make sure to focus on the most important points, and keep it brief.

Weekly Waste Data: {{{weeklyWasteData}}}`,
});

const summarizeWeeklyWasteDataFlow = ai.defineFlow(
  {
    name: 'summarizeWeeklyWasteDataFlow',
    inputSchema: SummarizeWeeklyWasteDataInputSchema,
    outputSchema: SummarizeWeeklyWasteDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
