import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';
import { GlassCard } from '../common/GlassCard';

interface AnalyticsCardProps {
    total: number;
    expiring: number;
    expired: number;
}

export function PantryAnalyticsCard({ total, expiring, expired }: AnalyticsCardProps) {
    return (
        <Animated.View entering={FadeInDown.delay(200)} style={styles.container}>
            <GlassCard intensity={15} style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.stat}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                            <Ionicons name="cube-outline" size={20} color={Colors.accent[500]} />
                        </View>
                        <Text style={styles.value}>{total}</Text>
                        <Text style={styles.label}>Total Items</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.stat}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
                            <Ionicons name="alert-circle-outline" size={20} color="#fbbf24" />
                        </View>
                        <Text style={styles.value}>{expiring}</Text>
                        <Text style={[styles.label, { color: '#fbbf24' }]}>Expiring Soon</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.stat}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(244, 63, 94, 0.1)' }]}>
                            <Ionicons name="timer-outline" size={20} color={Colors.rose[500]} />
                        </View>
                        <Text style={styles.value}>{expired}</Text>
                        <Text style={[styles.label, { color: Colors.rose[500] }]}>Expired</Text>
                    </View>
                </View>
            </GlassCard>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.xl,
    },
    card: {
        padding: Spacing.lg,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    value: {
        fontSize: Typography.size.lg,
        fontWeight: Typography.weight.black as any,
        color: 'white',
        marginBottom: 2,
    },
    label: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255, 255, 255, 0.3)',
        fontWeight: Typography.weight.bold as any,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
