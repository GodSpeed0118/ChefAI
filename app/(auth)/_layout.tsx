import { Stack, useRouter, useSegments } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useEffect } from "react";

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
        contentStyle: { backgroundColor: "#1e214f" },
      }}
    />
  );
}
