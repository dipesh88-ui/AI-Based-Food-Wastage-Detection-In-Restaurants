'use server';

/**
 * @fileOverview Generates personalized tips for reducing food waste based on restaurant's waste analytics.
 *
 * - generateWasteReductionTips - A function that generates waste reduction tips.
 * - WasteReductionTipsInput - The input type for the generateWasteReductionTips function.
 * - WasteReductionTipsOutput - The return type for the generateWasteReductionTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WasteReductionTipsInputSchema = z.object({
  wasteAnalytics: z
    .string()
    .describe(
      'Waste analytics data for the restaurant, including types and quantities of food wasted (e.g., daily, weekly, monthly data).'
    ),
  restaurantType: z.string().describe('Type of the restaurant (e.g., Italian, Chinese, Fast Food).'),
  menuItems: z.string().describe('List of menu items offered by the restaurant.'),
});
export type WasteReductionTipsInput = z.infer<typeof WasteReductionTipsInputSchema>;

const WasteReductionTipsOutputSchema = z.object({
  tips: z.array(z.string()).describe('Personalized tips for reducing food waste in the restaurant.'),
});
export type WasteReductionTipsOutput = z.infer<typeof WasteReductionTipsOutputSchema>;

export async function generateWasteReductionTips(
  input: WasteReductionTipsInput
): Promise<WasteReductionTipsOutput> {
  return generateWasteReductionTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'wasteReductionTipsPrompt',
  input: {schema: WasteReductionTipsInputSchema},
  output: {schema: WasteReductionTipsOutputSchema},
  prompt: `You are an expert in food waste reduction for restaurants. Based on the provided waste analytics, restaurant type and menu items, generate personalized tips for the restaurant to reduce food waste.

Waste Analytics: {{{wasteAnalytics}}}
Restaurant Type: {{{restaurantType}}}
Menu Items: {{{menuItems}}}

Provide specific and actionable tips that the restaurant can implement immediately. Focus on solutions tailored to their specific situation.

Tips should be clear, concise, and easy to understand. The tips should be returned as an array of strings.

Example:
[
  "Reduce portion sizes for dishes with high wastage.",
  "Implement a FIFO (First In, First Out) system for food storage.",
  "Offer discounts on nearing expiry date items.",
  "Compost food waste."
]
`,
});

const generateWasteReductionTipsFlow = ai.defineFlow(
  {
    name: 'generateWasteReductionTipsFlow',
    inputSchema: WasteReductionTipsInputSchema,
    outputSchema: WasteReductionTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
