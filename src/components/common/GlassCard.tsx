import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Colors } from '../../theme/Colors';

interface GlassCardProps extends ViewProps {
    children: React.ReactNode;
    intensity?: number;
}

export function GlassCard({ children, intensity = 20, style, ...props }: GlassCardProps) {
    return (
        <View style={[styles.container, style]} {...props}>
            <BlurView intensity={intensity} tint="dark" style={styles.blur}>
                <View style={styles.content}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: Colors.background.card,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    blur: {
        width: '100%',
    },
    content: {
        padding: 20,
    },
});
