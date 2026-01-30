import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { Recipe } from "../types/recipe";
import { IngredientTag } from "./IngredientTag";

type RecipeCardProps = {
  recipe: Recipe;
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <Text className="text-sm">
      {Array.from({ length: 5 }, (_, i) =>
        i < level ? "★" : "☆",
      ).join("")}
    </Text>
  );
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      onPress={() => setExpanded(!expanded)}
      className="mb-4 rounded-2xl bg-white p-5 shadow-sm"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-lg font-bold text-gray-900">
          {recipe.name}
        </Text>
        <Text className="ml-2 text-sm text-gray-400">
          {expanded ? "▲" : "▼"}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center gap-4">
        <View className="flex-row items-center">
          <DifficultyStars level={recipe.difficulty} />
        </View>
        <Text className="text-sm text-gray-500">
          {recipe.calories} cal
        </Text>
        <Text className="text-sm text-gray-500">{recipe.prepTime}</Text>
      </View>

      {expanded && (
        <View className="mt-4">
          <Text className="mb-2 text-base font-semibold text-gray-800">
            Ingredients
          </Text>
          <View className="flex-row flex-wrap">
            {recipe.ingredients.map((ingredient, index) => (
              <IngredientTag
                key={`${ingredient.name}-${index}`}
                name={ingredient.name}
                available={ingredient.available}
                quantity={ingredient.quantity}
              />
            ))}
          </View>

          <Text className="mb-2 mt-4 text-base font-semibold text-gray-800">
            Steps
          </Text>
          {recipe.steps.map((step, index) => (
            <View key={index} className="mb-2 flex-row">
              <Text className="mr-2 font-bold text-primary-600">
                {index + 1}.
              </Text>
              <Text className="flex-1 text-sm leading-5 text-gray-700">
                {step}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}
