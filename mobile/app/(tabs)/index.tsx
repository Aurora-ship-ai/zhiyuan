import React, { useState, useCallback } from "react";
// TODO: re-add icons via @expo/vector-icons
import { colors, typography, spacing, borderRadius } from "../../theme";
import { searchMaterials } from "../../services/api";
import type { SearchResult } from "../../types";

const TYPE_FILTERS = ["", "", "", "", "", ""];

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>...</<View style={[s.scoreBadge, { backgroundColor: bg }]}>
        <Star size={11} color={fg} fill={fg} />
        <Text style={[s.scoreText, { color: fg }]}>{score}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>...</<View style={s.header}>
        <Text style={s.brand}>...</</Text>
        <Text style={s.date}>...</</Text>
      </View>...</<View style={s.searchSection}>
        <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} placeholder="..." />
        <View style={s.hints}>...</<TouchableOpacity key={h} style={s.hint} onPress={() => { setQuery(h); }}>
              <Text style={s.hintText}>{h}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>...</<View style={s.filterSection}>
        {TYPE_FILTERS.map((f) => (
          <TouchableOpacity key={f} style={[s.filterChip, activeFilter === f && s.filterChipActive]} onPress={() => setActiveFilter(f)}>
            <Text style={[s.filterText, activeFilter === f && s.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>...</<View style={s.list}>
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </View>
      ) : !searched ? (
        <View style={s.empty}>
          <View style={s.emptyIcon}>
            <SearchBarIcon />
          </View>
          <Text style={s.emptyTitle}>...</<Text style={s.emptyDesc}>...</</View>
      ) : error ? (
        <View style={s.empty}>
          <Text style={[s.emptyTitle, { color: colors.semantic.error }]}>...</</Text>
          <Text style={s.emptyDesc}>{error}</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>...</</Text>
          <Text style={s.emptyDesc}>...</</View>
      ) : (
        <>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>...</</Text>
            <Text style={s.sectionCount}>...</</View>
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
                      <Text style={s.featuredBadgeText}>...</</View>
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
                      <Text style={s.cardActionText}>...</</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[s.cardAction, { opacity: 0.5 }]}>
                      <Bookmark size={14} color={colors.text.tertiary} />
                      <Text style={[s.cardActionText, { color: colors.text.tertiary }]}>...</</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>...</<View style={{ width: 24, height: 24, justifyContent: "center", alignItems: "center" }}>
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
