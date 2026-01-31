import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CookingStepCard } from '../src/components/cooking/CookingStepCard';
import { VoiceCookingService } from '../src/services/VoiceCookingService';
import { Colors } from '../src/theme/Colors';
import { Gradients } from '../src/theme/Gradients';

// Mock recipe for demonstration if none passed
const MOCK_RECIPE = {
    name: "Premium Ribeye Steak",
    steps: [
        "Pat the steak dry with paper towels to ensure a good sear.",
        "Season generously with kosher salt and freshly cracked black pepper on all sides.",
        "Heat a cast-iron skillet over high heat until smoking hot.",
        "Add 1 tablespoon of high-smoke point oil and sear the steak for 3 minutes per side.",
        "Add butter, garlic, and rosemary. Baste the steak for the final minute.",
        "Rest the steak for 5-10 minutes before slicing to keep it juicy."
    ]
};

export default function CookingModeScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Use params if available, else use mock
    const recipeName = params.name as string || MOCK_RECIPE.name;
    const steps = params.steps ? JSON.parse(params.steps as string) : MOCK_RECIPE.steps;

    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(true);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const timerRef = useRef<any>(null);

    useEffect(() => {
        // Initial welcome
        if (isVoiceActive) {
            VoiceCookingService.speak(`Ready to cook ${recipeName}? Let's start with step 1.`);
            readCurrentStep();
        }
        return () => {
            VoiceCookingService.stop();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const readCurrentStep = () => {
        VoiceCookingService.stop();
        setIsSpeaking(true);
        VoiceCookingService.speakStep(currentStep + 1, steps[currentStep], () => {
            setIsSpeaking(false);
        });
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
            // Wait for state change then read if voice active
            setTimeout(() => {
                if (isVoiceActive) readCurrentStep();
            }, 100);
        } else {
            handleFinish();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setTimeout(() => {
                if (isVoiceActive) readCurrentStep();
            }, 100);
        }
    };

    const handleToggleVoice = () => {
        if (isSpeaking) {
            VoiceCookingService.stop();
            setIsSpeaking(false);
            setIsVoiceActive(false);
        } else {
            setIsVoiceActive(true);
            readCurrentStep();
        }
    };

    const handleFinish = () => {
        VoiceCookingService.speak("Congratulations! You've finished cooking this recipe. Enjoy your meal!");
        Alert.alert(
            "Excellent Work!",
            "You've completed the recipe. Ready to share your masterpiece?",
            [{ text: "Done", onPress: () => router.back() }]
        );
    };

    const startTimer = (minutes: number) => {
        setTimerSeconds(minutes * 60);
        setIsTimerRunning(true);
        if (timerRef.current) clearInterval(timerRef.current);

        VoiceCookingService.announceTimer(minutes);

        timerRef.current = setInterval(() => {
            setTimerSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setIsTimerRunning(false);
                    VoiceCookingService.announceTimerFinished();
                    Alert.alert("Timer Finished", "Your kitchen timer has ended!");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View className="flex-1 bg-primary-950">
            <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
            <SafeAreaView className="flex-1">
                <StatusBar style="light" />

                {/* Header */}
                <View className="px-8 py-4 flex-row justify-between items-center">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-white/5 rounded-xl border border-white/10">
                        <Ionicons name="close" size={24} color="white" />
                    </Pressable>
                    <View className="items-center">
                        <Text className="text-white font-black text-lg italic">{recipeName}</Text>
                        <View className="flex-row items-center mt-1">
                            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Cooking Mode</Text>
                        </View>
                    </View>
                    <Pressable
                        onPress={handleToggleVoice}
                        className={`w-10 h-10 items-center justify-center rounded-xl border ${isVoiceActive ? 'bg-accent-500/20 border-accent-500/50' : 'bg-white/5 border-white/10'}`}
                    >
                        <Ionicons name={isVoiceActive ? "mic" : "mic-off"} size={20} color={isVoiceActive ? Colors.accent[500] : "white"} />
                    </Pressable>
                </View>

                {/* Main Content */}
                <View className="flex-1 justify-center py-4">
                    <CookingStepCard
                        stepNumber={currentStep + 1}
                        totalSteps={steps.length}
                        content={steps[currentStep]}
                        isSpeaking={isSpeaking}
                        onToggleSpeech={readCurrentStep}
                        onNext={handleNext}
                        onPrev={handlePrev}
                    />
                </View>

                {/* Footer / Timer */}
                <View className="px-8 pb-10">
                    <View className="bg-white/5 border border-white/10 rounded-[24px] p-6 flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 bg-accent-500/20 rounded-2xl items-center justify-center mr-4">
                                <Ionicons name="timer-outline" size={24} color={Colors.accent[500]} />
                            </View>
                            <View>
                                <Text className="text-white/40 font-bold text-[10px] uppercase tracking-widest">Kitchen Timer</Text>
                                <Text className="text-white font-black text-xl">{isTimerRunning ? formatTime(timerSeconds) : "00:00"}</Text>
                            </View>
                        </View>

                        <View className="flex-row gap-2">
                            {!isTimerRunning ? (
                                <>
                                    <Pressable onPress={() => startTimer(5)} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                        <Text className="text-white font-bold text-xs">+5m</Text>
                                    </Pressable>
                                    <Pressable onPress={() => startTimer(10)} className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                                        <Text className="text-white font-bold text-xs">+10m</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <Pressable
                                    onPress={() => {
                                        if (timerRef.current) clearInterval(timerRef.current);
                                        setIsTimerRunning(false);
                                        setTimerSeconds(0);
                                    }}
                                    className="px-4 py-2 bg-rose-500/20 rounded-xl border border-rose-500/50"
                                >
                                    <Text className="text-rose-400 font-bold text-xs">Reset</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
