import { Pressable, View } from "react-native";
import { Txt, useTheme } from "../design/ui";

export function GameChoice({
  title,
  description,
  label = title,
  onPress,
  disabled = false,
}: {
  title: string;
  description: string;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 44,
        borderWidth: 1,
        borderColor: t.controlLine,
        borderRadius: 18,
        padding: 17,
        backgroundColor: t.card,
        opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
      })}
    >
      <View style={{ gap: 5 }}>
        <Txt weight="bold">{title}</Txt>
        <Txt muted size={14}>
          {description}
        </Txt>
      </View>
    </Pressable>
  );
}
