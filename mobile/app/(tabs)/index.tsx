import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from "react-native";
import { SearchBar } from "../../components/ui/SearchBar";
import { Card } from "../../components/ui/Card";
import { Tag } from "../../components/ui/Tag";
import { CardSkeleton } from "../../components/ui/Skeleton";
import { Star, ExternalLink, Bookmark } from "lucide-react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";

const TYPE_FILTERS = ["全部", "文章", "论文", "视频", "书籍", "播客"];

const MOCK_RESULTS = [
  {
    id: "1", title: "Building Effective Agents", source: "Anthropic 官方",
    date: "2025-01-12", score: 9.2, featured: true,
    summary: "Anthropic 工程团队撰写的 Agent 构建权威指南——从简单工作流到自主 Agent，LLM 在工程中的角色定位与设计模式。",
    tags: ["Agent", "LLM", "架构模式"], reachable: true,
  },
  {
    id: "2", title: "AI 编程最佳实践：从 Prompt Engineering 到 Agent 工作流",
    source: "Towards Data Science", date: "2025-01-10", score: 4.8,
    summary: "系统梳理 AI 辅助编程的五个层次，附真实项目案例与 Prompt 模板。",
    tags: ["AI Coding", "Prompt", "工程实践"], reachable: true,
  },
  {
    id: "3", title: "Building Effective AI Agents with LangChain",
    source: "LangChain 官方文档", date: "2025-01-05", score: 4.6,
    summary: "Agent 架构设计模式详解：ReAct、Planning、Multi-Agent 协作，含完整代码示例。",
    tags: ["Agent", "LangChain", "ReAct"], reachable: true,
  },
  {
    id: "4", title: "Cursor 与 Copilot 深度对比：2025 AI 编程工具选型",
    source: "掘金技术社区", date: "2025-01-02", score: 4.5,
    summary: "代码质量、上下文理解、多文件编辑三方面实测，附带工具最佳使用场景。",
    tags: ["工具对比", "Cursor", "Copilot"], reachable: true,
  },
];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("全部");
  const [loading, setLoading] = useState(false);
  const [results] = useState(MOCK_RESULTS);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const ScoreBadge = ({ score, featured = false }: { score: number; featured?: boolean }) => {
    const bg = featured ? colors.accent.secondaryDim : score >= 9 ? "#E8F0E2" : colors.accent.goldDim;
    const fg = featured ? colors.accent.secondary : score >= 9 ? colors.accent.secondary : colors.accent.gold;
    return (
      <View style={[s.scoreBadge, { backgroundColor: bg }]}>
        <Star size={11} color={fg} fill={fg} />
        <Text style={[s.scoreText, { color: fg }]}>{score}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      {/* 顶栏 */}
      <View style={s.header}>
        <Text style={s.brand}>知源</Text>
        <Text style={s.date}>6月18日 · 周三</Text>
      </View>

      {/* 搜索区 */}
      <View style={s.searchSection}>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} placeholder="搜索你想学的任何主题..." />
        <View style={s.hints}>
          {["机器学习", "系统设计", "TypeScript", "产品思维"].map((h) => (
            <TouchableOpacity key={h} style={s.hint} onPress={() => setQuery(h)}>
              <Text style={s.hintText}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 类型筛选 */}
      <View style={s.filterSection}>
        {TYPE_FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[s.filterChip, activeFilter === f && s.filterChipActive]} onPress={() => setActiveFilter(f)}>
            <Text style={[s.filterText, activeFilter === f && s.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 结果标题 */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>搜索结果</Text>
        <Text style={s.sectionCount}>{results.length} 份优质资料</Text>
      </View>

      {loading ? (
        <View style={s.list}>
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          contentContainerStyle={s.list}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleSearch} tintColor={colors.accent.gold} />}
          renderItem={({ item }) => (
            <Card featured={item.featured}>
              {item.featured && (
                <View style={s.featuredBadge}>
                  <Star size={11} color={colors.accent.primary} fill={colors.accent.primary} />
                  <Text style={s.featuredBadgeText}>精选推荐</Text>
                </View>
              )}
              <View style={s.cardHeader}>
                <ScoreBadge score={item.score} featured={item.featured} />
                <Text style={s.cardSource}>{item.source}</Text>
                <View style={s.dot} />
                <Text style={s.cardSource}>{item.date}</Text>
              </View>
              <Text style={s.cardTitle}>{item.title}</Text>
              <Text style={s.cardSummary} numberOfLines={2}>{item.summary}</Text>
              <View style={s.tagRow}>
                {item.tags.map((t) => (<Tag key={t} label={t} />))}
              </View>
              <View style={s.cardFooter}>
                <TouchableOpacity style={s.cardAction}>
                  <ExternalLink size={14} color={colors.accent.secondary} />
                  <Text style={s.cardActionText}>{item.featured ? "阅读全文" : "直达"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.cardAction, { opacity: 0.5 }]}>
                  <Bookmark size={14} color={colors.text.tertiary} />
                  <Text style={[s.cardActionText, { color: colors.text.tertiary }]}>{item.featured ? "稍后再读" : "收藏"}</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md },
  brand: { ...typography.brand, color: colors.text.primary },
  date: { ...typography.caption, color: colors.text.tertiary },
  searchSection: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  hints: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginTop: spacing.md },
  hint: { paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.background.card, borderRadius: borderRadius.pill, borderWidth: 1, borderColor: "transparent" },
  hintText: { ...typography.bodySmall, color: colors.text.secondary },
  filterSection: { flexDirection: "row", gap: 6, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.pill, borderWidth: 1, borderColor: colors.border.default },
  filterChipActive: { backgroundColor: colors.text.primary, borderColor: colors.text.primary },
  filterText: { ...typography.caption, fontWeight: "500", color: colors.text.secondary },
  filterTextActive: { color: colors.text.inverse, fontWeight: "600" },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.text.primary },
  sectionCount: { ...typography.caption, color: colors.text.tertiary },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing["3xl"] },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  scoreBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 10, paddingVertical: 3, borderRadius: borderRadius.sm },
  scoreText: { fontFamily: "Noto Sans CJK SC", fontSize: 12, fontWeight: "700" },
  cardSource: { ...typography.caption, color: colors.text.tertiary, flexShrink: 1 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.border.strong, marginHorizontal: 4 },
  cardTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.sm },
  cardSummary: { ...typography.bodySmall, color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 23 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: spacing.md },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: spacing.xl, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.default },
  cardAction: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4 },
  cardActionText: { ...typography.caption, fontWeight: "500", color: colors.accent.secondary },
  featuredBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.accent.dim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.sm, alignSelf: "flex-start", marginBottom: spacing.sm },
  featuredBadgeText: { ...typography.label, color: colors.accent.primary, fontWeight: "600" },
});
