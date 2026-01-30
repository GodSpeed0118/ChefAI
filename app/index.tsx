import { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAnalyzeImage } from "../src/hooks/useAnalyzeImage";
import { LoadingState } from "../src/components/LoadingState";

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const analyzeImage = useAnalyzeImage();

  const pickImage = async (useCamera: boolean) => {
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        useCamera
          ? "Camera access is needed to photograph your fridge."
          : "Photo library access is needed to select an image.",
      );
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.8,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!imageUri) return;

    analyzeImage.mutate(
      { uri: imageUri },
      {
        onSuccess: (data) => {
          router.push({
            pathname: "/results",
            params: { ingredients: JSON.stringify(data.ingredients) },
          });
        },
        onError: (error) => {
          Alert.alert("Analysis Failed", error.message);
        },
      },
    );
  };

  if (analyzeImage.isPending) {
    return (
      <LoadingState message="Analyzing your fridge contents... This may take a moment." />
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-6 pt-8">
      <Text className="text-center text-2xl font-bold text-gray-900">
        What's in your fridge?
      </Text>
      <Text className="mt-2 text-center text-base text-gray-500">
        Take a photo or pick one from your gallery
      </Text>

      <View className="mt-8 flex-row justify-center gap-4">
        <Pressable
          onPress={() => pickImage(true)}
          className="rounded-xl bg-primary-600 px-6 py-3"
        >
          <Text className="text-base font-semibold text-white">
            📷 Camera
          </Text>
        </Pressable>
        <Pressable
          onPress={() => pickImage(false)}
          className="rounded-xl bg-secondary-500 px-6 py-3"
        >
          <Text className="text-base font-semibold text-white">
            🖼️ Gallery
          </Text>
        </Pressable>
      </View>

      {imageUri && (
        <View className="mt-8 items-center">
          <View className="overflow-hidden rounded-2xl">
            <Image
              source={{ uri: imageUri }}
              style={{ width: 300, height: 300 }}
              contentFit="cover"
            />
          </View>
          <Pressable
            onPress={handleAnalyze}
            className="mt-6 w-full rounded-xl bg-primary-700 py-4"
          >
            <Text className="text-center text-lg font-bold text-white">
              Analyze Ingredients
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
