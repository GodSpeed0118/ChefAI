import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';
import { Gradients } from '../../theme/Gradients';

interface FloatingActionButtonProps {
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({ onPress, icon = 'camera' }: FloatingActionButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(scale.value) }],
    }));

    const handlePressIn = () => {
        scale.value = 0.9;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handlePressOut = () => {
        scale.value = 1;
    };

    return (
        <View style={styles.wrapper}>
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[styles.container, animatedStyle]}
            >
                <LinearGradient
                    colors={Gradients.primary as any}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons name={icon} size={28} color="white" />
                </LinearGradient>
            </AnimatedPressable>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        shadowColor: Colors.accent[500],
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    container: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
