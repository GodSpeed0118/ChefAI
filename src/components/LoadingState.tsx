import { View, Text, ActivityIndicator } from "react-native";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 bg-primary-950">
      <View className="w-24 h-24 bg-white/10 rounded-4xl items-center justify-center mb-8 shadow-sm">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
      <Text className="text-2xl font-black text-white mb-2 text-center italic">
        chefai<Text className="text-accent-500">.</Text>
      </Text>
      <Text className="text-sm font-bold text-white/50 text-center leading-6 max-w-xs uppercase tracking-widest">
        {message}
      </Text>
    </View>
  );
}
