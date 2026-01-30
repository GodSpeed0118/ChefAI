import { callOpenAI } from "../lib/openai";
import {
  IdentifiedIngredientsSchema,
  RecipeResponseSchema,
  type IdentifiedIngredients,
  type RecipeResponse,
} from "../types/recipe";
import type { ApiResult } from "../types/api";

export async function analyzeImage(
  base64: string,
  mimeType: string,
): Promise<ApiResult<IdentifiedIngredients>> {
  try {
    const rawResponse = await callOpenAI({
      model: "gpt-4o",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content:
            "You are a food identification expert. Analyze the image of a fridge or food items and identify all visible food ingredients. Return ONLY valid JSON with no additional text.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
            {
              type: "text",
              text: 'Identify all food items visible in this image. Return a JSON object with a single key "ingredients" containing an array of ingredient name strings. Example: {"ingredients": ["eggs", "milk", "butter", "spinach"]}',
            },
          ],
        },
      ],
    });

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "Could not parse JSON from response" };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = IdentifiedIngredientsSchema.parse(parsed);
    return { success: true, data: validated };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: message };
  }
}

export async function generateRecipes(
  ingredients: string[],
): Promise<ApiResult<RecipeResponse>> {
  try {
    const rawResponse = await callOpenAI({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content:
            "You are a professional chef and recipe creator. Generate recipes based on available ingredients. Return ONLY valid JSON with no additional text.",
        },
        {
          role: "user",
          content: `Given these available ingredients: ${JSON.stringify(ingredients)}

Generate 3-5 recipes that primarily use these ingredients. For each recipe, provide:
- name: the recipe name
- difficulty: 1-5 scale (1=easy, 5=expert)
- calories: estimated total calories
- prepTime: estimated preparation + cooking time (e.g. "30 mins", "1 hour")
- ingredients: array of objects with "name" (string), "quantity" (string, optional), and "available" (boolean - true if in the provided list)
- steps: array of step-by-step cooking instructions

Return a JSON object with a single key "recipes" containing the array of recipes.
Example format:
{
  "recipes": [
    {
      "name": "Simple Omelette",
      "difficulty": 1,
      "calories": 350,
      "prepTime": "15 mins",
      "ingredients": [
        {"name": "eggs", "quantity": "3 large", "available": true},
        {"name": "salt", "available": false}
      ],
      "steps": ["Crack eggs into a bowl...", "Heat a pan..."]
    }
  ]
}`,
        },
      ],
    });

    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "Could not parse JSON from response" };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = RecipeResponseSchema.parse(parsed);
    return { success: true, data: validated };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: message };
  }
}
