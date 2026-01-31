import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../src/components/common/GlassCard';
import { MacroBreakdown } from '../src/components/nutrition/MacroCard';
import { ProgressRing } from '../src/components/nutrition/ProgressRing';
import { WeeklyChart } from '../src/components/nutrition/WeeklyChart';
import { Colors } from '../src/theme/Colors';
import { Gradients } from '../src/theme/Gradients';
import { Spacing } from '../src/theme/Spacing';
import { Typography } from '../src/theme/Typography';

// Mock Data
const MOCK_NUTRITION = {
    daily: {
        calories: 1840,
        goal: 2200,
        macros: {
            protein: 142,
            carbs: 210,
            fat: 65,
        },
        goals: {
            protein: 160,
            carbs: 250,
            fat: 70,
        }
    },
    weekly: [
        { day: 'Mon', value: 2100 },
        { day: 'Tue', value: 1950 },
        { day: 'Wed', value: 2300 },
        { day: 'Thu', value: 1800 },
        { day: 'Fri', value: 2050 },
        { day: 'Sat', value: 2150 },
        { day: 'Sun', value: 1840 },
    ],
    streak: 12,
};

export default function NutritionScreen() {
    const router = useRouter();
    const { daily, weekly, streak } = MOCK_NUTRITION;

    return (
        <View className="flex-1 bg-primary-950">
            <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1">
                <StatusBar style="light" />

                {/* Header */}
                <View className="px-6 py-4 flex-row items-center justify-between">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10"
                    >
                        <Ionicons name="arrow-back" size={22} color="white" />
                    </Pressable>
                    <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tight">
                        Nutrition <Text className="text-accent-500">Center</Text>
                    </Text>
                    <View className="w-11" /> {/* Spacer */}
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>

                    {/* Streak & Top Info */}
                    <Animated.View entering={FadeInDown.delay(200)} style={styles.streakContainer}>
                        <GlassCard intensity={15} style={styles.streakCard as ViewStyle}>
                            <View style={styles.streakInfo}>
                                <View style={styles.streakIcon}>
                                    <Ionicons name="flame" size={24} color={Colors.orange[500]} />
                                </View>
                                <View>
                                    <Text style={styles.streakValue}>{streak} Day Streak!</Text>
                                    <Text style={styles.streakLabel}>You're on fire this week</Text>
                                </View>
                            </View>
                            <View style={styles.dateChip}>
                                <Text style={styles.dateText}>Today</Text>
                            </View>
                        </GlassCard>
                    </Animated.View>

                    {/* Main Calorie Dashboard */}
                    <Animated.View entering={FadeInDown.delay(300)} style={styles.mainDashboard}>
                        <ProgressRing
                            progress={daily.calories / daily.goal}
                            size={180}
                            strokeWidth={15}
                            color={Colors.accent[500]}
                            label={daily.calories.toString()}
                            sublabel="kcal consumed"
                        />
                        <View style={styles.remainingBox}>
                            <Text style={styles.remainingValue}>{daily.goal - daily.calories}</Text>
                            <Text style={styles.remainingLabel}>kcal left</Text>
                        </View>
                    </Animated.View>

                    {/* Macro Breakdown */}
                    <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
                        <MacroBreakdown
                            protein={daily.macros.protein}
                            carbs={daily.macros.carbs}
                            fat={daily.macros.fat}
                            goals={daily.goals}
                        />
                    </Animated.View>

                    {/* Weekly Progress */}
                    <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
                        <WeeklyChart data={weekly} goal={daily.goal} />
                    </Animated.View>

                    {/* Quick Insights */}
                    <Animated.View entering={FadeInDown.delay(600)} style={styles.insightsRow}>
                        <GlassCard intensity={5} style={styles.insightCard as ViewStyle}>
                            <Ionicons name="water-outline" size={20} color={Colors.sky[400]} />
                            <Text style={styles.insightValue}>1.5L</Text>
                            <Text style={styles.insightLabel}>Water</Text>
                        </GlassCard>
                        <GlassCard intensity={5} style={styles.insightCard as ViewStyle}>
                            <Ionicons name="restaurant-outline" size={20} color={Colors.emerald[400]} />
                            <Text style={styles.insightValue}>3/3</Text>
                            <Text style={styles.insightLabel}>Meals</Text>
                        </GlassCard>
                    </Animated.View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    streakContainer: {
        marginBottom: Spacing.xl,
    },
    streakCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
    },
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    streakIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    streakValue: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.black as any,
        color: 'white',
    } as TextStyle,
    streakLabel: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
    } as TextStyle,
    dateChip: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dateText: {
        fontSize: Typography.size.tiny,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
    } as TextStyle,
    mainDashboard: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        position: 'relative',
    },
    remainingBox: {
        marginTop: Spacing.lg,
        alignItems: 'center',
    },
    remainingValue: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
        color: Colors.accent[500],
    } as TextStyle,
    remainingLabel: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    } as TextStyle,
    section: {
        marginBottom: Spacing.xl,
    },
    insightsRow: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    insightCard: {
        flex: 1,
        padding: Spacing.lg,
        alignItems: 'center',
        gap: 4,
    },
    insightValue: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
    } as TextStyle,
    insightLabel: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
    } as TextStyle,
});
