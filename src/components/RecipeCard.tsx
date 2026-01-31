import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSavedRecipes } from "../hooks/useSavedRecipes";
import { Colors } from "../theme/Colors";
import { Typography } from "../theme/Typography";
import type { Recipe } from "../types/recipe";
import { GlassCard } from "./common/GlassCard";
import { GradientButton } from "./common/GradientButton";
import { IngredientTag } from "./IngredientTag";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { isSaved, toggleSave } = useSavedRecipes();
  const saved = isSaved(recipe.name);
  const router = useRouter();

  const usedCount = recipe.ingredients.filter(i => i.available).length;
  const totalCount = recipe.ingredients.length;

  const navigateToDetail = () => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.name, recipe: JSON.stringify(recipe) }
    });
  };

  return (
    <GlassCard intensity={20} style={styles.card}>
      <Pressable onPress={() => setExpanded(!expanded)} className="p-5">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 pr-4">
            <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white leading-8 mb-2">
              {recipe.name}
            </Text>

            <View className="flex-row items-center flex-wrap gap-2 mb-3">
              {recipe.dietType && (
                <View className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                  <Text className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{recipe.dietType}</Text>
                </View>
              )}
              <View className="flex-row items-center">
                <Ionicons name="flame" size={14} color={Colors.accent[500]} />
                <Text style={{ fontSize: Typography.size.tiny }} className="ml-1 font-bold text-white/60">{recipe.calories} kcal</Text>
              </View>
              <View className="flex-row items-center ml-2">
                <Ionicons name="time" size={14} color="#94a3b8" />
                <Text style={{ fontSize: Typography.size.tiny }} className="ml-1 font-bold text-white/60">{recipe.prepTime}</Text>
              </View>
            </View>

            <View className="flex-row items-center mb-3">
              <View className="bg-white/5 py-1 px-3 rounded-lg border border-white/10 flex-row items-center">
                <View className={`w-1.5 h-1.5 rounded-full mr-2 ${usedCount === totalCount ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <Text style={{ fontSize: Typography.size.tiny }} className="text-white/60 font-black uppercase tracking-widest">
                  {usedCount}/{totalCount} Ingredients
                </Text>
              </View>
            </View>

            {recipe.macros && (
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center">
                  <View className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5" />
                  <Text style={{ fontSize: 9 }} className="font-bold text-white/30 uppercase">P: <Text className="text-white/70">{recipe.macros.protein}</Text></Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-1 h-1 rounded-full bg-amber-500 mr-1.5" />
                  <Text style={{ fontSize: 9 }} className="font-bold text-white/30 uppercase">C: <Text className="text-white/70">{recipe.macros.carbs}</Text></Text>
                </View>
                <View className="flex-row items-center">
                  <View className="w-1 h-1 rounded-full bg-rose-500 mr-1.5" />
                  <Text style={{ fontSize: 9 }} className="font-bold text-white/30 uppercase">F: <Text className="text-white/70">{recipe.macros.fat}</Text></Text>
                </View>
              </View>
            )}
          </View>
          <View className="w-10 h-10 rounded-2xl bg-white/5 items-center justify-center border border-white/10">
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="white"
            />
          </View>
        </View>

        {expanded && (
          <View className="mt-4 pt-6 border-t border-white/10">
            {/* Ingredients */}
            <View className="mb-8">
              <Text className="text-[10px] font-black text-accent-400 uppercase tracking-[2px] mb-4">
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
            <View className="mb-8">
              <Text className="text-[10px] font-black text-accent-400 uppercase tracking-[2px] mb-4">
                Preparation
              </Text>
              {recipe.steps.map((step, index) => (
                <View key={index} className="mb-5 flex-row">
                  <View className="w-7 h-7 rounded-lg bg-accent-500 items-center justify-center mr-4 mt-0.5">
                    <Text className="text-white text-xs font-black">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="flex-1 text-[15px] leading-6 text-white/80 font-medium">
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <GradientButton
                  title="Cook with AI"
                  onPress={navigateToDetail}
                  icon={<Ionicons name="restaurant" size={20} color="white" />}
                />
              </View>
              <Pressable
                onPress={() => toggleSave(recipe)}
                className={`w-16 h-16 rounded-2xl items-center justify-center border transition-all ${saved ? 'bg-rose-500/20 border-rose-500/30' : 'bg-white/5 border-white/10'}`}
              >
                <Ionicons name={saved ? "heart" : "heart-outline"} size={24} color={saved ? Colors.rose[500] : "white"} />
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 0,
  }
});
