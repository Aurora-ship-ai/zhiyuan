import React from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Button } from "../../components/ui/Button";
import { Tag } from "../../components/ui/Tag";
import { colors, typography, spacing } from "../../theme";

export default function MaterialDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>...</</Text>
        <Text style={styles.meta}>...</</Text>
        <View style={styles.tagRow}><Tag label="AI" /><Tag label="编程" /><Tag label="实践指南" /></View>
        <View style={styles.divider} />
        <Text style={styles.body}>...</</Text>
        <View style={styles.actions}>
          <Button title="生成Notes" onPress={() => router.push("/note/1")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { paddingHorizontal: spacing.pageX, paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, color: colors.text.primary, marginBottom: spacing.sm },
  meta: { ...typography.caption, color: colors.text.tertiary, marginBottom: spacing.md },
  tagRow: { flexDirection: "row" as const, gap: spacing.xs, marginBottom: spacing.lg },
  divider: { height: 1, backgroundColor: colors.border.default, marginBottom: spacing.lg },
  body: { ...typography.body, color: colors.text.primary },
  actions: { marginTop: spacing.xl },
});
