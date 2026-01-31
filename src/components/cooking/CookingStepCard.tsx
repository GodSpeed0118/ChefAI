import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Colors } from '../../theme/Colors';

interface CookingStepCardProps {
    stepNumber: number;
    totalSteps: number;
    content: string;
    isSpeaking: boolean;
    onToggleSpeech: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export const CookingStepCard: React.FC<CookingStepCardProps> = ({
    stepNumber,
    totalSteps,
    content,
    isSpeaking,
    onToggleSpeech,
    onNext,
    onPrev,
}) => {
    return (
        <Animated.View
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(400)}
            className="bg-white/5 border border-white/10 rounded-[32px] p-8 m-4"
            style={styles.card}
        >
            <View className="flex-row justify-between items-center mb-6">
                <View className="bg-accent-500/20 px-4 py-1.5 rounded-full">
                    <Text className="text-accent-400 font-black uppercase text-[10px] tracking-widest">
                        Step {stepNumber} of {totalSteps}
                    </Text>
                </View>
                <Pressable
                    onPress={onToggleSpeech}
                    className={`w-12 h-12 rounded-2xl items-center justify-center ${isSpeaking ? 'bg-accent-500' : 'bg-white/10'}`}
                >
                    <Ionicons name={isSpeaking ? "volume-high" : "volume-medium-outline"} size={22} color="white" />
                </Pressable>
            </View>

            <Text
                style={{ fontSize: 24, lineHeight: 36, fontWeight: '600' }}
                className="text-white mb-10"
            >
                {content}
            </Text>

            <View className="flex-row justify-between items-center mt-auto">
                <Pressable
                    onPress={onPrev}
                    disabled={stepNumber === 1}
                    className={`w-16 h-16 rounded-[24px] items-center justify-center ${stepNumber === 1 ? 'opacity-20' : 'bg-white/5'}`}
                >
                    <Ionicons name="arrow-back" size={28} color="white" />
                </Pressable>

                <View className="flex-row gap-4">
                    {/* Progress Dots */}
                    {Array.from({ length: Math.min(totalSteps, 5) }).map((_, i) => (
                        <View
                            key={i}
                            className={`w-2 h-2 rounded-full ${i === (stepNumber - 1) % 5 ? 'bg-accent-500 w-4' : 'bg-white/20'}`}
                        />
                    ))}
                </View>

                <Pressable
                    onPress={onNext}
                    disabled={stepNumber === totalSteps}
                    className={`w-16 h-16 rounded-[24px] items-center justify-center ${stepNumber === totalSteps ? 'bg-emerald-500/20' : 'bg-accent-500'}`}
                >
                    <Ionicons
                        name={stepNumber === totalSteps ? "checkmark" : "arrow-forward"}
                        size={28}
                        color="white"
                    />
                </Pressable>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        minHeight: 400,
        shadowColor: Colors.accent[500],
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
    }
});
