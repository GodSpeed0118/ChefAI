import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientButton } from "../../src/components/common/GradientButton";
import { useAuth } from "../../src/context/AuthContext";
import { SecureStorage } from "../../src/services/SecureStorage";
import { Colors } from "../../src/theme/Colors";
import { Gradients } from "../../src/theme/Gradients";
import { Spacing } from "../../src/theme/Spacing";
import { Typography } from "../../src/theme/Typography";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const router = useRouter();
  const { signIn, resetPassword } = useAuth();

  useEffect(() => {
    checkRememberMe();
  }, []);

  const checkRememberMe = async () => {
    const savedEmail = await SecureStorage.getItem('chef_ai_remember_me');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    setErrors({});
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { error } = await signIn(email.trim(), password);
      if (error) {
        setErrors({ general: error });
      } else {
        if (rememberMe) {
          await SecureStorage.setItem('chef_ai_remember_me', email.trim());
        } else {
          await SecureStorage.removeItem('chef_ai_remember_me');
        }
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "Enter a valid email to reset password" });
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email.trim());
    setIsLoading(false);

    if (error) {
      Alert.alert("Error", error);
    } else {
      Alert.alert("Success", "Password reset email sent!");
    }
  };

  return (
    <View className="flex-1 bg-primary-950">
      <LinearGradient colors={Gradients.background as any} style={StyleSheet.absoluteFill} />
      <SafeAreaView className="flex-1">
        <StatusBar style="light" />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-8 pt-12 pb-8">
              {/* Logo / Header */}
              <Animated.View
                entering={FadeInUp.duration(800).delay(200)}
                className="items-center mb-16"
              >
                <View className="w-20 h-20 rounded-[32px] bg-accent-500 items-center justify-center shadow-xl shadow-accent-500/40 mb-6">
                  <Ionicons name="restaurant" size={38} color="white" />
                </View>
                <Text style={{ fontSize: Typography.size.huge, fontWeight: Typography.weight.black as any }} className="text-white italic tracking-tighter">
                  chef<Text className="text-accent-500">ai</Text>.
                </Text>
                <Text style={{ fontSize: Typography.size.tiny, letterSpacing: Typography.tracking.widest }} className="text-white/40 font-bold uppercase mt-2">
                  Premium Culinary Assistant
                </Text>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(600).delay(400)}>
                <Text style={{ fontSize: Typography.size.xxl, fontWeight: Typography.weight.black as any }} className="text-white mb-2">Welcome Back</Text>
                <Text style={{ fontSize: Typography.size.md }} className="text-white/40 font-medium mb-10">
                  Sign in to your kitchen vault.
                </Text>
              </Animated.View>

              {/* Error Message */}
              {errors.general && (
                <Animated.View entering={FadeInDown} className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex-row items-center">
                  <Ionicons name="alert-circle" size={20} color={Colors.rose[500]} />
                  <Text className="ml-3 text-rose-400 font-bold flex-1">{errors.general}</Text>
                </Animated.View>
              )}

              {/* Form */}
              <View style={{ gap: Spacing.lg }}>
                <Animated.View entering={FadeInDown.duration(600).delay(600)}>
                  <Text style={styles.inputLabel}>Email Vault</Text>
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

                <Animated.View entering={FadeInDown.duration(600).delay(800)}>
                  <View className="flex-row justify-between items-end mb-2 ml-1">
                    <Text style={styles.inputLabel}>Secure Pin</Text>
                    <Pressable onPress={handleForgotPassword}>
                      <Text style={[styles.inputLabel, { color: Colors.accent[500], textTransform: 'none' }]}>Forgot Access?</Text>
                    </Pressable>
                  </View>
                  <View className={`flex-row items-center bg-white/5 border rounded-2xl px-4 ${focusedInput === 'password' ? "border-accent-500/50 bg-white/10" : errors.password ? "border-rose-500/50" : "border-white/10"}`}>
                    <Ionicons name="lock-closed-outline" size={20} color="white" style={{ opacity: focusedInput === 'password' ? 0.8 : 0.3 }} />
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="••••••••"
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

                <Animated.View entering={FadeInDown.duration(600).delay(1000)} className="flex-row items-center justify-between px-1">
                  <View className="flex-row items-center">
                    <Switch
                      value={rememberMe}
                      onValueChange={setRememberMe}
                      trackColor={{ false: "#334155", true: Colors.accent[500] }}
                      thumbColor="white"
                    />
                    <Text className="text-white/40 font-bold ml-2 text-xs">Remember Me</Text>
                  </View>
                </Animated.View>

                <Animated.View entering={FadeInDown.duration(600).delay(1200)} className="mt-4">
                  <GradientButton
                    title={isLoading ? "Accessing..." : "Sign In"}
                    onPress={handleSignIn}
                    disabled={isLoading}
                  />
                </Animated.View>
              </View>

              <Animated.View
                entering={FadeInDown.duration(600).delay(1400)}
                className="flex-1 justify-end pt-12"
              >
                <View className="flex-row justify-center items-center">
                  <Text style={{ fontSize: Typography.size.md }} className="text-white/40 font-medium">New Chef? </Text>
                  <Pressable onPress={() => router.push("/(auth)/register")}>
                    <Text style={{ fontSize: Typography.size.md }} className="text-accent-400 font-black">Create Account</Text>
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
    marginBottom: Spacing.xs,
  },
});
