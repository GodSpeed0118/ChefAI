import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { GlassCard } from '../common/GlassCard';

interface MacroDetailProps {
    label: string;
    current: number;
    target: number;
    color: string;
}

function MacroBar({ label, current, target, color }: MacroDetailProps) {
    const progress = Math.min(current / target, 1);

    return (
        <View style={styles.macroRow}>
            <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{label}</Text>
                <Text style={styles.macroValue}>
                    <Text style={{ color: 'white' }}>{current}g</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.3)' }}> / {target}g</Text>
                </Text>
            </View>
            <View style={styles.barBg}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${progress * 100}%`,
                            backgroundColor: color,
                            shadowColor: color,
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.5,
                            shadowRadius: 4,
                        }
                    ]}
                />
            </View>
        </View>
    );
}

export function MacroBreakdown({ protein, carbs, fat, goals }: {
    protein: number;
    carbs: number;
    fat: number;
    goals: { protein: number; carbs: number; fat: number; }
}) {
    return (
        <GlassCard intensity={8} style={styles.container as ViewStyle}>
            <Text style={styles.title}>Macro Breakdown</Text>
            <View style={styles.list}>
                <MacroBar label="Protein" current={protein} target={goals.protein} color={Colors.accent[500]} />
                <MacroBar label="Carbs" current={carbs} target={goals.carbs} color={Colors.emerald[500]} />
                <MacroBar label="Fat" current={fat} target={goals.fat} color={Colors.orange[500]} />
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.lg,
    },
    title: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.bold as any,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: Spacing.lg,
    } as TextStyle,
    list: {
        gap: Spacing.lg,
    },
    macroRow: {
        gap: Spacing.sm,
    },
    macroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    macroLabel: {
        fontSize: Typography.size.md,
        fontWeight: Typography.weight.bold as any,
        color: 'white',
    } as TextStyle,
    macroValue: {
        fontSize: Typography.size.xs,
        fontWeight: Typography.weight.medium as any,
    } as TextStyle,
    barBg: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: 4,
    },
});
