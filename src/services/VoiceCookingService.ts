import * as Speech from 'expo-speech';

export const VoiceCookingService = {
    speak: (text: string, onDone?: () => void) => {
        Speech.speak(text, {
            language: 'en',
            pitch: 1.0,
            rate: 0.9,
            onDone,
        });
    },

    stop: () => {
        Speech.stop();
    },

    isSpeaking: async () => {
        return await Speech.isSpeakingAsync();
    },

    speakStep: (stepNumber: number, stepText: string, onDone?: () => void) => {
        const fullText = `Step ${stepNumber}. ${stepText}`;
        VoiceCookingService.speak(fullText, onDone);
    },

    announceTimer: (minutes: number) => {
        VoiceCookingService.speak(`Timer set for ${minutes} minutes. I'll let you know when it's done.`);
    },

    announceTimerFinished: () => {
        VoiceCookingService.speak("Time's up! Your timer has finished.");
    }
};
