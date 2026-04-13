import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  // ── Estrutura ──────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Header ─────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "600",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },

  // ── Barra de progresso ─────────────────────
  progressWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabelLeft: {
    color: colors.textMuted,
    fontSize: 11,
  },
  progressLabelRight: {
    color: colors.textMuted,
    fontSize: 11,
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
  },
  progressFill: {
    width: "50%",
    height: 4,
    backgroundColor: colors.primaryDark,
    borderRadius: 4,
  },

  // ── Card principal ─────────────────────────
  card: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
  },

  // ── Seções ─────────────────────────────────
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 14,
  },
  sectionLabelSpaced: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textDark,
    marginTop: 8,
    marginBottom: 14,
  },

  // ── Inputs ─────────────────────────────────
  input: {
    backgroundColor: colors.inputBg,
    color: colors.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 10,
  },

  // ── Seção Identificação ────────────────────
  identBox: {
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    borderRadius: 14,
    padding: 14,
    
  },
  identRow: {
    flexDirection: "row",
    marginBottom: 10, 
    
  },
  inputHalf: {
  flex: 1,
  backgroundColor: colors.inputBg,
  color: colors.textLight,
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 15,
  },
  inputFull: {
    backgroundColor: colors.inputBg,
    color: colors.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  // ── Botão continuar ────────────────────────
  btnPrimary: {
    backgroundColor: colors.primaryDark,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 28,
  },
  btnPrimaryText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
});