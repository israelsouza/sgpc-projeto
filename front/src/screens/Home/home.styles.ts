import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sheetBg,
  },

  // header
  header: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar:{
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: "700",
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: colors.textSubtle,
    fontSize: 13,
    marginTop: 2,
  },

  //  Conteúdo
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Boas vindas
  welcomeCard: {
    backgroundColor: colors.textLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
  },
  welcomeText: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: "600",
  },

  // Grid

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  card: {
    width: "47.5%",
    backgroundColor: colors.textLight,
    borderRadius: 16,
    padding: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: colors.textDark,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardSubtitle: {
    color: colors.earthBrown,
    fontSize: 12,
    lineHeight: 16,
  },

  // botão nav
  bottomNav: {
    flexDirection: "row",
    backgroundColor: colors.textLight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: "space-between",
    borderTopColor: colors.divider,
    borderTopWidth: 1,
  },
  navItem:{
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navIcon:{
    fontSize:22,
  },
  navIconActive:{
    fontSize:22,
  }
});
