import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from "react-native";
import { colors, typography, spacing, borderRadius, MIN_TOUCH_SIZE } from "../../theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  title: string; onPress: () => void;
  variant?: ButtonVariant; disabled?: boolean; loading?: boolean; style?: ViewStyle;
}

export function Button({ title, onPress, variant = "primary", disabled = false, loading = false, style }: ButtonProps) {
  const isDisabled = disabled || loading;
  const containerStyle: ViewStyle[] = [styles.base];
  let textColor = colors.text.inverse;

  switch (variant) {
    case "primary": containerStyle.push(styles.primary, colors.shadow.sm); break;
    case "secondary": containerStyle.push(styles.secondary); textColor = colors.accent.primary; break;
    case "ghost": containerStyle.push(styles.ghost); textColor = colors.accent.secondary; break;
    case "danger": containerStyle.push(styles.danger); break;
  }
  if (isDisabled) containerStyle.push({ opacity: 0.4 });
  if (style) containerStyle.push(style);

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} disabled={isDisabled} activeOpacity={0.92}>
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? colors.accent.secondary : textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 46, minWidth: MIN_TOUCH_SIZE, borderRadius: borderRadius.md,
    justifyContent: "center", alignItems: "center", paddingHorizontal: spacing.lg,
  },
  primary: { backgroundColor: colors.accent.primary },
  secondary: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: colors.accent.primary },
  ghost: { backgroundColor: "transparent", height: "auto" as any, minWidth: "auto" as any, paddingHorizontal: 0 },
  danger: { backgroundColor: colors.semantic.error },
  text: { ...typography.button, color: colors.text.inverse },
});
