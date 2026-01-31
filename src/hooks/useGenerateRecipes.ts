import { useQuery } from "@tanstack/react-query";
import { generateRecipes } from "../services/ai";

export function useGenerateRecipes(
  ingredients: string[],
  filters?: {
    dietType?: string;
    maxCalories?: number;
    maxTime?: string;
  }
) {
  return useQuery({
    queryKey: ["recipes", ...ingredients.sort(), JSON.stringify(filters || {})],
    queryFn: async () => {
      const result = await generateRecipes(ingredients, filters);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: ingredients.length > 0,
  });
}
