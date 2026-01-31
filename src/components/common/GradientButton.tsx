import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/Colors';
import { Gradients } from '../../theme/Gradients';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';

interface GradientButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'success' | 'danger';
    icon?: React.ReactNode;
}

export function GradientButton({ title, variant = 'primary', icon, ...props }: GradientButtonProps) {
    const getGradient = () => {
        switch (variant) {
            case 'success': return Gradients.success;
            case 'danger': return Gradients.danger;
            default: return Gradients.primary;
        }
    };

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <Pressable
            {...props}
            onPressIn={handlePressIn}
            style={[
                styles.container,
                variant === 'primary' && styles.primaryGlow,
                props.style as any,
            ]}
        >
            <LinearGradient
                colors={getGradient() as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            >
                <View className="flex-row items-center justify-center py-4 px-6">
                    {icon && <View style={{ marginRight: Spacing.sm }}>{icon}</View>}
                    <Text style={[styles.text, { fontSize: Typography.size.md, fontWeight: Typography.weight.bold as any }]}>
                        {title}
                    </Text>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    primaryGlow: {
        shadowColor: Colors.accent[500],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    gradient: {
        width: '100%',
    },
    text: {
        color: 'white',
        letterSpacing: Typography.tracking.tight,
    }
});
