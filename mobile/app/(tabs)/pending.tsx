import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { colors, typography, spacing } from "../../theme";
import { Clock, ExternalLink } from "lucide-react-native";

const MOCK_PENDING = [
  { id: "1", title: "Transformer 架构深度解析", source: "arXiv", savedAt: "3 天前", tags: ["深度学习", "Transformer"] },
  { id: "2", title: "TypeScript 类型体操实战", source: "GitHub", savedAt: "1 周前", tags: ["TypeScript", "编程"] },
];

export default function PendingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>待学清单</Text>
        <Text style={styles.subtitle}>收藏的资料，有空再读</Text>
      </View>

      <FlatList
        data={MOCK_PENDING}
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
                <ExternalLink size={14} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{item.source}</Text>
              </View>
              <View style={styles.metaItem}>
                <Clock size={14} color={colors.text.tertiary} />
                <Text style={styles.metaText}>{item.savedAt}</Text>
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
  header: { paddingHorizontal: spacing.pageX, paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.xs },
  pageTitle: { ...typography.h1, color: colors.text.primary },
  subtitle: { ...typography.bodySmall, color: colors.text.tertiary },
  list: { paddingHorizontal: spacing.pageX, paddingBottom: spacing.xxl },
  itemTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.sm },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  meta: { flexDirection: "row", gap: spacing.lg, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.default },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { ...typography.caption, color: colors.text.tertiary },
});
