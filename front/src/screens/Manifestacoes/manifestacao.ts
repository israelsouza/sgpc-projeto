import { StyleSheet, Dimensions } from "react-native";
import { colors, palette } from "@/theme/colors";


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

})
