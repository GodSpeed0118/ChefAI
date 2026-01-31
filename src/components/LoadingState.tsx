import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import LottieView from "lottie-react-native";

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 bg-primary-950">
      <Animated.View entering={FadeIn} className="items-center">
        <View className="mb-0">
          <LottieView
            source={require("../../assets/animations/hourglass.json")}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
        </View>
        <Text className="text-2xl font-black text-white mb-2 text-center italic">
          chef<Text className="text-accent-500">ai</Text>.
        </Text>
        <Text className="text-sm font-bold text-white/50 text-center leading-6 max-w-xs uppercase tracking-widest">
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}
