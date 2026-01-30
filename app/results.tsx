import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useGenerateRecipes } from "../src/hooks/useGenerateRecipes";
import { LoadingState } from "../src/components/LoadingState";
import { ErrorState } from "../src/components/ErrorState";
import { RecipeCard } from "../src/components/RecipeCard";

export default function ResultsScreen() {
  const { ingredients: ingredientsParam } = useLocalSearchParams<{
    ingredients: string;
  }>();

  let ingredients: string[] = [];
  try {
    ingredients = JSON.parse(ingredientsParam ?? "[]");
  } catch {
    ingredients = [];
  }

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGenerateRecipes(ingredients);

  if (ingredients.length === 0) {
    return (
      <ErrorState message="No ingredients found. Please go back and try again." />
    );
  }

  if (isLoading) {
    return (
      <LoadingState message="Generating recipes from your ingredients..." />
    );
  }

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? "Failed to generate recipes"}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 pt-4">
      <Text className="mb-1 text-lg font-bold text-gray-900">
        Found {ingredients.length} ingredients
      </Text>
      <Text className="mb-4 text-sm text-gray-500">
        {ingredients.join(", ")}
      </Text>

      <Text className="mb-3 text-lg font-bold text-gray-900">
        Suggested Recipes
      </Text>
      {data?.recipes.map((recipe, index) => (
        <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
      ))}

      <View className="h-8" />
    </ScrollView>
  );
}
