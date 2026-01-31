import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { RecipeCard } from "../src/components/RecipeCard";
import { useSavedRecipes } from "../src/hooks/useSavedRecipes";
import { LoadingState } from "../src/components/LoadingState";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedRecipesScreen() {
    const router = useRouter();
    const { savedRecipes, isLoading } = useSavedRecipes();

    if (isLoading) {
        return <LoadingState message="Loading your favorites..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-primary-950">
            <StatusBar style="light" />

            {/* Header */}
            <View className="px-6 py-4 flex-row items-center justify-between border-b border-white/10">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </Pressable>
                <Text className="text-xl font-black text-white italic">Saved Cookbooks</Text>
                <View className="w-10" /> {/* Spacer */}
            </View>

            <ScrollView
                className="flex-1 px-6 pt-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {savedRecipes.length === 0 ? (
                    <View className="flex-1 items-center justify-center pt-20">
                        <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center mb-6">
                            <Ionicons name="heart-outline" size={40} color="rgba(255,255,255,0.3)" />
                        </View>
                        <Text className="text-xl font-bold text-white text-center mb-2">No saved recipes yet</Text>
                        <Text className="text-white/50 text-center leading-6 max-w-[250px]">
                            Tap the heart icon on any recipe to save it for later.
                        </Text>
                    </View>
                ) : (
                    savedRecipes.map((recipe, index) => (
                        <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
