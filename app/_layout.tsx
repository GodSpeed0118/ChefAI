import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { OfflineBanner } from "../src/components/common/OfflineBanner";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { queryClient } from "../src/lib/queryClient";
import { NotificationService } from "../src/services/NotificationService";
import { SyncService } from "../src/services/SyncService";

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = SyncService.init();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      NotificationService.registerForPushNotificationsAsync();
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // User is not signed in and not on an auth screen, redirect to login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // User is signed in but on an auth screen, redirect to home
      router.replace("/");
    }
  }, [user, segments, isLoading]);

  // Show loading screen while auth is initializing
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0f1129]">
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  return (
    <>
      <OfflineBanner />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0f1129" },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
