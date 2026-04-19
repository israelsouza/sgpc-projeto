import { StyleSheet, Dimensions } from "react-native";
import { colors, palette } from "@/theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },

  ContainerFundo: {
    width: "95%",
    height: "80%",
    backgroundColor: palette.offWhite,
    borderRadius: 10,
  },

  ContainerFundoContent: {
    marginTop: 20,
    alignItems: "stretch",
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 20,
  },

  ContainerTextData: {
    justifyContent: "center",
    alignSelf: "baseline",
    margin: 20,
  },

  TextDataMain: {
    color: palette.lightBrown,
    fontFamily: "InterBold",
    fontSize: 15,
    padding: 20
  },

  Listado: {
    width: "100%",
    backgroundColor: "#FFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  ContainerIcon: {
    width: 52,
    height: 52,
    backgroundColor: palette.brown,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderRadius: 10,
  },

  ContainerBody: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  TextTitle: {
    fontFamily: "InterBold",
    fontSize: 13,
  },

  TextDesc: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: palette.darkGray,
  },

  ContainerData: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 4,
  },

  TextData: {
    fontFamily: "InterBold",
    fontSize: 13,
    color: palette.darkGray,
  },

  icon: {
    color: palette.darkBrown,
  },

  /*************************************************************************************** MODAL **********************************************************************************************************************/

  ModalBlur: {
    flex: 1,
  },

    ModalBotaoExcluir: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: palette.accent,
    borderRadius: 10,
    padding: 20
  },

  TextCancelar:{
    fontFamily: "InterBold",
    fontSize: 14,
    color: "#B07850",
    padding:10
  },

  selecionarReservaMark:{
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor:palette.accent,
    borderRadius: 10,
},

  TextExcluirPress:{
    fontFamily: "InterMedium",
    fontSize: 14,
    color: colors.textLight,
  },

    ModalBotaoCancelar: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#B07850",
    alignItems: "center",
    fontSize:14,
  },
  
  ModalBotaoCancelarPress:{
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#B07850",
    alignItems: "center",
    justifyContent: "center"
    
  },

  ModalBotaoExcluirConfirmando: {
    backgroundColor: palette.accent,
    padding:15,
    gap:10
  },
  
  ModalBotaoExcluirTexto: {
    color: "#fff",
    fontFamily: "InterBold",
    fontSize: 14,
    },

  ModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  ModalCard: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 12,
  },

  ModalBotaoFechar: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 4,
  },

  //CONTEÚDO DO MODAL
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

  ContainerDataModal:{
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 4,
  }

});