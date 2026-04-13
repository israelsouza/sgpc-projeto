import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },

  content: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Título da seção
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 12,
    paddingHorizontal: 2,
  },

  // Lista
  list: {
    gap: 10,
    paddingBottom: 16,
  },

  // Card de aviso
  card: {
    backgroundColor: colors.textLight,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },

  // Ícone do card
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconBoxActive: {
    backgroundColor: colors.earthAccent + "22", 
  },
  iconBoxInactive: {
    backgroundColor: colors.divider + "66",
  },

  // Conteúdo do card
  cardBody: {
    flex: 1,
    gap: 2,
  },

  // Linha do topo: título + badge + data
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textDark,
    flexShrink: 1,
  },

  badgeNovo: {
    backgroundColor: colors.earthBrown,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeNovoText: {
    color: colors.textLight,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Data
  dateBlock: {
    alignItems: "flex-end",
    flexShrink: 0,
  },
  dateText: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },

  // Preview
  cardPreview: {
    fontSize: 12,
    color: colors.earthBrown,
    lineHeight: 17,
    marginTop: 2,
  },

  // Anexo
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  attachmentText: {
    fontSize: 11,
    color: colors.textMuted,
  },
});