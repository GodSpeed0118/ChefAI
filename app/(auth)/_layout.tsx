import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "../../src/context/AuthContext";

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If user is authenticated and on an auth screen, redirect to home
    const inAuthGroup = segments[0] === "(auth)";
    if (user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, segments, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0f1129" },
      }}
    />
  );
}
