import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Search, X } from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "搜索学习资料...",
  onSubmit,
}: SearchBarProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Search size={20} color={colors.text.tertiary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.clearButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <X size={16} color={colors.text.tertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: "transparent",
  },
  focused: {
    backgroundColor: colors.background.primary,
    borderColor: colors.accent.primary,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text.primary,
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
});
