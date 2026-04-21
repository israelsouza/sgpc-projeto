import { StyleSheet } from "react-native";
import { colors } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    justifyContent: "flex-end",
    paddingBottom: 32,
  },
  headerTitle: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: colors.inputBg,
    color: colors.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  btnPrimaryDisabled: {
    backgroundColor: colors.primary + '80', // Opacidade
  },
  btnPrimaryText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },
  btnSecondary: {
    paddingVertical: 14,
    alignItems: "center",
  },
  btnSecondaryText: {
    color: colors.textDark,
    fontSize: 15,
    fontWeight: "500",
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  messageText: {
    color: colors.success || '#4ade80',
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
});
