import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { styles } from "@/screens/Home/HeaderFunction.styles";
import { useFonts } from "expo-font";


interface HeaderFunctions {
    title?: string;
    subtitle?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    onPressLeft?: () => void;
    onPressRight?: () => void;
}

export default function HeaderFuncApp({
    title,
    subtitle,
    iconLeft,
    iconRight,
    onPressLeft,
    onPressRight,
}: HeaderFunctions) {

     const [loaded, error] = useFonts({
        "InterRegular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
        "InterBold":    require("../../assets/fonts/Inter_18pt-Bold.ttf"),
        "InterMedium":  require("../../assets/fonts/Inter_18pt-Medium.ttf"),
        "InterBlack":   require("../../assets/fonts/Inter_18pt-Black.ttf"),
      });
    
      if (!loaded && !error) return null;
    
return(
        <View style={styles.ContainerHead}>
            <View style={styles.Container}>

                <TouchableOpacity style={styles.ContainerLIcon}
                onPress={onPressLeft}
                disabled={!onPressLeft}>{iconLeft}
                </TouchableOpacity>

                    <View style={styles.CenterContent}>
                    <Text style={styles.Title}>{title}</Text>
                    <Text style={styles.subTitle}>{subtitle}</Text>
                    </View>


                <TouchableOpacity style={styles.ContainerRIcon}
                onPress={onPressRight}
                disabled={!onPressRight}>{iconRight}
                </TouchableOpacity>


            </View>
        </View>
)}

