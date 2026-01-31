import { Text, View } from "react-native";

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
        ? "bg-accent-500/10 border-accent-500/20"
        : "bg-white/5 border-white/10"
        }`}
    >
      <View
        className={`w-1.5 h-1.5 rounded-full mr-2.5 ${available ? "bg-accent-400" : "bg-white/20"
          }`}
      />
      <Text
        className={`text-sm font-bold capitalize ${available ? "text-accent-400" : "text-white/40"
          }`}
      >
        {name}
        {quantity && (
          <Text className="text-[10px] font-black opacity-30"> • {quantity}</Text>
        )}
      </Text>
    </View>
  );
}
