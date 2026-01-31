import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedCard } from "../src/components/common/AnimatedCard";
import { GlassCard } from "../src/components/common/GlassCard";
import { GradientButton } from "../src/components/common/GradientButton";
import { LoadingState } from "../src/components/LoadingState";
import { useAuth } from "../src/context/AuthContext";
import { useAnalyzeImage } from "../src/hooks/useAnalyzeImage";
import { Colors } from "../src/theme/Colors";
import { Gradients } from "../src/theme/Gradients";
import { Spacing } from "../src/theme/Spacing";
import { Typography } from "../src/theme/Typography";

// Quick category UI removed for a cleaner premium UX

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const analyzeImage = useAnalyzeImage();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: async () => await signOut() },
      ]
    );
  };

  const pickImage = async (useCamera: boolean) => {
    if (useCamera && !Device.isDevice && Platform.OS !== 'web') {
      Alert.alert(
        "Simulator Mode",
        "The camera is not available on this simulator. Loading a sample image!",
        [{ text: "Great!", onPress: () => setImageUri("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop") }]
      );
      return;
    }

    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Access is needed to pick an image.");
      return;
    }

    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ["images"], quality: 0.8 };

    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picking error:", error);
    }
  };

  const handleAnalyze = () => {
    if (!imageUri) return;
    analyzeImage.mutate({ uri: imageUri }, {
      onSuccess: (data) => {
        router.push({
          pathname: "/results",
          params: { ingredients: JSON.stringify(data.ingredients) },
        });
      },
      onError: (error) => Alert.alert("Analysis Failed", error.message),
    });
  };

  return (
    <View className="flex-1 bg-primary-950">
      <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />

        {analyzeImage.isPending ? (
          <LoadingState message="Analyzing your fridge contents..." />
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              {/* Header */}
              <Animated.View
                entering={FadeInUp.delay(200)}
                className="px-6 pt-4 pb-4 flex-row justify-between items-center"
              >
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-3xl bg-accent-600/20 items-center justify-center border border-accent-600/30">
                    <Ionicons name="restaurant" size={24} color={Colors.accent[500]} />
                  </View>
                  <Text style={{ fontSize: Typography.size.xl, fontWeight: Typography.weight.black as any }} className="ml-4 text-white tracking-tight">
                    Chef<Text className="text-accent-500">AI</Text>
                  </Text>
                </View>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => router.push("/saved")}
                    className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10 active:bg-white/10"
                  >
                    <Ionicons name="heart" size={20} color="white" />
                  </Pressable>
                  <Pressable
                    onPress={handleSignOut}
                    className="w-11 h-11 rounded-2xl bg-white/5 items-center justify-center border border-white/10 active:bg-white/10"
                  >
                    <Ionicons name="log-out-outline" size={20} color="white" />
                  </Pressable>
                </View>
              </Animated.View>

              {/* Smart Scan Hero */}
              <Animated.View entering={FadeInDown.delay(400)} className="px-6 mb-12 pt-4">
                <GlassCard intensity={30} style={{ padding: 0 }}>
                  <LinearGradient
                    colors={['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)']}
                    style={{ padding: Spacing.xl, borderRadius: 24 }}
                  >
                    <View className="flex-row items-center mb-4">
                      <View className="w-12 h-12 rounded-2xl bg-accent-500 items-center justify-center shadow-lg shadow-accent-500/50">
                        <Ionicons name="sparkles" size={24} color="white" />
                      </View>
                      <View className="ml-4">
                        <Text style={{ fontSize: Typography.size.lg, fontWeight: Typography.weight.black as any }} className="text-white">Smart Scan</Text>
                        <Text style={{ fontSize: Typography.size.tiny, letterSpacing: Typography.tracking.widest }} className="text-white/60 font-bold uppercase">AI Powered Assistant</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: Typography.size.sm, lineHeight: 20 }} className="text-white/70 font-medium mb-4">
                      Snap a photo of your fridge to get instant, creative recipe ideas based on what you have.
                    </Text>
                  </LinearGradient>
                </GlassCard>
              </Animated.View>

              {/* Fridge Scanner Section */}
              <Animated.View entering={FadeInDown.delay(800)} className="px-6">
                <Text style={{ fontSize: Typography.size.lg, fontWeight: Typography.weight.bold as any }} className="text-white mb-5 tracking-tight text-center">Scan Your Fridge</Text>

                {imageUri ? (
                  <AnimatedCard className="bg-white/5 rounded-[32px] border border-white/10 overflow-hidden">
                    <View className="p-3">
                      <View className="rounded-[24px] overflow-hidden bg-black/40">
                        <Image source={{ uri: imageUri }} style={{ width: '100%', height: 350 }} contentFit="cover" />
                      </View>
                    </View>
                    <View className="p-5">
                      <View className="flex-row items-center mb-6 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                        <Ionicons name="checkmark-circle" size={22} color={Colors.emerald[400]} />
                        <Text className="ml-3 text-emerald-400 font-bold">Scan ready</Text>
                      </View>
                      <GradientButton
                        title="Analyze Contents"
                        onPress={handleAnalyze}
                        icon={<Ionicons name="sparkles" size={20} color="white" />}
                      />
                      <Pressable onPress={() => setImageUri(null)} className="mt-4 py-2 items-center">
                        <Text className="text-white/30 font-bold text-xs uppercase tracking-widest">Try another photo</Text>
                      </Pressable>
                    </View>
                  </AnimatedCard>
                ) : (
                  <View className="gap-4">
                    <View className="h-[200px] rounded-[32px] bg-white/5 border-2 border-dashed border-white/20 items-center justify-center">
                      <View className="w-16 h-16 rounded-full bg-accent-600/20 items-center justify-center mb-3">
                        <Ionicons name="camera-outline" size={32} color={Colors.accent[400]} />
                      </View>
                      <Text className="text-white/60 font-semibold text-base">No photo yet</Text>
                      <Text className="text-white/40 font-medium text-sm mt-1">Take or upload a photo to begin</Text>
                    </View>
                    <View className="flex-row gap-4">
                      <Pressable
                        onPress={() => pickImage(true)}
                        className="flex-1 h-[80px] rounded-[20px] bg-accent-600/20 border border-accent-600/30 items-center justify-center active:bg-accent-600/30"
                      >
                        <View className="flex-row items-center gap-3">
                          <Ionicons name="camera" size={24} color={Colors.accent[500]} />
                          <Text className="text-accent-500 font-bold text-base">Take Photo</Text>
                        </View>
                      </Pressable>
                      <Pressable
                        onPress={() => pickImage(false)}
                        className="flex-1 h-[80px] rounded-[20px] bg-accent-600/20 border border-accent-600/30 items-center justify-center active:bg-accent-600/30"
                      >
                        <View className="flex-row items-center gap-3">
                          <Ionicons name="images" size={24} color={Colors.accent[500]} />
                          <Text className="text-accent-500 font-bold text-base">Upload Image</Text>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                )}
              </Animated.View>
            </ScrollView>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
