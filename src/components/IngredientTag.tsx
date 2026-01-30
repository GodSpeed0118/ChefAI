import { View, Text } from "react-native";

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
      className={`mr-2 mb-2 rounded-full px-3 py-1 ${
        available ? "bg-primary-100" : "bg-secondary-100"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          available ? "text-primary-800" : "text-secondary-800"
        }`}
      >
        {quantity ? `${name} (${quantity})` : name}
      </Text>
    </View>
  );
}
