import { StyleSheet } from "react-native";
import { colors, palette } from "@/theme/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: colors.primaryDark,
  },

    ContainerFundo:{
    width: "95%",
    height: "80%",
    backgroundColor: palette.offWhite,
    borderRadius: 10,
    display: "flex",
},

ContainerFundoContent: {
  alignItems: "stretch",   // ou o que você tinha antes
  paddingHorizontal: 16,
  paddingBottom: 24,
  gap: 20
},

    ContainerTextData:{
    justifyContent: "center",
    alignSelf:"baseline",
    margin: 20,
    },

    TextDataMain:{
    color:palette.lightBrown,
    fontFamily:"InterBold",
    fontSize:13
    },

    Listado:{
    width: "100%",
    backgroundColor: "#FFFF",
    flexDirection:"row",
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

    ContainerIcon:{
    width: 52,
    height: 52,
    backgroundColor: palette.brown,
    alignItems:"center",
    justifyContent:"center",
    marginRight: 14,
    borderRadius: 10
},

    ContainerBody:{
    flex:1,
    justifyContent:"center",
    gap:4,
    },

    TextTitle:{
    fontFamily:"InterBold",
    fontSize: 13
    },

    TextDesc:{
    fontFamily:"InterBold",
    fontSize: 13,
    color:palette.darkGray
    },

    ContainerData:{
    alignItems:"flex-end",
    justifyContent:"center",
    gap:4
    },

    TextData:{
    fontFamily:"InterBold",
    fontSize: 13,
    color:palette.darkGray
    },

    icon:{
        color:palette.darkBrown
    }
})