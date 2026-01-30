import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IngredientTagProps = {
  name: string;
  available: boolean;
  quantity?: string;
};

export function IngredientTag({
  name,
  available,
  quantity,
}: IngredientTagProps) {
  return (
    <View
      className={`mr-3 mb-3 flex-row items-center rounded-2xl px-4 py-2.5 border ${available
          ? "bg-accent-50 border-accent-100"
          : "bg-primary-50 border-primary-100"
        }`}
    >
      <View
        className={`w-1.5 h-1.5 rounded-full mr-2.5 ${available ? "bg-accent-500" : "bg-primary-300"
          }`}
      />
      <Text
        className={`text-sm font-bold capitalize ${available ? "text-accent-700" : "text-primary-600"
          }`}
      >
        {name}
        {quantity && (
          <Text className="text-[10px] font-black opacity-40"> • {quantity}</Text>
        )}
      </Text>
    </View>
  );
}
