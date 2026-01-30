import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 bg-primary-950">
      <View className="w-24 h-24 bg-white/5 rounded-4xl items-center justify-center mb-8">
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
      </View>
      <Text className="text-2xl font-black text-white mb-3 text-center">
        Something went wrong
      </Text>
      <Text className="text-sm font-bold text-white/50 text-center mb-10 leading-6 uppercase tracking-widest">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-emerald-500 px-12 py-5 rounded-3xl shadow-xl active:bg-emerald-600 active:scale-[0.98]"
        >
          <View className="flex-row items-center">
            <Ionicons name="refresh" size={20} color="white" />
            <Text className="text-white font-black text-lg ml-3 tracking-tight">Try Again</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
