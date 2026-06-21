import React from "react";
// TODO: re-add icons via @expo/vector-icons

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>...</</Text>
      </View>...</<Card style={styles.statsCard}>
        <View style={styles.statItem}>
          <BookOpen size={24} color={colors.accent.primary} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>...</</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <FileText size={24} color={colors.accent.primary} />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>...</</Text>
        </View>
      </Card>...</<View style={styles.actions}>
        <Button
          title="?
          onPress={() => {}}
          variant="secondary"
          style={{ flex: 1 }}
        />
        <Button
          title=""
          onPress={() => {}}
          variant="text"
          style={{ minWidth: 80 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.primary },
  header: { paddingHorizontal: spacing.pageX, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  pageTitle: { ...typography.h1, color: colors.text.primary },
  statsCard: {
    marginHorizontal: spacing.pageX,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: spacing.xl,
  },
  statItem: { alignItems: "center", gap: spacing.xs },
  statNumber: { ...typography.h1, color: colors.text.primary },
  statLabel: { ...typography.caption, color: colors.text.tertiary },
  divider: { width: 1, height: 40, backgroundColor: colors.border.default },
  actions: {
    flexDirection: "row",
    paddingHorizontal: spacing.pageX,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
});
