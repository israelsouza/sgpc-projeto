import { StyleSheet } from "react-native";
import { colors, palette } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: palette.accent,
  },

  // header
  header: {
    backgroundColor: palette.accent,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,  
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "visible",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar:{
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.textLight,
    fontSize: 20,
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

headerCurve: {
  position: "absolute",
  left: 20,
  right: 20,
  bottom: -1,
  height: 16,              
  backgroundColor: colors.sheetBg,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
},

  //  Conteúdo
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    paddingTop: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Boas vindas
  welcomeCard: {
    backgroundColor: colors.textLight,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: colors.earthAccent,
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
