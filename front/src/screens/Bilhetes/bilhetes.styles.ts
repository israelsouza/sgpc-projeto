import { StyleSheet, Dimensions } from "react-native";
import { colors, palette } from "@/theme/colors";
import type { ThemeColors } from "@/contexts/ThemeContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: palette.offWhite,
  },

  centerContainer: {
    width: "100%",
    flex:1,
    backgroundColor: palette.offWhite,
    borderRadius: 0,
    marginTop: -15,
    paddingTop: 18,
    alignSelf:"center",
  },

  ContainerFundo: {
    flex: 1,
    backgroundColor: "transparent",
  },

  ContainerFundoContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 10,
  },

  ContainerTextData: {
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: 4,
    marginTop: 16,
    paddingHorizontal: 4,
  },

  TextDataMain: {
    color: palette.lightBrown,
    fontFamily: "InterBold",
    fontSize: 14,
  },


  Listado: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  ContainerIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderRadius: 12,
  },

  icon: {
    color: palette.darkBrown,
  },


  ContainerBody: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },

  TextTitle: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: palette.negro,
  },

  TextDesc: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: palette.darkGray,
  },

  ContainerData: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
    maxWidth: 80,
  },

  TextData: {
    fontFamily: "InterMedium",
    fontSize: 11,
    color: palette.darkGray,
  },


  ModalBlur: {
    flex: 1,
  },

  ModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  ModalCard: {
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

  ModalBotaoFechar: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },

  Containerprincipal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingRight: 24,
  },

  CardAberto: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  Divisao: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },

  infosData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  ContainerAberto: {
    gap: 12,
  },

  ContainerDataModal: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 6,
  },

  ModalBotaoExcluir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: palette.accent,
    borderRadius: 10,
    padding: 14,
  },

  ModalBotaoExcluirConfirmando: {
    backgroundColor: "#C0392B",
  },

  ModalBotaoExcluirTexto: {
    color: "#fff",
    fontFamily: "InterBold",
    fontSize: 14,
  },

  ModalBotaoCancelar: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: palette.brown,
    alignItems: "center",
  },

  ModalBotaoCancelarPress: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: palette.brown,
    alignItems: "center",
    justifyContent: "center",
  },

  TextCancelar: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: palette.accent,
    padding: 10,
  },

  TextExcluirPress: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: colors.textLight,
  },

  selecionarReservaMark: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: palette.accent,
    borderRadius: 10,
  },

//ESTILIZAÇÃO PARA MODAL DE ADICIONAR BILHETES
overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },

  card: {
    backgroundColor: palette.offWhite,
    borderRadius: 24,
    padding: 24,
    gap: 14,
    maxHeight: "100%",
  },

  HeaderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  tituloCard: {
    fontFamily: "InterBold",
    fontSize: 17,
    color: palette.negro,
  },

  divisao: {
    height: 1,
    backgroundColor: palette.subtle,
    marginVertical: 4,
  },

  labelCard: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: palette.lightBrown,
    marginBottom: 4,
  },

    infoUnidadeContainer: {
    width: "100%",
    gap: 18,
  },

  InputDesabilitado: {
    backgroundColor: palette.negro,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  InputDesabilitadoFull: {
    width: "100%",
    backgroundColor: palette.negro,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  InputDesabilitadoMetade: {
    flex: 1,
    backgroundColor: palette.negro,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  rowcard: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 35,
  },

  InputDesabilitadoText: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: "#fff",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: "InterRegular",
    fontSize: 13,
    color: palette.negro,
    borderWidth: 1,
    borderColor: palette.subtle,
  },


  inputAssunto:{
    padding: 10,
    borderWidth: 1,
    borderColor: palette.lightBrown,
    fontFamily: "InterMedium",
    fontSize: 14
  },

  containerMensagem: {
    width: "100%",
    gap: 8,
  },

  labelMensagem: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: palette.lightBrown,
  },

  inputMensagem: {
    height: 140,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 12,
    fontFamily: "InterMedium",
    fontSize: 14,
    color: palette.darkGray,
    borderWidth: 1,
    borderColor: palette.lightBrown,
  },

  arquivoBotao: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.subtle,
  },

  arquivoBotaoText:{
    color: palette.lightBrown,
    fontFamily: "InterMedium",
    fontSize: 14
  },

  botoes: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 35,
  },

  btnSalvar: {
    flex: 1,
    backgroundColor: palette.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  btnSalvarText: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: "#fff",
  },

  btnCancelar: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: palette.accent,
  },

  btnCancelarText: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: palette.negro,
  },
});

