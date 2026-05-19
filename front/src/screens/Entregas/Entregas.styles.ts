import { StyleSheet, Dimensions } from "react-native";
import { colors, palette } from "@/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // ── Layout base ──────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: palette.offWhite,
  },

  // ── Header ───────────────────────────────────────────────
  header: {
    backgroundColor: palette.accent,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitleWrapper: {
    flex: 1,
  },

  headerTitle: {
    color: colors.textLight,
    fontFamily: "InterBold",
    fontSize: 18,
  },

  headerSubtitle: {
    color: "rgba(255,255,255,0.65)",
    fontFamily: "InterRegular",
    fontSize: 12,
    marginTop: 2,
  },

  // ── Área de conteúdo (sheet branco com bordas arredondadas) ──
  content: {
    flex: 1,
    backgroundColor: palette.offWhite,
    marginTop: -8,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  // ── Cards ─────────────────────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  cardHighlight: {
    borderLeftWidth: 3,
    borderLeftColor: palette.accent,
  },

  // ── Card: topo (ícone + tipo + badge) ────────────────────
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F0EB",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTypeLabel: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: palette.negro,
  },

  // ── Badge de status ───────────────────────────────────────
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    fontFamily: "InterSemiBold",
    fontSize: 12,
  },

  // ── Linha de prazo ────────────────────────────────────────
  prazoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  prazoText: {
    fontFamily: "InterMedium",
    fontSize: 13,
    color: "#A08070",
  },

  mensagemText: {
    fontFamily: "InterRegular",
    fontSize: 13,
    color: "#7A5C45",
    fontStyle: "italic",
    backgroundColor: "#F5F0EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    lineHeight: 18,
  },

  // ── Labels e campos de formulário ─────────────────────────
  fieldLabel: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: palette.lightBrown,
    marginBottom: 6,
  },

  fieldInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: palette.subtle,
  },

  fieldInputText: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: palette.negro,
  },

  // ── Layout de formulário ──────────────────────────────────
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  halfField: {
    flex: 1,
  },

  prazoBox: {
    backgroundColor: "#F5F0EB",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  // ── Seleção de categoria ──────────────────────────────────
  categoriaOptions: {
    flexDirection: "row",
    gap: 10,
  },

  categoriaOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: palette.subtle,
    backgroundColor: "#FFFFFF",
  },

  categoriaOptionActive: {
    borderColor: palette.accent,
    backgroundColor: "#FDF7F3",
  },

  categoriaOptionText: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: "#B8A89A",
  },

  categoriaOptionTextActive: {
    fontFamily: "InterBold",
    color: palette.accent,
  },

  // ── Área de texto ─────────────────────────────────────────
  textArea: {
    backgroundColor: "#F9F6F3",
    borderRadius: 10,
    padding: 12,
    fontFamily: "InterRegular",
    fontSize: 14,
    color: palette.negro,
    borderWidth: 1,
    borderColor: palette.subtle,
    minHeight: 100,
    textAlignVertical: "top",
  },

  // ── Botões principais ─────────────────────────────────────
  buttonsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
    marginBottom: 24,
  },

  btnSalvar: {
    flex: 1,
    backgroundColor: palette.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: palette.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  btnSalvarText: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  btnCancelar: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: palette.accent,
  },

  btnCancelarText: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: palette.negro,
  },

  btnExcluir: {
    backgroundColor: "#C0392B",
  },

  // ── FAB ───────────────────────────────────────────────────
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    backgroundColor: palette.brown,
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  // ── Detalhes (ResumoEntrega) ───────────────────────────────
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  infoLabel: {
    fontFamily: "InterRegular",
    fontSize: 13,
    color: palette.gray,
  },

  infoValue: {
    fontFamily: "InterMedium",
    fontSize: 13,
    color: palette.negro,
  },

  infoDivider: {
    height: 1,
    backgroundColor: palette.subtle,
  },

  tipoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  moradorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },

  moradorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  moradorAvatarText: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: "#FFFFFF",
  },

  moradorNome: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: palette.negro,
  },

  moradorUnidade: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: palette.gray,
    marginTop: 2,
  },

  // ── Modal de exclusão ─────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBox: {
    width: SCREEN_WIDTH * 0.88,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },

  modalTitle: {
    fontFamily: "InterBold",
    fontSize: 16,
    color: palette.negro,
    lineHeight: 22,
  },

  modalRadioRow: {
    flexDirection: "row",
    gap: 16,
  },

  modalRadioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  modalRadioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: palette.subtle,
    alignItems: "center",
    justifyContent: "center",
  },

  modalRadioCircleActive: {
    borderColor: palette.accent,
  },

  modalRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.accent,
  },

  modalRadioLabel: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: palette.negro,
  },

  modalTextInput: {
    backgroundColor: "#F9F6F3",
    borderRadius: 10,
    padding: 12,
    fontFamily: "InterRegular",
    fontSize: 14,
    color: palette.negro,
    borderWidth: 1,
    borderColor: palette.subtle,
    minHeight: 80,
    textAlignVertical: "top",
  },

  modalTextInputFocused: {
    borderColor: palette.accent,
  },

  // ── Estado vazio ──────────────────────────────────────────
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },

  emptyStateText: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: palette.gray,
    textAlign: "center",
  },
});