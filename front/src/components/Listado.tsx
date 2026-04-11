import { View, TouchableOpacity, Text, SectionList } from "react-native";
import { FontAwesome6, Entypo, Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { styles } from "@/screens/Home/Listado.styles";
import { colors } from "@/theme/colors";
import { useFonts } from "expo-font";

export type componenteList = {
  id: string;
  titulo: string;
  subtitulo: string;
  data: string;
  hora: string;
  icone: string;
  mesAno: string;
  cor: string;
  corIcon: string;
};

export const coresPorCategoria: Record<string, string> = {
  reforma:    "#B07850",
  vistoria:   "#5B8DB8",
  pagamento:  "#6AAB7B",
  documento:  "#E8A838",
  solicitacao:"#9B59B6",
};

export const coresPorIcone: Record<string, string> = {
  reforma:    "#5a3113",
  vistoria:   "#103d64",
  pagamento:  "#0b461b",
  documento:  "#593d0e",
  solicitacao:"#310a40",
};

export const listadoMock: componenteList[] = [
{   id: "1",
    titulo: "Pedido de reforma",
    subtitulo: "Formulário enviado",
    data: "18/03/25",
    hora: "14:50",
    icone: "home",
    mesAno: "Março 2025",
    cor: coresPorCategoria["reforma"],
    corIcon: coresPorIcone["reforma"]
},

{
    id: "2",
    titulo: "Vistoria agendada",
    subtitulo: "Aguardando confirmação",
    data: "22/03/25",
    hora: "09:00",
    icone: "calendar",
    mesAno: "Março 2025",
    cor: coresPorCategoria["vistoria"],
    corIcon: coresPorIcone["vistoria"]
},

{
    id: "3",
    titulo: "Pagamento realizado",
    subtitulo: "Boleto compensado",
    data: "01/04/26",
    hora: "11:30",
    icone: "dollar-sign",
    mesAno: "Abril 2026",
    cor: coresPorCategoria["pagamento"],
    corIcon: coresPorIcone["pagamento"],
},

{
    id: "4",
    titulo: "Documento enviado",
    subtitulo: "PDF anexado com sucesso",
    data: "05/04/26",
    hora: "16:20",
    icone: "file-text",
    mesAno: "Abril 2026",
    cor: coresPorCategoria["documento"],
    corIcon: coresPorIcone["documento"],
},

{
    id: "5",
    titulo: "Solicitação em análise",
    subtitulo: "Em processamento",
    data: "08/04/26",
    hora: "08:45",
    icone: "clock",
    mesAno: "Abril 2026",
    cor: coresPorCategoria["solicitacao"],
    corIcon: coresPorIcone["solicitacao"],
}
];

function agruparMes(items: componenteList[]) {
    const grupos: Record<string, componenteList[]> = {};

    items.forEach((item) => {
        if (!grupos[item.mesAno]) grupos[item.mesAno] = [];
        grupos[item.mesAno].push(item);
    });

    return Object.entries(grupos).map(([title, data]) => ({title, data}));

}


export default function ListadoCenter() {
    
    /* IMPORT PARA A FONTE INTER */
    const [loaded, error] = useFonts({
    "InterRegular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
    "InterBold": require("../../assets/fonts/Inter_18pt-Bold.ttf"),
    "InterMedium": require("../../assets/fonts/Inter_18pt-Medium.ttf"),
    "InterBlack": require("../../assets/fonts/Inter_18pt-Black.ttf"),
  });

  if (!loaded && !error) {
    return null;
  }

        /* CHAMAR A FUNÇÃO DE APARECER OS DADOS MOCKADOS E ESTÁTICOS */
  const secoes = agruparMes(listadoMock);
  return (
    <SectionList style={styles.ContainerFundo}
    contentContainerStyle={styles.ContainerFundoContent}
    sections={secoes}
    keyExtractor={(item) => item.id}

    renderSectionHeader={({ section: { title } }) => (
        <View style={styles.ContainerTextData}>
            <Text style={styles.TextDataMain}>{title}</Text>
        </View> 
    )}
    
    renderItem={({ item }) => (
            <TouchableOpacity style={styles.Listado}>
                    <View style={[styles.ContainerIcon, { backgroundColor: item.cor }]}>
                        <Feather name={item.icone as any} size={24} style={[styles.icon, { color: item.corIcon}]} />
                    </View>

                    <View style={styles.ContainerBody}>
                      <Text style={styles.TextTitle}>{item.titulo}</Text>
                      <Text style={styles.TextDesc}>{item.subtitulo}</Text>
                    </View>

                    {/* ContainerData deve ser filho direto de Listado, NÃO do ContainerBody */}
                    <View style={styles.ContainerData}>
                      <Text style={styles.TextData}>{item.data}</Text>
                      <Text style={styles.TextData}>{item.hora}</Text>
                    </View>
            </TouchableOpacity>

    )}
    />
);
}