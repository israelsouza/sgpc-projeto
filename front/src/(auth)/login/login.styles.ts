import { StyleSheet } from "react-native";

export const colors = {
  darkBg: "#2C3E50",
  sheetBg: "#F5F0EB",
  inputBg: "#3D5166",
  accent: "#B5845A",
  textLight: "#FFFFFF",
  textDark: "#2C3E50",
  textMuted: "#9AA5B4",
  textSubtle: "#9A8F88",
  divider: "#D5C9BE",
};

export const styles = StyleSheet.create({
  /* ── Estrutura ── */
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },

  /* ── Topo ── */
  topSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    justifyContent: "center",
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 28,
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
    maxWidth: 200,
  },

  /* ── Bottom Sheet ── */
  bottomSheet: {
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 24,
  },

  /* ── Inputs ── */
  input: {
    backgroundColor: colors.inputBg,
    color: colors.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  },

  /* ── Esqueci a senha ── */
  forgotWrapper: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: colors.accent,
    fontSize: 13,
  },

  /* ── Botão primário ── */
  btnPrimary: {
    backgroundColor: colors.accent,
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

  /* ── Divisor ── */
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

  /* ── Botão secundário ── */
  btnSecondary: {
    borderWidth: 1.5,
    borderColor: "#C8B8AC",
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

  /* ── Termos ── */
  terms: {
    textAlign: "center",
    color: colors.textSubtle,
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.accent,
  },
});
