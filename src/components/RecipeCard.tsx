import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { Recipe } from "../types/recipe";
import { IngredientTag } from "./IngredientTag";
import { Ionicons } from "@expo/vector-icons";

type RecipeCardProps = {
  recipe: Recipe;
};

function DifficultyStars({ level }: { level: number }) {
  return (
    <View className="flex-row">
      {Array.from({ length: 5 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < level ? "star" : "star-outline"}
          size={14}
          color={i < level ? "#d946ef" : "#cbd5e1"}
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-primary-100">
      <Pressable onPress={() => setExpanded(!expanded)} className="p-0 active:opacity-95">
        <View className="p-5">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-black text-primary-950 leading-8 mb-2">
                {recipe.name}
              </Text>
              <View className="flex-row items-center flex-wrap gap-2">
                <View className="bg-accent-50 px-3 py-1 rounded-full border border-accent-100">
                  <Text className="text-accent-600 text-[10px] font-black uppercase tracking-widest">{recipe.difficulty}</Text>
                </View>
                <View className="flex-row items-center ml-2">
                  <Ionicons name="flame" size={14} color="#6366f1" />
                  <Text className="ml-1 text-xs font-bold text-primary-400">{recipe.calories} kcal</Text>
                </View>
                <View className="flex-row items-center ml-2">
                  <Ionicons name="time" size={14} color="#64748b" />
                  <Text className="ml-1 text-xs font-bold text-primary-400">{recipe.prepTime}</Text>
                </View>
              </View>
            </View>
            <View className="w-12 h-12 rounded-full bg-primary-50 items-center justify-center">
              <Ionicons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={24}
                color={expanded ? "#6366f1" : "#94a3b8"}
              />
            </View>
          </View>

          {expanded && (
            <View className="mt-4 pt-6 border-t border-primary-50">
              {/* Ingredients */}
              <View className="mb-8">
                <Text className="text-xs font-black text-primary-300 uppercase tracking-widest mb-4">
                  What you'll need
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
              </View>

              {/* Steps */}
              <View className="mb-6">
                <Text className="text-xs font-black text-primary-300 uppercase tracking-widest mb-4">
                  Preparation
                </Text>
                {recipe.steps.map((step, index) => (
                  <View key={index} className="mb-5 flex-row">
                    <View className="w-8 h-8 rounded-xl bg-primary-950 items-center justify-center mr-4 mt-0.5 shadow-sm">
                      <Text className="text-white text-xs font-black">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 text-base leading-6 text-primary-900 font-medium">
                      {step}
                    </Text>
                  </View>
                ))}
              </View>

              <Pressable
                className="bg-emerald-500 rounded-3xl py-5 items-center justify-center shadow-lg active:bg-emerald-600 active:scale-[0.98]"
                onPress={() => {/* In a real app, this would start cooking mode */ }}
              >
                <Text className="text-white font-black text-xl tracking-tight">Start Cooking</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
}
