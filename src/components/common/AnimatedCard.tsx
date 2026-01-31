import React from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
    FadeInDown
} from 'react-native-reanimated';

interface AnimatedCardProps extends ViewProps {
    children: React.ReactNode;
    delay?: number;
}

export function AnimatedCard({ children, delay = 0, ...props }: AnimatedCardProps) {
    return (
        <Animated.View
            entering={FadeInDown.delay(delay).springify()}
            {...props}
            style={props.style}
        >
            {children}
        </Animated.View>
    );
}
