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
        <Text style={styles.title}>AI 编程最佳实践（模拟内容）</Text>
        <Text style={styles.meta}>来源：Towards Data Science · 2025-01-10</Text>
        <View style={styles.tagRow}><Tag label="AI" /><Tag label="编程" /><Tag label="实践指南" /></View>
        <View style={styles.divider} />
        <Text style={styles.body}>
          本文系统梳理了 AI 辅助编程的五个层次，从代码补全到自主 Agent。
          附真实项目案例与 Prompt 模板，帮助开发者在实际工作中高效运用 AI 工具。
          {"\n\n"}（此处为模拟正文，实际使用时将展示缓存的完整内容或嵌入网页视图）
        </Text>
        <View style={styles.actions}>
          <Button title="生成复习笔记" onPress={() => router.push("/note/1")} />
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
