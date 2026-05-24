// src/screens/Avisos/avisos.styles.ts
import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";
import type { ThemeColors } from "@/contexts/ThemeContext";

// ── Styles estáticos — padrão original ────────────────────────────────────
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  list: {
    gap: 10,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.textLight,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.earthAccent,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconBoxActive: {
    backgroundColor: colors.earthAccent + "22",
  },
  iconBoxInactive: {
    backgroundColor: colors.divider + "66",
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
    flexShrink: 1,
  },
  badgeNovo: {
    backgroundColor: colors.earthBrown,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeNovoText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  dateBlock: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
  cardPreview: {
    fontSize: 12,
    color: colors.earthBrown,
    lineHeight: 17,
    marginTop: 2,
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  attachmentText: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Paginação
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  pageButton: {
    backgroundColor: colors.earthAccent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pageButtonDisabled: {
    backgroundColor: colors.divider,
    opacity: 0.5,
  },
  pageText: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  pageInfo: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
});

// ── Styles dinâmicos — ativados apenas no alto contraste ──────────────────
export const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: c.surface,
      paddingTop: 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: c.text,
      marginBottom: 12,
      paddingHorizontal: 2,
    },
    list: {
      gap: 10,
      paddingBottom: 16,
    },
    card: {
      backgroundColor: c.card,
      borderRadius: 14,
      padding: 14,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    iconBox: {
      width: 46,
      height: 46,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    iconBoxActive: {
      backgroundColor: c.iconBgOverride,
    },
    iconBoxInactive: {
      backgroundColor: c.surface,
    },
    cardBody: {
      flex: 1,
      gap: 2,
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 8,
    },
    cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      flex: 1,
      flexWrap: "wrap",
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: c.text,
      flexShrink: 1,
    },
    badgeNovo: {
      backgroundColor: c.primary,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    badgeNovoText: {
      color: c.background,
      fontSize: 10,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    dateBlock: {
      alignItems: "flex-end",
      flexShrink: 0,
    },
    dateText: {
      fontSize: 11,
      color: c.textMuted,
      lineHeight: 15,
    },
    cardPreview: {
      fontSize: 12,
      color: c.textMuted,
      lineHeight: 17,
      marginTop: 2,
    },
    attachmentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 6,
    },
    attachmentText: {
      fontSize: 11,
      color: c.textMuted,
    },
  });
