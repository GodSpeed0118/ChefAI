import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../src/components/common/GlassCard';
import { GroceryListModal } from '../src/components/planner/GroceryListModal';
import { PlannerDayCard } from '../src/components/planner/PlannerDayCard';
import { RecipePickerModal } from '../src/components/planner/RecipePickerModal';
import { StorageService } from '../src/services/StorageService';
import { Gradients } from '../src/theme/Gradients';
import { Spacing } from '../src/theme/Spacing';
import { Typography } from '../src/theme/Typography';
import { MealPlanItem, MealType } from '../src/types/planner';
import { Recipe } from '../src/types/recipe';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MealPlanScreen() {
    const router = useRouter();
    const [plan, setPlan] = useState<MealPlanItem[]>([]);
    const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [groceryVisible, setGroceryVisible] = useState(false);
    const [activeSelection, setActiveSelection] = useState<{ day: string; type: MealType } | null>(null);

    // Generate current week dates
    const weekDates = useMemo(() => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Start from Sunday

        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            return date;
        });
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const mealPlan = await StorageService.getMealPlan();
        setPlan(mealPlan);
        const recipes = await StorageService.getSavedRecipes();
        setSavedRecipes(recipes);
    };

    const handleAddMeal = (day: string, type: MealType) => {
        setActiveSelection({ day, type });
        setPickerVisible(true);
    };

    const handleSelectRecipe = async (recipe: Recipe) => {
        if (!activeSelection) return;

        const newItem: MealPlanItem = {
            id: Date.now().toString(),
            recipeId: recipe.id || recipe.name,
            recipeName: recipe.name,
            day: activeSelection.day,
            mealType: activeSelection.type,
        };

        await StorageService.updateMealPlanItem(newItem);
        await loadData();
        setPickerVisible(false);
    };

    const handleRemoveMeal = async (day: string, type: MealType) => {
        await StorageService.removeMealPlanItem(day, type);
        await loadData();
    };

    return (
        <View className="flex-1 bg-primary-950">
            <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1">
                <StatusBar style="light" />

                {/* Header */}
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10 active:bg-white/10"
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </Pressable>
                    <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tight">
                        Meal <Text className="text-accent-500">Planner</Text>
                    </Text>
                    <Pressable
                        onPress={() => setGroceryVisible(true)}
                        className="w-11 h-11 rounded-2xl bg-accent-500 items-center justify-center border border-accent-400 shadow-lg shadow-accent-500/30 active:bg-accent-600"
                    >
                        <Ionicons name="cart" size={22} color="white" />
                    </Pressable>
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
                    <Animated.View entering={FadeInDown.delay(200)} style={styles.statsCard}>
                        <GlassCard intensity={8} style={styles.statsInner as ViewStyle}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{plan.length}</Text>
                                <Text style={styles.statLabel}>Meals Planned</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>~{plan.length * 450}</Text>
                                <Text style={styles.statLabel}>Est. Calories</Text>
                            </View>
                        </GlassCard>
                    </Animated.View>

                    {weekDates.map((date, index) => (
                        <Animated.View key={date.toISOString()} entering={FadeInDown.delay(300 + index * 100)}>
                            <PlannerDayCard
                                dayName={DAYS[date.getDay()]}
                                date={date}
                                items={plan.filter(p => p.day === date.toDateString())}
                                onAddMeal={(type) => handleAddMeal(date.toDateString(), type)}
                                onRemoveMeal={(type) => handleRemoveMeal(date.toDateString(), type)}
                            />
                        </Animated.View>
                    ))}
                </ScrollView>

                <RecipePickerModal
                    visible={pickerVisible}
                    onClose={() => setPickerVisible(false)}
                    onSelect={handleSelectRecipe}
                    savedRecipes={savedRecipes}
                />

                <GroceryListModal
                    visible={groceryVisible}
                    onClose={() => setGroceryVisible(false)}
                    plan={plan}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    statsCard: {
        marginBottom: Spacing.xl,
    },
    statsInner: {
        flexDirection: 'row',
        padding: Spacing.lg,
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: Typography.size.xl,
        fontWeight: Typography.weight.black as any,
        color: 'white',
    } as TextStyle,
    statLabel: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: Typography.weight.bold as any,
        textTransform: 'uppercase',
        letterSpacing: 1,
    } as TextStyle,
    statDivider: {
        width: 1,
        height: '60%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    } as ViewStyle,
});
