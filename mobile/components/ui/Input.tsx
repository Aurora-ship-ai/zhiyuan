import React from "react";
import { TextInput, View, Text, StyleSheet, ViewStyle } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiline?: boolean;
  style?: ViewStyle;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  multiline = false,
  style,
}: InputProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    fontWeight: "500" as const,
  },
  input: {
    ...typography.body,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.text.primary,
    minHeight: 48,
  },
  multiline: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.semantic.error,
  },
  error: {
    ...typography.caption,
    color: colors.semantic.error,
  },
});
