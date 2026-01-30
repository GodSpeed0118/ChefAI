import { View, Text, ScrollView, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGenerateRecipes } from "../src/hooks/useGenerateRecipes";
import { LoadingState } from "../src/components/LoadingState";
import { ErrorState } from "../src/components/ErrorState";
import { RecipeCard } from "../src/components/RecipeCard";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function ResultsScreen() {
  const router = useRouter();
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

  return (
    <SafeAreaView className="flex-1 bg-primary-950">
      <StatusBar style="light" />

      {isLoading ? (
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
          {/* Header */}
          <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/10">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
            <Text className="text-xl font-black text-white italic">Suggested Cookbooks</Text>
            <Pressable
              onPress={() => router.push("/saved")}
              className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
            >
              <Ionicons name="heart-outline" size={22} color="white" />
            </Pressable>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Identified Ingredients Section */}
            <View className="px-6 pt-6 pb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xs font-black text-white/50 uppercase tracking-widest">
                  Identified Pantry
                </Text>
                <View className="bg-emerald-500/20 px-2 py-1 rounded-lg border border-emerald-500/30">
                  <Text className="text-emerald-400 text-xs font-black">{ingredients.length} Items</Text>
                </View>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row pb-2"
              >
                {ingredients.map((item, idx) => (
                  <View key={idx} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mr-3 items-center justify-center">
                    <Text className="text-white font-bold capitalize text-sm">{item}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Recipes Section */}
            <View className="px-6 pt-6 pb-20">
              <View className="flex-row items-center mb-6">
                <View className="w-2 h-6 bg-accent-500 rounded-full mr-3 shadow-sm" />
                <Text className="text-white text-2xl font-black">Ready for you</Text>
              </View>

              <View className="gap-6">
                {data?.recipes.map((recipe, index) => (
                  <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
                ))}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
