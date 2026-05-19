import { StyleSheet } from "react-native";
import { colors, palette } from "@/theme/colors";

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: palette.offWhite,
  },

  // ── Conteúdo principal ────────────────────────────────────
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 28,
    paddingHorizontal: 20,
  },

  // ── Card do timer ─────────────────────────────────────────
  whiteCard: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.subtle,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  infoText: {
    fontFamily: "InterRegular",
    fontSize: 15,
    color: palette.darkGray,
    textAlign: "center",
    marginBottom: 10,
  },

  timerText: {
    fontFamily: "InterBold",
    fontSize: 32,
    color: palette.negro,
    textAlign: "center",
  },

  // ── Botão principal ───────────────────────────────────────
  btnInvite: {
    backgroundColor: palette.accent,
    width: "100%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  btnInviteText: {
    fontFamily: "InterBold",
    color: colors.textLight,
    fontSize: 15,
  },
});