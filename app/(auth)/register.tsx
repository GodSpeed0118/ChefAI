import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../../src/components/common/GradientButton";
import { useAuth } from "../../src/context/AuthContext";
import { Colors } from "../../src/theme/Colors";
import { Gradients } from "../../src/theme/Gradients";
import { Spacing } from "../../src/theme/Spacing";
import { Typography } from "../../src/theme/Typography";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const router = useRouter();
  const { signUp } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid email required";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { error } = await signUp(email.trim(), password);
      if (error) {
        setErrors({ general: error });
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-primary-950">
        <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
        <SafeAreaView className="flex-1 items-center justify-center px-8">
          <Animated.View entering={FadeInUp.duration(600)} className="items-center">
            <View className="w-24 h-24 rounded-[40px] bg-emerald-500 items-center justify-center shadow-xl shadow-emerald-500/40 mb-8">
              <Ionicons name="mail-unread" size={44} color="white" />
            </View>
            <Text style={{ fontSize: Typography.size.xxl, fontWeight: Typography.weight.black as any }} className="text-white text-center mb-4">Check Your Inbox</Text>
            <Text style={{ fontSize: Typography.size.md }} className="text-white/60 text-center mb-12">
              We've sent a verification link to {email}. Please verify your account to continue.
            </Text>
            <View className="w-full">
              <GradientButton title="Back to Login" onPress={() => router.replace("/(auth)/login")} />
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-950">
      <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View className="flex-1 px-8 pt-10 pb-8">
              <Animated.View entering={FadeInUp.duration(800).delay(200)} className="items-center mb-12">
                <View className="w-16 h-16 rounded-[24px] bg-accent-500 items-center justify-center shadow-lg mb-4">
                  <Ionicons name="restaurant" size={30} color="white" />
                </View>
                <Text style={{ fontSize: Typography.size.huge, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tighter">
                  chef<Text className="text-accent-500">ai</Text>.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(600).delay(400)}>
                <Text style={{ fontSize: Typography.size.xxl, fontWeight: Typography.weight.black as any }} className="text-white mb-2">Create Account</Text>
                <Text style={{ fontSize: Typography.size.md }} className="text-white/40 font-medium mb-8">Join the elite culinary circle.</Text>
              </Animated.View>

              {errors.general && (
                <Animated.View entering={FadeInDown} className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex-row items-center">
                  <Ionicons name="alert-circle" size={20} color={Colors.rose[500]} />
                  <Text className="ml-3 text-rose-400 font-bold flex-1">{errors.general}</Text>
                </Animated.View>
              )}

              <View style={{ gap: Spacing.lg }}>
                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                  <Text style={styles.inputLabel}>Email Address</Text>
                  <View className={`flex-row items-center bg-white/5 border rounded-2xl px-4 transition-all ${focusedInput === 'email' ? "border-accent-500/50 bg-white/10" : errors.email ? "border-rose-500/50" : "border-white/10"}`}>
                    <Ionicons name="mail-outline" size={20} color="white" style={{ opacity: focusedInput === 'email' ? 0.8 : 0.3 }} />
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      className="flex-1 text-white py-5 px-4 text-base font-medium"
                      autoCapitalize="none"
                      editable={!isLoading}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(1000)}>
                  <Text style={styles.inputLabel}>Secure Password</Text>
                  <View className={`flex-row items-center bg-white/5 border rounded-2xl px-4 ${focusedInput === 'password' ? "border-accent-500/50 bg-white/10" : errors.password ? "border-rose-500/50" : "border-white/10"}`}>
                    <Ionicons name="lock-closed-outline" size={20} color="white" style={{ opacity: focusedInput === 'password' ? 0.8 : 0.3 }} />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Min 6 characters"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      secureTextEntry={!showPassword}
                      className="flex-1 text-white py-5 px-4 text-base font-medium"
                      editable={!isLoading}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="white" style={{ opacity: 0.3 }} />
                    </Pressable>
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(1200)}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View className={`flex-row items-center bg-white/5 border rounded-2xl px-4 ${focusedInput === 'confirm' ? "border-accent-500/50 bg-white/10" : errors.confirmPassword ? "border-rose-500/50" : "border-white/10"}`}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="white" style={{ opacity: focusedInput === 'confirm' ? 0.8 : 0.3 }} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setFocusedInput('confirm')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Repeat password"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      secureTextEntry={!showPassword}
                      className="flex-1 text-white py-5 px-4 text-base font-medium"
                      editable={!isLoading}
                    />
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(1400)} className="mt-4">
                  <GradientButton title={isLoading ? "Enrolling..." : "Create Account"} onPress={handleSignUp} disabled={isLoading} />
                </Animated.View>
              </View>

              <Animated.View entering={FadeInDown.duration(600).delay(1600)} className="flex-1 justify-end pt-12">
                <View className="flex-row justify-center items-center">
                  <Text style={{ fontSize: Typography.size.md }} className="text-white/40 font-medium">Have access? </Text>
                  <Pressable onPress={() => router.push("/(auth)/login")}>
                    <Text style={{ fontSize: Typography.size.md }} className="text-white font-black">Sign In</Text>
                  </Pressable>
                </View>
              </Animated.View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: Typography.size.tiny,
    letterSpacing: Typography.tracking.widest,
    color: 'rgba(255,255,255,0.3)',
    fontWeight: Typography.weight.black as any,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
});
