import { View, Text, ActivityIndicator } from "react-native";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size="large" color="#22c55e" />
      <Text className="mt-4 text-center text-base text-gray-600">
        {message}
      </Text>
    </View>
  );
}
