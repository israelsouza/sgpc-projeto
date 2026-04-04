export const palette = {
  negro: "#2E2E2E",
  darkBg: "#051822",
  surface: "#2D383E",
  brown: "#7C5841",
  accent: "#AA7452",
  gray: "#96999E",
  subtle: "#D4C9C7",
  offWhite: "#F4F1EC",
} as const;

export const colors = {
  background: palette.darkBg,
  sheetBg: palette.offWhite,
  inputBg: palette.surface,

  // Ação / destaque
  primary: palette.accent,
  primaryDark: palette.brown,

  // Texto
  textLight: "#FFFFFF",
  textDark: palette.darkBg,
  textMuted: palette.gray,
  textSubtle: palette.subtle,

  // UI
  divider: palette.subtle,
  icon: palette.negro,

  // Tons terrosos
  earthBrown: palette.brown,
  earthAccent: palette.accent,
} as const;
