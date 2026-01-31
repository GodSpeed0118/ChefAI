import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { GlassCard } from '../common/GlassCard';

interface WeeklyChartProps {
    data: { day: string; value: number }[];
    goal: number;
}

export function WeeklyChart({ data, goal }: WeeklyChartProps) {
    const maxVal = Math.max(...data.map(d => d.value), goal);

    return (
        <GlassCard intensity={8} style={styles.container as ViewStyle}>
            <View style={styles.header}>
                <Text style={styles.title}>Weekly Progress</Text>
                <Text style={styles.goalText}>Goal: {goal} kcal</Text>
            </View>

            <View style={styles.chart}>
                {data.map((item, index) => {
                    const height = (item.value / maxVal) * 100;
                    const isOverGoal = item.value > goal;

                    return (
                        <View key={item.day} style={styles.barContainer}>
                            <View style={styles.barWrapper}>
                                <View
                                    style={[
                                        styles.bar,
                                        {
                                            height: `${height}%`,
                                            backgroundColor: isOverGoal ? Colors.red[500] : Colors.accent[500],
                                            opacity: index === data.length - 1 ? 1 : 0.6
                                        }
                                    ]}
                                />
                            </View>
                            <Text style={styles.dayText}>{item.day}</Text>
                        </View>
                    );
                })}
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.bold as any,
        color: 'rgba(255,255,255,0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    } as TextStyle,
    goalText: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.3)',
        fontWeight: Typography.weight.medium as any,
    } as TextStyle,
    chart: {
        flexDirection: 'row',
        height: 140,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xs,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        height: '100%',
        width: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 6,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        marginBottom: Spacing.sm,
    },
    bar: {
        width: '100%',
        borderRadius: 6,
    },
    dayText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: Typography.weight.bold as any,
    } as TextStyle,
});
