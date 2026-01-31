import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { MealPlanItem, MealType } from '../../types/planner';
import { GlassCard } from '../common/GlassCard';

interface PlannerDayCardProps {
    dayName: string;
    date: Date;
    items: MealPlanItem[];
    onAddMeal: (type: MealType) => void;
    onRemoveMeal: (type: MealType) => void;
}

const MEAL_TYPES: { type: MealType; icon: string; label: string }[] = [
    { type: 'breakfast', icon: 'sunny-outline', label: 'Breakfast' },
    { type: 'lunch', icon: 'restaurant-outline', label: 'Lunch' },
    { type: 'dinner', icon: 'moon-outline', label: 'Dinner' },
];

export function PlannerDayCard({ dayName, date, items, onAddMeal, onRemoveMeal }: PlannerDayCardProps) {
    const isToday = new Date().toDateString() === date.toDateString();

    const getItemForType = (type: MealType) => items.find(i => i.mealType === type);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.dayName, isToday && styles.todayText]}>{dayName}</Text>
                <Text style={styles.dateText}>{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</Text>
            </View>

            <View style={styles.slots}>
                {MEAL_TYPES.map(({ type, icon, label }) => {
                    const item = getItemForType(type);
                    return (
                        <View key={type} style={styles.slotRow}>
                            <View style={styles.slotIcon}>
                                <Ionicons name={icon as any} size={18} color={item ? Colors.accent[500] : 'rgba(255,255,255,0.2)'} />
                            </View>

                            <GlassCard intensity={item ? 20 : 5} style={styles.slotCard as ViewStyle}>
                                {item ? (
                                    <View style={styles.mealInfo}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.mealLabel}>{label}</Text>
                                            <Text style={styles.recipeName} numberOfLines={1}>{item.recipeName}</Text>
                                        </View>
                                        <Pressable onPress={() => onRemoveMeal(type)} style={styles.removeBtn}>
                                            <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.3)" />
                                        </Pressable>
                                    </View>
                                ) : (
                                    <Pressable onPress={() => onAddMeal(type)} style={styles.emptySlot}>
                                        <Text style={styles.addText}>Tap to add {label}</Text>
                                        <Ionicons name="add" size={18} color="rgba(255,255,255,0.3)" />
                                    </Pressable>
                                )}
                            </GlassCard>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: Spacing.md,
        paddingLeft: Spacing.xs,
    },
    dayName: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
        marginRight: Spacing.sm,
    },
    todayText: {
        color: Colors.accent[500],
    },
    dateText: {
        fontSize: Typography.size.sm,
        color: 'rgba(255,255,255,0.4)',
    },
    slots: {
        gap: Spacing.sm,
    },
    slotRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    slotIcon: {
        width: 32,
        alignItems: 'center',
    },
    slotCard: {
        flex: 1,
        padding: Spacing.md,
        minHeight: 60,
        justifyContent: 'center',
    },
    mealInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mealLabel: {
        fontSize: Typography.size.tiny,
        color: Colors.accent[500],
        fontWeight: Typography.weight.bold as any,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    recipeName: {
        fontSize: Typography.size.md,
        color: 'white',
        fontWeight: Typography.weight.medium as any,
    },
    removeBtn: {
        padding: Spacing.xs,
    },
    emptySlot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addText: {
        fontSize: Typography.size.sm,
        color: 'rgba(255,255,255,0.2)',
        fontWeight: Typography.weight.medium as any,
    },
});
