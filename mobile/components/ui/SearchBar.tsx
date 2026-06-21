import React, { useState } from "react";
// TODO: re-add icons via @expo/vector-icons
import { colors, typography, spacing, borderRadius } from "../../theme";

interface SearchBarProps { value: string; onChangeText: (text: string) => void; placeholder?: string; onSubmit?: () => void; }

export function SearchBar({ value, onChangeText, placeholder = "...", onSubmit }: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, colors.shadow.sm, focused && styles.focused]}>
      <Search size={20} color={focused ? colors.accent.primary : colors.text.tertiary} style={styles.icon} />
      <TextInput
        style={styles.input} value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={colors.text.tertiary}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onSubmitEditing={onSubmit} returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} style={styles.clear} hitSlop={8}>
          <X size={16} color={colors.text.tertiary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#FFFFFF", borderRadius: borderRadius.lg,
    paddingHorizontal: 18, height: 54,
    borderWidth: 1, borderColor: colors.border.default,
  },
  focused: {
    borderColor: colors.accent.primary, borderWidth: 1.5,
    shadowColor: colors.accent.primary, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  icon: { marginRight: 12 },
  input: { flex: 1, ...typography.body, color: colors.text.primary, paddingVertical: 0 },
  clear: { marginLeft: spacing.sm },
});
