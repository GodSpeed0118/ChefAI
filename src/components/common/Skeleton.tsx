import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';

interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: withRepeat(
            withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        ),
    }));

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, borderRadius } as any,
                animatedStyle,
                style,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
});
