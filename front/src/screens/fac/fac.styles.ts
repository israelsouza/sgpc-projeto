import { StyleSheet } from "react-native";
import { colors, palette } from "@/theme/colors";

export const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#F5F4F0",
  },
  content: {
    paddingBottom: 48,
  },

  // Header
  header: {
    backgroundColor: palette.accent,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tag: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 3,
    color: palette.darkBg,
    marginBottom: 12,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSubtle,
    lineHeight: 22,
  },

  // Lista
  list: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },

  // Card
  card: {
    backgroundColor: palette.gray,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  question: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: palette.negro,
    lineHeight: 22,
  },
  chevron: {
    fontSize: 22,
    fontWeight: "bold",
    color: palette.brown,
    marginTop: -2,
  },

  // Resposta
  answerBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0EFF8",
  },
  answer: {
    fontSize: 14,
    color: palette.negro,
    lineHeight: 22,
  },
  link: {
    color:  palette.brown,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Footer
  footer: {
    alignItems: "center",
    marginTop: 40,
    paddingHorizontal: 24,
    gap: 8,
  },
  footerText: {
    fontSize: 15,
    color: palette.negro,
  },
  footerLink: {
    fontSize: 15,
    fontWeight: "700",
    color: palette.brown,
  },
})