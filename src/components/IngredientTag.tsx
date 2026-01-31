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
        ? "bg-emerald-500/10 border-emerald-500/20"
        : "bg-rose-500/10 border-rose-500/20"
        }`}
    >
      <View
        className={`w-1.5 h-1.5 rounded-full mr-2.5 ${available ? "bg-emerald-400" : "bg-rose-400"
          }`}
      />
      <Text
        className={`text-sm font-bold capitalize ${available ? "text-emerald-400" : "text-rose-400"
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
