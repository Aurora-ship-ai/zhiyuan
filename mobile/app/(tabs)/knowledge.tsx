import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { SearchBar } from "../../components/ui/SearchBar";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { FileText, Clock } from "lucide-react-native";

const MOCK_KNOWLEDGE = [
  { id: "1", title: "AI 编程最佳实践", tags: ["AI", "编程", "最佳实践"], materialCount: 1, date: "2025-01-15" },
  { id: "2", title: "React Native 性能优化", tags: ["React Native", "性能", "移动端"], materialCount: 2, date: "2025-01-10" },
  { id: "3", title: "数据库索引设计", tags: ["数据库", "索引", "后端"], materialCount: 1, date: "2025-01-05" },
];

export default function KnowledgeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>知识库</Text>
        <Text style={styles.subtitle}>所有学习沉淀都在这里</Text>
        <SearchBar
          value=""
          onChangeText={() => {}}
          placeholder="搜索笔记或描述你想找的..."
        />
      </View>

      <FlatList
        data={MOCK_KNOWLEDGE}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <View style={styles.tagRow}>
              {item.tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </View>
            <View style={styles.meta}>
              <View style={styles.metaItem}>
                <FileText size={14} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{item.materialCount} 份资料</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
            </View>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { paddingHorizontal: spacing.pageX, paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.sm },
  pageTitle: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.bodySmall, color: colors.text.tertiary, marginBottom: spacing.sm },
  list: { paddingHorizontal: spacing.pageX, paddingBottom: spacing.xxl },
  itemTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.sm },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  meta: { flexDirection: "row", gap: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.default },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { ...typography.caption, color: colors.text.tertiary },
});
