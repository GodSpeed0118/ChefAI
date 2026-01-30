import { useQuery } from "@tanstack/react-query";
import { generateRecipes } from "../services/ai";

export function useGenerateRecipes(ingredients: string[]) {
  return useQuery({
    queryKey: ["recipes", ...ingredients.sort()],
    queryFn: async () => {
      const result = await generateRecipes(ingredients);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    },
    enabled: ingredients.length > 0,
  });
}
