import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { colors, typography, spacing, borderRadius, MIN_TOUCH_SIZE } from "../../theme";

type ButtonVariant = "primary" | "secondary" | "text" | "danger";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyle: ViewStyle[] = [styles.base];
  const textStyle: TextStyle = styles.textBase;

  switch (variant) {
    case "primary":
      containerStyle.push(styles.primary);
      break;
    case "secondary":
      containerStyle.push(styles.secondary);
      break;
    case "text":
      containerStyle.push(styles.textOnly);
      textStyle.color = colors.accent.secondary;
      break;
    case "danger":
      containerStyle.push(styles.danger);
      break;
  }

  if (isDisabled) {
    containerStyle.push({ opacity: 0.4 });
  }
  if (style) {
    containerStyle.push(style);
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.92}  // 按下加深 ~8%
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "text" ? colors.accent.secondary : colors.text.inverse}
          size="small"
        />
      ) : (
        <Text
          style={[
            textStyle,
            variant === "secondary" && { color: colors.accent.primary },
            variant === "text" && { color: colors.accent.secondary },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    minWidth: MIN_TOUCH_SIZE,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  primary: {
    backgroundColor: colors.accent.primary,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  textOnly: {
    backgroundColor: "transparent",
    height: "auto" as unknown as number,
    minWidth: "auto" as unknown as number,
    paddingHorizontal: 0,
  },
  danger: {
    backgroundColor: colors.semantic.error,
  },
  textBase: {
    ...typography.button,
    color: colors.text.inverse,
  },
});
