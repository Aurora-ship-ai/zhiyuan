import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

interface TagProps { label: string; selected?: boolean; onPress?: () => void; }

export function Tag({ label, selected = false, onPress }: TagProps) {
  return (
    <TouchableOpacity
      style={[styles.tag, selected && styles.selected]}
      onPress={onPress} disabled={!onPress} activeOpacity={onPress ? 0.8 : 1}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: colors.background.elevated, borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 5, alignSelf: "flex-start",
    borderWidth: 1, borderColor: "transparent",
  },
  selected: { backgroundColor: colors.text.primary, borderColor: colors.text.primary },
  text: { ...typography.label, color: colors.text.secondary },
  textSelected: { color: colors.text.inverse, fontWeight: "600" },
});
