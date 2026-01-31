import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';

interface FilterOption {
    id: string;
    label: string;
}

interface FilterChipsProps {
    options: FilterOption[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    label?: string;
}

export function FilterChips({ options, selectedId, onSelect, label }: FilterChipsProps) {
    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>{label}</Text>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {options.map((option, index) => (
                    <Animated.View
                        key={option.id}
                        entering={FadeInRight.delay(index * 100)}
                    >
                        <Pressable
                            onPress={() => onSelect(option.id)}
                            style={[
                                styles.chip,
                                selectedId === option.id && styles.selectedChip
                            ]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    selectedId === option.id && styles.selectedChipText
                                ]}
                            >
                                {option.label}
                            </Text>
                        </Pressable>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: Spacing.md,
    },
    label: {
        fontSize: Typography.size.tiny,
        fontWeight: Typography.weight.black as any,
        color: 'rgba(255, 255, 255, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: Typography.tracking.widest,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.lg,
    },
    scrollContent: {
        paddingLeft: Spacing.lg,
        gap: Spacing.sm,
    },
    chip: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    selectedChip: {
        backgroundColor: Colors.accent[500],
        borderColor: Colors.accent[600],
    },
    chipText: {
        color: 'white',
        fontSize: Typography.size.sm,
        fontWeight: Typography.weight.bold as any,
        opacity: 0.6,
    },
    selectedChipText: {
        opacity: 1,
    },
});
