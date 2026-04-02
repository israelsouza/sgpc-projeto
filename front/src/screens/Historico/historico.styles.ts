import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },

  // ── Header ──
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    overflow: "visible",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: colors.textSubtle,
    fontSize: 13,
    marginTop: 2,
  },
  headerCurve: {
    position: "absolute",
    marginLeft: "2.5%",
    width: "95%",
    bottom: -1,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // ── Conteúdo ──
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.sheetBg,
  },

  // ── Card de item ──
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.textLight,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.earthAccent,
  },

  // ── Ícone com badge opcional ──
  iconWrapper: {
    position: "relative",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#F5C518",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.textLight,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },

  // ── Texto do item ──
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  itemSubtitle: {
    color: colors.earthBrown,
    fontSize: 12,
    lineHeight: 16,
  },

  // ── Data/hora ──
  itemMeta: {
    alignItems: "flex-end",
    gap: 2,
  },
  itemDate: {
    color: colors.textSubtle,
    fontSize: 11,
  },
  itemTime: {
    color: colors.textSubtle,
    fontSize: 11,
  },

  // ── Bottom nav (reaproveitado do home.styles) ──
  bottomNav: {
    flexDirection: "row",
    backgroundColor: colors.textLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "space-between",
    borderTopColor: colors.divider,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});