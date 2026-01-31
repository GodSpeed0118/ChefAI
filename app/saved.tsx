import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoadingState } from "../src/components/LoadingState";
import { RecipeCard } from "../src/components/RecipeCard";
import { useSavedRecipes } from "../src/hooks/useSavedRecipes";
import { Gradients } from "../src/theme/Gradients";

export default function SavedRecipesScreen() {
    const router = useRouter();
    const { savedRecipes, isLoading } = useSavedRecipes();

    if (isLoading) {
        return <LoadingState message="Loading your favorites..." />;
    }

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
                    <Text className="text-xl font-black text-white italic tracking-tight">Saved <Text className="text-accent-500">Cookbook</Text></Text>
                    <View className="w-11" />
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}
                >
                    {savedRecipes.length === 0 ? (
                        <View className="flex-1 items-center justify-center pt-32">
                            <View className="w-24 h-24 bg-white/5 rounded-[32px] items-center justify-center mb-6 border border-white/10">
                                <Ionicons name="heart" size={40} color="rgba(255,255,255,0.1)" />
                            </View>
                            <Text className="text-2xl font-black text-white text-center mb-2">Empty Cookbook</Text>
                            <Text className="text-white/40 text-center leading-6 max-w-[250px] font-medium">
                                Your favorite recipes will appear here once you save them.
                            </Text>
                        </View>
                    ) : (
                        <View className="pt-2">
                            {savedRecipes.map((recipe, index) => (
                                <RecipeCard key={`${recipe.name}-${index}`} recipe={recipe} />
                            ))}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    // Add custom styles if needed
});