export const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  centerContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: c.background,
    borderRadius: 0,
    marginTop: -15,
    paddingTop: 18,
    alignSelf: "center",
  },
  ContainerFundo: {
    flex: 1,
    backgroundColor: "transparent",
  },
  ContainerFundoContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 10,
  },
  ContainerTextData: {
    justifyContent: "center",
    alignSelf: "flex-start",
    marginBottom: 4,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  TextDataMain: {
    color: c.primary,
    fontFamily: "InterBold",
    fontSize: 14,
  },
  Listado: {
    width: "100%",
    backgroundColor: c.card,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  ContainerIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderRadius: 12,
  },
  icon: {
    color: c.text,
  },
  ContainerBody: {
    flex: 1,
    justifyContent: "center",
    gap: 3,
  },
  TextTitle: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: c.text,
  },
  TextDesc: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: c.textMuted,
  },
  ContainerData: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 3,
    maxWidth: 80,
  },
  TextData: {
    fontFamily: "InterMedium",
    fontSize: 11,
    color: c.textMuted,
  },
  ModalBlur: {
    flex: 1,
  },
  ModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  ModalCard: {
    width: SCREEN_WIDTH * 0.88,
    backgroundColor: c.surface,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: c.border,
  },
  ModalBotaoFechar: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },
  Containerprincipal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingRight: 24,
  },
  CardAberto: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  Divisao: {
    height: 1,
    backgroundColor: c.border,
  },
  infosData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ContainerAberto: {
    gap: 12,
  },
  ContainerDataModal: {
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 6,
  },
  ModalBotaoExcluir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: c.primary,
    borderRadius: 10,
    padding: 14,
  },
  ModalBotaoExcluirConfirmando: {
    backgroundColor: "#FF0000",
  },
  ModalBotaoExcluirTexto: {
    color: c.text,
    fontFamily: "InterBold",
    fontSize: 14,
  },
  ModalBotaoCancelar: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: c.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.primary,
  },
  ModalBotaoCancelarPress: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  TextCancelar: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: c.primary,
    padding: 10,
  },
  TextExcluirPress: {
    fontFamily: "InterMedium",
    fontSize: 14,
    color: c.text,
  },
  selecionarReservaMark: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: c.primary,
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  card: {
    backgroundColor: c.card,
    borderRadius: 24,
    padding: 24,
    gap: 14,
    maxHeight: "100%",
    borderWidth: 1,
    borderColor: c.border,
  },
  HeaderCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tituloCard: {
    fontFamily: "InterBold",
    fontSize: 17,
    color: c.text,
  },
  divisao: {
    height: 1,
    backgroundColor: c.border,
    marginVertical: 4,
  },
  labelCard: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: c.primary,
    marginBottom: 4,
  },
  infoUnidadeContainer: {
    width: "100%",
    gap: 18,
  },
  InputDesabilitado: {
    backgroundColor: c.surface,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  InputDesabilitadoFull: {
    width: "100%",
    backgroundColor: c.surface,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  InputDesabilitadoMetade: {
    flex: 1,
    backgroundColor: c.surface,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  rowcard: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 35,
  },
  InputDesabilitadoText: {
    fontFamily: "InterBold",
    fontSize: 15,
    color: c.text,
  },
  input: {
    backgroundColor: c.surface,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontFamily: "InterRegular",
    fontSize: 13,
    color: c.text,
    borderWidth: 1,
    borderColor: c.border,
  },
  inputAssunto: {
    padding: 10,
    borderWidth: 1,
    borderColor: c.primary,
    fontFamily: "InterMedium",
    fontSize: 14,
  },
  containerMensagem: {
    width: "100%",
    gap: 8,
  },
  labelMensagem: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: c.primary,
  },
  inputMensagem: {
    height: 140,
    backgroundColor: c.surface,
    borderRadius: 16,
    padding: 12,
    fontFamily: "InterMedium",
    fontSize: 14,
    color: c.text,
    borderWidth: 1,
    borderColor: c.primary,
  },
  arquivoBotao: {
    backgroundColor: c.surface,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
  },
  arquivoBotaoText: {
    color: c.primary,
    fontFamily: "InterMedium",
    fontSize: 14,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    gap: 35,
  },
  btnSalvar: {
    flex: 1,
    backgroundColor: c.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnSalvarText: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: c.text,
  },
  btnCancelar: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: c.primary,
  },
  btnCancelarText: {
    fontFamily: "InterBold",
    fontSize: 14,
    color: c.text,
  },
});
