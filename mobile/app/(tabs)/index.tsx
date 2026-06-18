import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SearchBar } from "../../components/ui/SearchBar";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { Button } from "../../components/ui/Button";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { Star, ExternalLink, BookmarkPlus } from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

// --- 模拟数据（Phase 1 后续替换为 API 调用） ---
const MOCK_RESULTS = [
  {
    id: "1",
    title: "AI 编程最佳实践：从 Prompt Engineering 到 Agent 工作流",
    source: "Towards Data Science",
    date: "2025-01-10",
    score: 4.8,
    summary: "系统梳理了 AI 辅助编程的五个层次，从代码补全到自主 Agent，附真实项目案例与 Prompt 模板。",
    tags: ["AI", "编程", "实践指南"],
    reachable: true,
  },
  {
    id: "2",
    title: "Building Effective AI Agents with LangChain",
    source: "LangChain 官方文档",
    date: "2025-01-05",
    score: 4.6,
    summary: "Agent 架构设计模式详解：ReAct、Planning、Multi-Agent 协作。含完整代码示例。",
    tags: ["Agent", "LangChain", "架构"],
    reachable: true,
  },
  {
    id: "3",
    title: "Cursor 与 Copilot 深度对比：2025 年 AI 编程工具选型指南",
    source: "掘金技术社区",
    date: "2025-01-02",
    score: 4.5,
    summary: "从代码质量、上下文理解、多文件编辑三个维度实测对比，附带各工具最佳使用场景。",
    tags: ["工具对比", "Cursor", "Copilot"],
    reachable: true,
  },
];

const TYPE_FILTERS = ["全部", "网页", "论文", "视频", "书籍", "播客"];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("全部");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(MOCK_RESULTS);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    // TODO: 替换为 API 调用
    setTimeout(() => {
      setResults(MOCK_RESULTS);
      setLoading(false);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索区域 */}
      <View style={styles.searchSection}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          placeholder="搜索你想学的任何主题..."
        />
        {/* 类型筛选 */}
        <View style={styles.filterRow}>
          {TYPE_FILTERS.map((f) => (
            <Tag
              key={f}
              label={f}
              selected={activeFilter === f}
              onPress={() => setActiveFilter(f)}
            />
          ))}
        </View>
      </View>

      {/* 结果列表 */}
      {loading ? (
        <View style={styles.list}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleSearch}
              tintColor={colors.accent.gold}
            />
          }
          ListEmptyComponent={
            query.length > 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>暂无结果</Text>
                <Text style={styles.emptyHint}>尝试换个关键词，或扩大搜索范围</Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>搜索你想学的主题</Text>
                <Text style={styles.emptyHint}>
                  支持网页、论文、视频、书籍、播客等全类型资料
                </Text>
              </View>
            )
          }
          renderItem={({ item }) => (
            <Card>
              <View style={styles.cardHeader}>
                <View style={styles.scoreBadge}>
                  <Star size={12} color={colors.accent.gold} fill={colors.accent.gold} />
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
                <Text style={styles.source}>{item.source} · {item.date}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSummary} numberOfLines={2}>
                {item.summary}
              </Text>

              {/* 标签 */}
              <View style={styles.tagRow}>
                {item.tags.map((tag) => (
                  <Tag key={tag} label={tag} />
                ))}
              </View>

              {/* 操作按钮 */}
              <View style={styles.cardActions}>
                {item.reachable ? (
                  <TouchableOpacity style={styles.actionLink}>
                    <ExternalLink size={16} color={colors.accent.secondary} />
                    <Text style={styles.actionText}>直达</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.actionDisabled}>需跳转外部</Text>
                )}
                <TouchableOpacity style={styles.actionLink}>
                  <BookmarkPlus size={16} color={colors.accent.secondary} />
                  <Text style={styles.actionText}>收藏</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  searchSection: {
    paddingHorizontal: spacing.pageX,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background.primary,
    gap: spacing.md,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.pageX,
    paddingBottom: spacing.xxl,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F5E6D0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  scoreText: {
    ...typography.caption,
    color: colors.accent.gold,
    fontWeight: "600",
  },
  source: {
    ...typography.caption,
    color: colors.text.tertiary,
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardSummary: {
    ...typography.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  cardActions: {
    flexDirection: "row",
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  actionLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.xs,
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.accent.secondary,
    fontWeight: "500",
  },
  actionDisabled: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text.secondary,
  },
  emptyHint: {
    ...typography.bodySmall,
    color: colors.text.tertiary,
    textAlign: "center",
    paddingHorizontal: spacing.xxl,
  },
});
