import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

interface AnimatedCardProps extends PressableProps {
    children: React.ReactNode;
    delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(scale.value) }],
    }));

    const handlePressIn = () => {
        if (props.onPress) {
            scale.value = 0.98;
        }
    };

    const handlePressOut = () => {
        scale.value = 1;
    };

    return (
        <Animated.View entering={FadeInDown.delay(delay).springify()}>
            <AnimatedPressable
                {...props}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={[animatedStyle, props.style as any]}
            >
                {children}
            </AnimatedPressable>
        </Animated.View>
    );
}
