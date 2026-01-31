import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../src/context/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const router = useRouter();
  const { signIn } = useAuth();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    // Clear previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(email.trim(), password);

      if (error) {
        setErrors({ general: error });
      }
      // Navigation happens automatically via auth state change
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-950">
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
          <View className="flex-1 px-6 pt-8 pb-6">
            {/* Header */}
            <View className="mb-12">
              <View className="flex-row items-center mb-4">
                <Ionicons name="basket" size={32} color="#6366f1" />
                <Text className="ml-2 text-3xl font-black text-white italic tracking-tighter">
                  chef<Text className="text-accent-500">ai</Text>.
                </Text>
              </View>
              <Text className="text-white text-4xl font-black mb-2">Welcome Back</Text>
              <Text className="text-white/60 text-base">
                Sign in to access your saved recipes
              </Text>
            </View>

            {/* Error Message */}
            {errors.general && (
              <View className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#ef4444" />
                <Text className="ml-3 text-red-400 flex-1">{errors.general}</Text>
              </View>
            )}

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-white/80 text-sm font-semibold mb-2 ml-1">Email</Text>
              <View
                className={`flex-row items-center bg-white/5 border rounded-2xl px-4 ${
                  errors.email ? "border-red-500/50" : "border-white/10"
                }`}
              >
                <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="your@email.com"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  returnKeyType="next"
                  className="flex-1 text-white py-4 px-3 text-base"
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text className="text-red-400 text-xs mt-1 ml-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-white/80 text-sm font-semibold mb-2 ml-1">Password</Text>
              <View
                className={`flex-row items-center bg-white/5 border rounded-2xl px-4 ${
                  errors.password ? "border-red-500/50" : "border-white/10"
                }`}
              >
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                  className="flex-1 text-white py-4 px-3 text-base"
                  editable={!isLoading}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>
              {errors.password && (
                <Text className="text-red-400 text-xs mt-1 ml-1">{errors.password}</Text>
              )}
            </View>

            {/* Sign In Button */}
            <Pressable
              onPress={handleSignIn}
              disabled={isLoading}
              className={`bg-white rounded-2xl py-4 mb-4 shadow-lg ${
                isLoading ? "opacity-60" : "active:bg-gray-100"
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isLoading ? (
                  <>
                    <Ionicons name="hourglass-outline" size={20} color="#1e214f" />
                    <Text className="text-primary-950 text-base font-bold ml-2">Signing in...</Text>
                  </>
                ) : (
                  <>
                    <Text className="text-primary-950 text-base font-bold mr-2">Sign In</Text>
                    <Ionicons name="arrow-forward" size={20} color="#1e214f" />
                  </>
                )}
              </View>
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-white/10" />
              <Text className="text-white/40 text-sm mx-4">or</Text>
              <View className="flex-1 h-px bg-white/10" />
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-white/60 text-base">Don't have an account? </Text>
              <Pressable
                onPress={() => router.push("/(auth)/register")}
                disabled={isLoading}
                className="active:opacity-70"
              >
                <Text className="text-white text-base font-bold">Sign Up</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
