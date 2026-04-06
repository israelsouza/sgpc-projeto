import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: "#F5F0EB",
  },

  // ── Header customizado (com back button) ─────────────────
  header: {
    backgroundColor: colors.primaryDark ?? "#5C3D2E",
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleWrapper: {
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 2,
  },

  // ── Scroll / Conteúdo ─────────────────────────────────────
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // ── Card container (seção) ────────────────────────────────
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // ── Row com dois campos lado a lado ──────────────────────
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },

  // ── Campo / Label ─────────────────────────────────────────
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A08070",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F0EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  fieldInputText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3D2B1F",
    flex: 1,
  },

  // ── Prazo (destaque) ──────────────────────────────────────
  prazoBox: {
    backgroundColor: "#3D2B1F",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  prazoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // ── Categoria (dropdown-like) ─────────────────────────────
  categoriaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F0EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  categoriaText: {
    fontSize: 14,
    color: "#3D2B1F",
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },

  // ── Opções de categoria ───────────────────────────────────
  categoriaOptions: {
    marginTop: 8,
    gap: 8,
  },
  categoriaOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E8DDD5",
    gap: 10,
  },
  categoriaOptionActive: {
    borderColor: colors.earthBrown ?? "#8B5E3C",
    backgroundColor: "#FDF6F0",
  },
  categoriaOptionText: {
    fontSize: 14,
    color: "#7A5C45",
    fontWeight: "500",
  },
  categoriaOptionTextActive: {
    color: colors.earthBrown ?? "#8B5E3C",
    fontWeight: "700",
  },

  // ── Mensagem (textarea) ───────────────────────────────────
  textArea: {
    backgroundColor: "#F5F0EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#3D2B1F",
    minHeight: 100,
    textAlignVertical: "top",
  },

  // ── Botões ────────────────────────────────────────────────
  buttonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    marginBottom: 28,
  },
  btnSalvar: {
    flex: 1,
    backgroundColor: colors.earthBrown ?? "#8B5E3C",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: colors.earthBrown ?? "#8B5E3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSalvarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#D6C8BE",
  },
  btnCancelarText: {
    color: "#7A5C45",
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Resumo: card com borda de destaque ───────────────────
  cardHighlight: {
    borderWidth: 1.5,
    borderColor: "#C9D9E8",
  },

  // ── Resumo: morador ───────────────────────────────────────
  moradorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 8,
  },
  moradorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D6C4B0",
    alignItems: "center",
    justifyContent: "center",
  },
  moradorAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  moradorNome: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3D2B1F",
  },
  moradorUnidade: {
    fontSize: 13,
    color: "#A08070",
    marginTop: 2,
  },

  // ── Resumo: linhas de info ────────────────────────────────
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: "#A08070",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3D2B1F",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#F0E8E0",
  },

  // ── Resumo: prazo com badge ───────────────────────────────
  prazoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#B8A44A",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Resumo: tipo com ícone ────────────────────────────────
  tipoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  // ── Resumo: mensagem ──────────────────────────────────────
  mensagemText: {
    fontSize: 14,
    color: "#5C3D2E",
    lineHeight: 22,
    marginTop: 4,
  },

  // ── Resumo: botão excluir ─────────────────────────────────
  btnExcluir: {
    backgroundColor: "#7A3B2E",
    shadowColor: "#7A3B2E",
  },

  // ── Modal de exclusão ─────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.earthBrown ?? "#8B5E3C",
    textAlign: "center",
    marginBottom: 16,
  },
  modalRadioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 14,
  },
  modalRadioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalRadioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#B8A89A",
    alignItems: "center",
    justifyContent: "center",
  },
  modalRadioCircleActive: {
    borderColor: colors.earthBrown ?? "#8B5E3C",
  },
  modalRadioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.earthBrown ?? "#8B5E3C",
  },
  modalRadioLabel: {
    fontSize: 14,
    color: "#3D2B1F",
    fontWeight: "500",
  },
  modalTextInput: {
    borderWidth: 1.5,
    borderColor: "#E0D5CC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#3D2B1F",
    minHeight: 72,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  modalTextInputFocused: {
    borderColor: colors.earthBrown ?? "#8B5E3C",
  },

  // ── Bottom Nav (reaproveitado do home) ────────────────────
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#EDE5DC",
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
});