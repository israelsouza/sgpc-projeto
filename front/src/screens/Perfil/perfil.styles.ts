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
    paddingTop: 48,
    paddingBottom: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    overflow: "visible",
  },

  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: colors.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerDetail: {
    color: colors.textSubtle,
    fontSize: 13,
  },

  // curva de transição — igual ao Header do projeto
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
    backgroundColor: colors.sheetBg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Cards de resumo ──
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.textLight,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.earthAccent,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 4,
  },
  statValueHighlight: {
    color: "#C0392B",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.earthBrown,
    textAlign: "center",
    lineHeight: 14,
  },

  // ── Menu list ──
  menuList: {
    gap: 12,
  },
  menuItem: {
    backgroundColor: colors.textLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.earthAccent,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5E6D6",
    alignItems: "center",
    justifyContent: "center",
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
  },
});