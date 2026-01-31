import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { FilterChips } from "../src/components/common/FilterChips";
import { ErrorState } from "../src/components/ErrorState";
import { LoadingState } from "../src/components/LoadingState";
import { RecipeCard } from "../src/components/RecipeCard";
import { useGenerateRecipes } from "../src/hooks/useGenerateRecipes";
import { Colors } from "../src/theme/Colors";
import { Gradients } from "../src/theme/Gradients";
import { Spacing } from "../src/theme/Spacing";
import { Typography } from "../src/theme/Typography";

const DIET_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'keto', label: 'Keto' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'diabetic', label: 'Diabetic Friendly' },
  { id: 'high-protein', label: 'High Protein' },
];

export default function ResultsScreen() {
  const router = useRouter();
  const { ingredients: ingredientsParam } = useLocalSearchParams<{
    ingredients: string;
  }>();

  const [dietType, setDietType] = useState('all');

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
    isRefetching
  } = useGenerateRecipes(ingredients, {
    dietType: dietType === 'all' ? undefined : dietType,
  });

  return (
    <View className="flex-1 bg-primary-950">
      <LinearGradient
        colors={Gradients.background as any}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />

        {/* Header */}
        <View className="px-6 py-6 flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10 active:bg-white/10"
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </Pressable>
          <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tight">AI <Text className="text-accent-500">Suggestions</Text></Text>
          <View className="w-11" />
        </View>

        {isLoading && !isRefetching ? (
          <LoadingState message="Creating recipe magic... This will only take a moment." />
        ) : isError ? (
          <ErrorState
            message={error?.message ?? "Failed to generate recipes"}
            onRetry={() => refetch()}
          />
        ) : ingredients.length === 0 ? (
          <ErrorState message="No ingredients found. Please go back and try again." />
        ) : (
          <>
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Filters */}
              <Animated.View entering={FadeInDown.delay(200)}>
                <FilterChips
                  label="Dietary Focus"
                  options={DIET_OPTIONS}
                  selectedId={dietType}
                  onSelect={setDietType}
                />
              </Animated.View>

              {/* Identified Ingredients Section */}
              <View className="px-6 pt-2 pb-4">
                <View className="flex-row items-center mb-4">
                  <Text style={{ fontSize: Typography.size.tiny, letterSpacing: Typography.tracking.widest }} className="font-black text-white/40 uppercase">
                    Identified Items
                  </Text>
                  <View className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 ml-2">
                    <Text className="text-emerald-400 text-[10px] font-black">{ingredients.length} items</Text>
                  </View>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  {ingredients.map((item, idx) => (
                    <View key={idx} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mr-3 flex-row items-center">
                      <View className="w-1.5 h-1.5 rounded-full bg-accent-500/60 mr-2" />
                      <Text style={{ fontSize: Typography.size.sm }} className="text-white/80 font-bold capitalize">{item}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* Recipes Section */}
              <View className="px-6 pt-6 pb-20">
                <View className="flex-row items-center mb-6">
                  <View className="w-10 h-10 rounded-2xl bg-accent-500/20 items-center justify-center border border-accent-500/30 mr-4">
                    <Ionicons name="sparkles" size={20} color={Colors.accent[500]} />
                  </View>
                  <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tighter">
                    {isRefetching ? "Updating choices..." : "Ready for you."}
                  </Text>
                </View>

                {isRefetching ? (
                  <View className="py-20">
                    <LoadingState message="Refining recipes..." />
                  </View>
                ) : (
                  <View style={{ gap: Spacing.md }}>
                    {data?.recipes.map((recipe, index) => (
                      <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
