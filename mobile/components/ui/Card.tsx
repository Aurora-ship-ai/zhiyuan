import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { colors, spacing, borderRadius } from "../../theme";

interface CardProps { children: React.ReactNode; style?: ViewStyle; featured?: boolean; }

export function Card({ children, style, featured = false }: CardProps) {
  return <View style={[styles.card, colors.shadow.sm, featured && styles.featured, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border.default, padding: spacing.lg,
  },
  featured: { borderColor: colors.border.strong, backgroundColor: "#FBF7F0" },
});
