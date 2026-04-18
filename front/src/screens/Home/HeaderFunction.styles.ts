import { StyleSheet } from "react-native";
import { colors, palette } from "@/theme/colors";

export const styles = StyleSheet.create({
    ContainerHead:{
    backgroundColor: palette.accent,
    width:"100%",
    height: 120,
    justifyContent:"center",
    },

    Container:{
    width:"100%",    
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    },

    ContainerLIcon:{
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20
    },
    
    ContainerRIcon:{
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
    },

    CenterContent:{
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    },

    Title:{
    fontSize: 24,
    fontFamily: "InterBold",
    color: "#FFFFFF",
    textAlign: "center",
    },

    subTitle:{
    marginTop: 6,
    fontSize: 12,
    fontFamily: "InterRegular",
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    },

})