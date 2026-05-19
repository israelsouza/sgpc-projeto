import { StyleSheet, Platform } from "react-native";
import { colors, palette } from "@/theme/colors";

export const styles = StyleSheet.create({
  // ── Container do header ───────────────────────────────────
  container: {
    backgroundColor: palette.brown,
    paddingTop: Platform.OS === "ios" ? 52 : 36,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  // ── Botão esquerdo (back) ─────────────────────────────────
  sideButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ── Título central ────────────────────────────────────────
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontFamily: "InterBold",
    fontSize: 18,
    color: colors.textLight,
    textAlign: "center",
  },

  subtitle: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    marginTop: 3,
    textAlign: "center",
  },

  // ── Botão direito (ação/menu) ─────────────────────────────
  // Mesmo tamanho do sideButton para manter título centralizado
  rightButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // Placeholder invisível quando não há botão direito
  // (garante que o título fique centralizado mesmo sem ícone à direita)
  rightPlaceholder: {
    width: 42,
    height: 42,
    flexShrink: 0,
  },
});
