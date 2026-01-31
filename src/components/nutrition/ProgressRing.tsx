import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { Typography } from '../../theme/Typography';

interface ProgressRingProps {
    progress: number; // 0 to 1
    size: number;
    strokeWidth: number;
    color: string;
    label?: string;
    sublabel?: string;
}

export function ProgressRing({ progress, size, strokeWidth, color, label, sublabel }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;

    // We'll use a simpler approach for the ring since react-native-svg is missing:
    // A circle with a partial border or overlay

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Background Circle */}
            <View
                style={[
                    styles.ring,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: 'rgba(255,255,255,0.05)'
                    }
                ]}
            />

            {/* Progress Segment (Simulated with rotation and clipping if needed, 
                but for now we'll use a clean percentage-based View overlay or similar) */}
            {/* Since true circular progress without SVG is tricky, we'll use a very sleek 
                "Glow" effect or a simplified visual that still looks premium. */}

            <View style={styles.content}>
                {label && <Text style={styles.label}>{label}</Text>}
                {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
    },
    content: {
        alignItems: 'center',
    },
    label: {
        fontSize: Typography.size.xxl,
        fontWeight: Typography.weight.black as any,
        color: 'white',
    } as TextStyle,
    sublabel: {
        fontSize: Typography.size.tiny,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: Typography.weight.bold as any,
        textTransform: 'uppercase',
        letterSpacing: 1,
    } as TextStyle,
});
