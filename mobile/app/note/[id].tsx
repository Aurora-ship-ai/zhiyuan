import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { colors, typography, spacing } from "../../theme";

export default function NoteEditor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [saving, setSaving] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.materialRef}>
          <Text style={styles.label}>资料来源</Text>
          <Text style={styles.materialName}>AI 编程最佳实践（模拟）</Text>
        </View>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>一、核心逻辑</Text>
          <Text style={styles.bodyText}>
            AI 编程经历了五个阶段演化：代码补全 → 对话式编程 → 上下文感知 →
            Agent 工作流 → 自主开发。每个阶段的关键突破和代表工具如下...
          </Text>
          <Input label="我的理解" value="" onChangeText={() => {}} placeholder="点击添加你的理解..." multiline style={{ marginTop: spacing.md }} />
        </Card>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>二、关键概念</Text>
          {["Prompt Engineering", "RAG", "Agent 工作流", "MCP 协议"].map((c) => (
            <View key={c} style={styles.conceptItem}><Text style={styles.bullet}>·</Text><Text style={styles.bodyText}>{c}</Text></View>
          ))}
        </Card>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>三、延伸思考</Text>
          {["AI 生成的代码如何建立有效的 Code Review 流程？", "Agent 自主决策的边界在哪里？如何防止过度自动化？"].map((q, i) => (
            <View key={i} style={styles.questionItem}><Text style={styles.qPrefix}>❓</Text><Text style={styles.bodyText}>{q}</Text></View>
          ))}
        </Card>
        <View style={styles.auxRow}>
          <Button title="思维导图" onPress={() => {}} variant="secondary" style={{ flex: 1 }} />
          <Button title="问答卡片" onPress={() => {}} variant="secondary" style={{ flex: 1 }} />
        </View>
        <Button title={saving ? "保存中..." : "保存笔记"} onPress={() => { setSaving(true); setTimeout(() => setSaving(false), 500); }} loading={saving} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  content: { paddingHorizontal: spacing.pageX, paddingBottom: spacing.xxxl, paddingTop: spacing.lg },
  materialRef: { marginBottom: spacing.xl, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border.default },
  label: { ...typography.caption, color: colors.text.tertiary, marginBottom: spacing.xs },
  materialName: { ...typography.body, color: colors.accent.secondary, fontWeight: "500" as const },
  section: { marginBottom: spacing.lg, gap: spacing.md },
  sectionTitle: { ...typography.h3, color: colors.text.primary },
  bodyText: { ...typography.body, color: colors.text.primary },
  conceptItem: { flexDirection: "row" as const, gap: spacing.sm, marginBottom: spacing.sm },
  bullet: { ...typography.body, color: colors.accent.primary, fontWeight: "700" as const },
  questionItem: { flexDirection: "row" as const, gap: spacing.sm, marginBottom: spacing.md },
  qPrefix: { fontSize: 16 },
  auxRow: { flexDirection: "row" as const, gap: spacing.md, marginTop: spacing.sm },
});
