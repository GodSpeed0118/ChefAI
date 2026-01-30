import { View, Text, Pressable } from "react-native";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-4xl">⚠️</Text>
      <Text className="mt-4 text-center text-base text-red-600">
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="mt-6 rounded-xl bg-primary-600 px-6 py-3"
        >
          <Text className="text-base font-semibold text-white">
            Try Again
          </Text>
        </Pressable>
      )}
    </View>
  );
}
