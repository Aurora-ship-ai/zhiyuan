import React, { useState, useCallback } from "react";
// TODO: re-add icons via @expo/vector-icons
import { colors, typography, spacing, borderRadius } from "../../theme";
import { searchMaterials } from "../../services/api";
import type { SearchResult } from "../../types";

const TYPE_FILTERS = ["全部", "文章", "论文", "视频", "书籍", "播客"];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("全部");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      const resp = await searchMaterials({ query: q, page_size: 10 });
      setResults(resp.results);
      setSearched(true);
    } catch (e: any) {
      setError(e?.message ?? "搜索失败，请检查网络");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const ScoreBadge = ({ score }: { score: number }) => {
    const isHigh = score >= 9;
    const bg = isHigh ? "#E8F0E2" : colors.accent.goldDim;
    const fg = isHigh ? colors.accent.secondary : colors.accent.gold;
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
            <TouchableOpacity key={h} style={s.hint} onPress={() => { setQuery(h); }}>
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

      {/* 结果 */}
      {loading ? (
        <View style={s.list}>
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </View>
      ) : !searched ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <SearchBarIcon />
          </View>
          <Text style={s.emptyTitle}>探索知识的世界</Text>
          <Text style={s.emptyDesc}>输入主题搜索，AI 为您找到最优质的学习资料</Text>
        </View>
      ) : error ? (
        <View style={s.empty}>
          <Text style={[s.emptyTitle, { color: colors.semantic.error }]}>搜索异常</Text>
          <Text style={s.emptyDesc}>{error}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>暂无结果</Text>
          <Text style={s.emptyDesc}>换个关键词试试，或扩大搜索范围</Text>
        </View>
      ) : (
        <>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>搜索结果</Text>
            <Text style={s.sectionCount}>{results.length} 份资料</Text>
          </View>
          <FlatList
            data={results}
            keyExtractor={(i) => i.id}
            contentContainerStyle={s.list}
            ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={handleSearch} tintColor={colors.accent.gold} />}
            renderItem={({ item }) => {
              const isFeatured = item.score >= 9;
              return (
                <Card featured={isFeatured}>
                  {isFeatured && (
                    <View style={s.featuredBadge}>
                      <Star size={11} color={colors.accent.primary} fill={colors.accent.primary} />
                      <Text style={s.featuredBadgeText}>精选推荐</Text>
                    </View>
                  )}
                  <View style={s.cardHeader}>
                    <ScoreBadge score={item.score} />
                    <Text style={s.cardSource}>{item.source}</Text>
                  </View>
                  <Text style={s.cardTitle}>{item.title}</Text>
                  <Text style={s.cardSummary} numberOfLines={2}>{item.summary}</Text>
                  <View style={s.tagRow}>
                    {item.tags.map((t) => (<Tag key={t} label={t} />))}
                  </View>
                  <View style={s.cardFooter}>
                    <TouchableOpacity style={s.cardAction}>
                      <ExternalLink size={14} color={colors.accent.secondary} />
                      <Text style={s.cardActionText}>{isFeatured ? "阅读全文" : "直达"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.cardAction, { opacity: 0.5 }]}>
                      <Bookmark size={14} color={colors.text.tertiary} />
                      <Text style={[s.cardActionText, { color: colors.text.tertiary }]}>{isFeatured ? "稍后再读" : "收藏"}</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
}

/** 搜索图标 — 空状态用 */
function SearchBarIcon() {
  return (
    <View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
      <ExternalLink size={22} color={colors.text.tertiary} />
    </View>
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
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, paddingTop: spacing.sm },
  sectionTitle: { ...typography.h3, color: colors.text.primary },
  sectionCount: { ...typography.caption, color: colors.text.tertiary },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing["3xl"] },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  scoreBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 10, paddingVertical: 3, borderRadius: borderRadius.sm },
  scoreText: { fontSize: 12, fontWeight: "700" },
  cardSource: { ...typography.caption, color: colors.text.tertiary, flexShrink: 1 },
  cardTitle: { ...typography.h3, color: colors.text.primary, marginBottom: spacing.sm },
  cardSummary: { ...typography.bodySmall, color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 23 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: spacing.md },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: spacing.xl, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border.default },
  cardAction: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 4 },
  cardActionText: { ...typography.caption, fontWeight: "500", color: colors.accent.secondary },
  featuredBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.accent.dim, paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.sm, alignSelf: "flex-start", marginBottom: spacing.sm },
  featuredBadgeText: { ...typography.label, color: colors.accent.primary, fontWeight: "600" },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: spacing.xxl },
  emptyIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.background.card, justifyContent: "center", alignItems: "center", marginBottom: spacing.lg },
  emptyTitle: { ...typography.h3, color: colors.text.secondary, marginBottom: spacing.xs },
  emptyDesc: { ...typography.bodySmall, color: colors.text.tertiary, textAlign: "center", lineHeight: 22 },
});
