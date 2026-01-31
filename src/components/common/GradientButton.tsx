import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Gradients } from '../../theme/Gradients';
import { Spacing } from '../../theme/Spacing';
import { Typography } from '../../theme/Typography';

interface GradientButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'success' | 'danger';
    icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GradientButton({ title, variant = 'primary', icon, ...props }: GradientButtonProps) {
    const scale = useSharedValue(1);

    const getGradient = () => {
        switch (variant) {
            case 'success': return Gradients.success;
            case 'danger': return Gradients.danger;
            default: return Gradients.primary;
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(scale.value, { damping: 10, stiffness: 100 }) }],
    }));

    const handlePressIn = () => {
        scale.value = 0.96;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = 1;
    };

    return (
        <AnimatedPressable
            {...props}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                styles.container,
                variant === 'primary' && styles.primaryGlow,
                animatedStyle,
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
        </AnimatedPressable>
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
