import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassCard } from "../../src/components/common/GlassCard";
import { IngredientTag } from "../../src/components/IngredientTag";
import { Colors } from "../../src/theme/Colors";
import { Gradients } from "../../src/theme/Gradients";
import { Typography } from "../../src/theme/Typography";
import type { Recipe } from "../../src/types/recipe";

export default function RecipeScreen() {
    const router = useRouter();
    const { recipe: recipeParam } = useLocalSearchParams<{ recipe: string }>();
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    if (!recipeParam) return null;

    const recipe: Recipe = JSON.parse(recipeParam);

    const toggleStep = (index: number) => {
        if (completedSteps.includes(index)) {
            setCompletedSteps(completedSteps.filter(i => i !== index));
        } else {
            setCompletedSteps([...completedSteps, index]);
        }
    };

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
                    <Text style={{ fontSize: Typography.size.md, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tighter uppercase opacity-40">
                        Cooking Mode
                    </Text>
                    <View className="w-11" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Hero Section */}
                    <Animated.View entering={FadeInUp} className="px-6 mb-8">
                        <Text style={{ fontSize: Typography.size.huge, fontWeight: Typography.weight.black as any }} className="text-white leading-tight mb-4">
                            {recipe.name}
                        </Text>

                        <View className="flex-row items-center flex-wrap gap-3">
                            {recipe.dietType && (
                                <View className="bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/30">
                                    <Text className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{recipe.dietType}</Text>
                                </View>
                            )}
                            <View className="flex-row items-center bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                <Ionicons name="flame" size={14} color={Colors.accent[500]} />
                                <Text style={{ fontSize: Typography.size.tiny }} className="ml-2 font-bold text-white/60">{recipe.calories} kcal</Text>
                            </View>
                            <View className="flex-row items-center bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                <Ionicons name="time" size={14} color="#94a3b8" />
                                <Text style={{ fontSize: Typography.size.tiny }} className="ml-2 font-bold text-white/60">{recipe.prepTime}</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Nutrition Stats */}
                    {recipe.macros && (
                        <Animated.View entering={FadeInDown.delay(200)} className="px-6 mb-10">
                            <GlassCard intensity={15} style={{ padding: 20 }}>
                                <Text style={{ fontSize: Typography.size.tiny, letterSpacing: Typography.tracking.widest }} className="text-white/30 font-black uppercase mb-4 text-center">Nutritional Breakdown</Text>
                                <View className="flex-row justify-around">
                                    <View className="items-center">
                                        <Text className="text-emerald-400 text-lg font-black">{recipe.macros.protein}</Text>
                                        <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Protein</Text>
                                    </View>
                                    <View className="w-[1px] h-8 bg-white/10" />
                                    <View className="items-center">
                                        <Text className="text-amber-400 text-lg font-black">{recipe.macros.carbs}</Text>
                                        <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Carbs</Text>
                                    </View>
                                    <View className="w-[1px] h-8 bg-white/10" />
                                    <View className="items-center">
                                        <Text className="text-rose-400 text-lg font-black">{recipe.macros.fat}</Text>
                                        <Text className="text-white/30 text-[9px] font-bold uppercase tracking-widest">Fat</Text>
                                    </View>
                                </View>
                            </GlassCard>
                        </Animated.View>
                    )}

                    {/* Ingredients */}
                    <Animated.View entering={FadeInDown.delay(400)} className="px-6 mb-12">
                        <Text style={{ fontSize: Typography.size.lg, fontWeight: Typography.weight.bold as any }} className="text-white mb-6">Ingredients</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {recipe.ingredients.map((ingredient, index) => (
                                <View key={index} className="mb-2">
                                    <IngredientTag
                                        name={ingredient.name}
                                        available={ingredient.available}
                                        quantity={ingredient.quantity}
                                    />
                                </View>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Steps */}
                    <View className="px-6">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text style={{ fontSize: Typography.size.lg, fontWeight: Typography.weight.bold as any }} className="text-white">Instructions</Text>
                            <Text style={{ fontSize: Typography.size.tiny }} className="text-white font-bold uppercase tracking-widest">
                                {completedSteps.length} / {recipe.steps.length} Done
                            </Text>
                        </View>

                        {recipe.steps.map((step, index) => {
                            const isCompleted = completedSteps.includes(index);
                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => toggleStep(index)}
                                    className={`mb-4 p-5 rounded-3xl border ${isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' : 'bg-white/5 border-white/10'}`}
                                >
                                    <View className="flex-row">
                                        <View className={`w-8 h-8 rounded-xl items-center justify-center mr-4 mt-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-accent-500 shadow-lg shadow-accent-500/30'}`}>
                                            {isCompleted ? (
                                                <Ionicons name="checkmark" size={18} color="white" />
                                            ) : (
                                                <Text className="text-white font-black">{index + 1}</Text>
                                            )}
                                        </View>
                                        <Text
                                            style={{ fontSize: 16, lineHeight: 26 }}
                                            className={`flex-1 font-medium ${isCompleted ? 'text-white/40 line-through' : 'text-white/90'}`}
                                        >
                                            {step}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
