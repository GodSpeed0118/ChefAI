import "../global.css";
import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/lib/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f0fdf4" },
          headerTintColor: "#15803d",
          headerTitleStyle: { fontWeight: "bold" },
          contentStyle: { backgroundColor: "#f9fafb" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "ChefAI" }}
        />
        <Stack.Screen
          name="results"
          options={{ title: "Recipes" }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
