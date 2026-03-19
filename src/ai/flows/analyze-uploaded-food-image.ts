'use server';
/**
 * @fileOverview AI flow for analyzing uploaded food images to identify the type and estimate the quantity of food wasted.
 *
 * - analyzeUploadedFoodImage - A function that handles the analysis of uploaded food images.
 * - AnalyzeUploadedFoodImageInput - The input type for the analyzeUploadedFoodImage function.
 * - AnalyzeUploadedFoodImageOutput - The return type for the analyzeUploadedFoodImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedFoodImageInputSchema = z.object({
  foodImageDataUri: z
    .string()
    .describe(
      "A photo of leftover food, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeUploadedFoodImageInput = z.infer<typeof AnalyzeUploadedFoodImageInputSchema>;

const AnalyzeUploadedFoodImageOutputSchema = z.object({
  foodWasteAnalysis: z.object({
    foodType: z.string().describe('The type of food wasted (e.g., rice, meat, vegetables).'),
    estimatedQuantity: z.string().describe('The estimated quantity of food wasted in grams (e.g., "50g", "200g").'),
  }).describe('Analysis of the food waste in the image.'),
});
export type AnalyzeUploadedFoodImageOutput = z.infer<typeof AnalyzeUploadedFoodImageOutputSchema>;

export async function analyzeUploadedFoodImage(input: AnalyzeUploadedFoodImageInput): Promise<AnalyzeUploadedFoodImageOutput> {
  return analyzeUploadedFoodImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUploadedFoodImagePrompt',
  input: {schema: AnalyzeUploadedFoodImageInputSchema},
  output: {schema: AnalyzeUploadedFoodImageOutputSchema},
  prompt: `You are an AI expert in food waste analysis. You will analyze the image of leftover food and identify the type and estimate the quantity of food wasted.

  Analyze the following image and provide the type of food wasted and the estimated quantity in grams.

  Image: {{media url=foodImageDataUri}}

  Ensure your response is formatted as a JSON object that adheres to the AnalyzeUploadedFoodImageOutputSchema with fields for foodType and estimatedQuantity. The estimatedQuantity must be a string ending with 'g' (e.g. "150g").`,
});

const analyzeUploadedFoodImageFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedFoodImageFlow',
    inputSchema: AnalyzeUploadedFoodImageInputSchema,
    outputSchema: AnalyzeUploadedFoodImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
