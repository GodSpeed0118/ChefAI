import { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useAnalyzeImage } from "../src/hooks/useAnalyzeImage";
import { LoadingState } from "../src/components/LoadingState";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { useAuth } from "../src/context/AuthContext";

const CATEGORIES = [
  { id: 'all', name: 'All', icon: 'grid-outline' },
  { id: 'bakery', name: 'Bakery', icon: 'restaurant-outline' },
  { id: 'fruits', name: 'Fruits', icon: 'nutrition-outline' },
  { id: 'meat', name: 'Meat', icon: 'fast-food-outline' },
  { id: 'vegetables', name: 'Veggie', icon: 'leaf-outline' },
  { id: 'dairy', name: 'Dairy', icon: 'water-outline' },
];

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const router = useRouter();
  const analyzeImage = useAnalyzeImage();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const pickImage = async (useCamera: boolean) => {
    if (useCamera && !Device.isDevice && Platform.OS !== 'web') {
      Alert.alert(
        "Simulator Mode",
        "The camera is not available on this simulator. I've automatically loaded a sample fridge image for you to test the analysis!",
        [{
          text: "Great!", onPress: () => {
            setImageUri("https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop");
          }
        }]
      );
      return;
    }

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

    try {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      Alert.alert("Error", "An unexpected error occurred while picking the image.");
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

  return (
    <SafeAreaView className="flex-1 bg-primary-950">
      <StatusBar style="light" />

      {analyzeImage.isPending ? (
        <LoadingState message="Analyzing your fridge contents... This may take a moment." />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header */}
          <View className="px-6 pt-4 pb-4 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="basket" size={24} color="#6366f1" />
              <Text className="ml-2 text-2xl font-black text-white italic tracking-tighter">
                chef<Text className="text-accent-500">ai</Text>.
              </Text>
            </View>
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => router.push("/saved")}
                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
              >
                <Ionicons name="heart-outline" size={22} color="white" />
              </Pressable>
              <Pressable
                onPress={handleSignOut}
                className="w-10 h-10 rounded-full bg-white/10 items-center justify-center active:bg-white/20"
              >
                <Ionicons name="log-out-outline" size={22} color="white" />
              </Pressable>
            </View>
          </View>


          {/* Promo Banner / Featured */}
          <View className="px-6 mb-8">
            <View className="bg-accent-600 rounded-3xl p-6 flex-row items-center overflow-hidden">
              <View className="flex-1">
                <Text className="text-white text-3xl font-black mb-1">Smart Scan</Text>
                <Text className="text-white/80 text-sm font-medium leading-5">
                  Scan multiple items at once to unlock the most creative and delicious results!
                </Text>
              </View>
              <View className="bg-white/20 p-4 rounded-2xl rotate-12">
                <Ionicons name="restaurant" size={40} color="white" />
              </View>
            </View>
          </View>

          {/* Categories */}
          <View className="mb-8">
            <View className="px-6 flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Categories</Text>
              <Pressable>
                <Text className="text-accent-400 font-bold">View all</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  className={`mr-4 items-center justify-center p-4 rounded-3xl border ${activeCategory === cat.id
                    ? "bg-accent-500 border-accent-400"
                    : "bg-white/5 border-white/10"
                    }`}
                  style={{ width: 85, height: 95 }}
                >
                  <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-2 ${activeCategory === cat.id ? "bg-white/20" : "bg-white/10"
                    }`}>
                    <Ionicons name={cat.icon as any} size={24} color="white" />
                  </View>
                  <Text className="text-white text-[10px] font-bold uppercase tracking-widest">{cat.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Fridge Scanner Card */}
          <View className="px-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl font-bold">Your Fridge</Text>
            </View>

            {imageUri ? (
              <View className="bg-white rounded-4xl p-2 shadow-2xl overflow-hidden">
                <View className="rounded-[28px] overflow-hidden">
                  <Image
                    source={{ uri: imageUri }}
                    style={{ width: '100%', height: 350 }}
                    contentFit="cover"
                  />
                </View>
                <View className="p-5">
                  <View className="flex-row items-center mb-4 bg-emerald-50 p-3 rounded-2xl">
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                    <Text className="ml-3 text-emerald-800 font-bold">Photo ready for analysis</Text>
                  </View>

                  <Pressable
                    onPress={handleAnalyze}
                    className="bg-emerald-500 rounded-2xl py-5 shadow-lg active:bg-emerald-600 active:scale-[0.98]"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-center text-xl font-bold text-white mr-2">
                        Analyze Now
                      </Text>
                      <Ionicons name="sparkles" size={20} color="white" />
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => setImageUri(null)}
                    className="mt-4 py-2"
                  >
                    <Text className="text-center text-primary-400 font-bold">Try different photo</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="bg-white rounded-4xl p-6 shadow-2xl items-center border border-primary-100">
                <View className="w-20 h-20 bg-primary-50 rounded-3xl items-center justify-center mb-6">
                  <Ionicons name="camera" size={40} color="#6366f1" />
                </View>
                <Text className="text-2xl font-black text-primary-950 mb-2">Build Your Pantry</Text>
                <Text className="text-primary-500 text-center mb-8 px-4 leading-5">
                  Snap a photo of all your ingredients together for the best meal suggestions.
                </Text>

                <View className="flex-row gap-4 w-full">
                  <Pressable
                    onPress={() => pickImage(true)}
                    className="flex-1 bg-primary-950 rounded-2xl py-4 items-center justify-center flex-row shadow-md active:opacity-90"
                  >
                    <Ionicons name="camera" size={20} color="white" className="mr-2" />
                    <Text className="text-white font-bold ml-2">Camera</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => pickImage(false)}
                    className="flex-1 bg-emerald-500 rounded-2xl py-4 items-center justify-center flex-row shadow-md active:bg-emerald-600 active:scale-[0.98]"
                  >
                    <Ionicons name="images" size={20} color="white" className="mr-2" />
                    <Text className="text-white font-bold ml-2">Gallery</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
