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