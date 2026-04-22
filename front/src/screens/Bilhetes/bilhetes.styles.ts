import { StyleSheet, Dimensions } from "react-native";
import { colors, palette } from "@/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: palette.offWhite,
  },
  
  centerContainer: {
    width: "95%",
    flex:1,
    backgroundColor: palette.offWhite,
    borderRadius: 10,
    marginTop: -15,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
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

});