import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  // ── Estrutura ──────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Topo ───────────────────────────────────
  topSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  appIconText: {
    fontSize: 26,
  },
  appName: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  appSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 220,
  },

  // ── Bottom Sheet ───────────────────────────
  bottomSheet: {
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 24,
  },

  // ── Inputs ─────────────────────────────────
  input: {
    backgroundColor: colors.inputBg,
    color: colors.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  },

  // ── Esqueci a senha ────────────────────────
  forgotWrapper: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
  },

  // ── Botão primário ─────────────────────────
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  btnPrimaryText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },

  // ── Divisor ────────────────────────────────
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSubtle,
    fontSize: 13,
  },

  // ── Botão secundário ───────────────────────
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 28,
    backgroundColor: "transparent",
  },
  btnSecondaryText: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: "500",
  },

  // ── Termos ─────────────────────────────────
  terms: {
    textAlign: "center",
    color: colors.textSubtle,
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: "underline",
  },
});