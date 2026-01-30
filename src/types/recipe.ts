import { z } from "zod";

export const IngredientSchema = z.object({
  name: z.string(),
  quantity: z.string().optional(),
  available: z.boolean(),
});

export type Ingredient = z.infer<typeof IngredientSchema>;

export const IdentifiedIngredientsSchema = z.object({
  ingredients: z.array(z.string()),
});

export type IdentifiedIngredients = z.infer<typeof IdentifiedIngredientsSchema>;

export const RecipeSchema = z.object({
  name: z.string(),
  difficulty: z.number().min(1).max(5),
  calories: z.number(),
  prepTime: z.string(),
  ingredients: z.array(IngredientSchema),
  steps: z.array(z.string()),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipeResponseSchema = z.object({
  recipes: z.array(RecipeSchema).min(1).max(5),
});

export type RecipeResponse = z.infer<typeof RecipeResponseSchema>;
