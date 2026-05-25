import { useState } from "react";
import { View, TouchableOpacity, Text, SectionList, Modal, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { styles } from "@/screens/Home/Listado.styles";
import { useFonts } from "expo-font";

export type componenteList = {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  autor: string;
  data: string;
  hora: string;
  icone: string;
  mesAno: string;
  cor: string;
  corIcon: string;
  categoria?: "bilhete" | "documento" | "solicitacao";
  status?: StatusSolicitacao;
  movimentacoes?: Movimentacao[];
  tipoCond?: "PREDIO" | "HORIZONTAL";
  unidade?: string;
  bloco?: string | null;
  andar?: string;
  numero?: string;
  prefixo?: string;
};

export type StatusSolicitacao =
  | "PENDENTE"
  | "EM_ANDAMENTO"
  | "AGUARDANDO"
  | "CONCLUIDO"
  | "ENCERRADO";


export type Movimentacao = {
  titulo: string;
  comentario?: string;
  data: string;
  hora?: string;
  autorRole?: "sindico" | "admin" | "morador";
  status?: StatusSolicitacao;
};

export const coresPorCategoria: Record<string, string> = {
  bilhete:   "#6AAB7B",
  documento:   "#E8A838",
  solicitacao: "#9B59B6",
};

export const coresPorIcone: Record<string, string> = {
  bilhete:   "#0b461b",
  documento:   "#593d0e",
  solicitacao: "#310a40",
};

export const listadoMock: componenteList[] = [
{
  id: "1",
  titulo: "Barulho no apartamento",
  subtitulo: "Formulário enviado",
  descricao: "Vizinho fazendo muito barulho após as 22h",
  autor: "Maria",
  data: "10/05/2026",
  hora: "21:30",
  icone: "alert-circle",
  mesAno: "Maio 2026",
  categoria: "solicitacao",
  status: "Pendente",
  cor: coresPorCategoria["solicitacao"],
  corIcon: coresPorIcone["solicitacao"],
  movimentacoes: [
    {
      titulo: "Formulário enviado",
      comentario: "Morador registrou a ocorrência",
      data: "10/05/2026",
      hora: "21:30",
      autorRole: "morador",
      status: "Pendente",
    },
  ],
  tipoCond: "PREDIO",
  unidade: "201",
  bloco: "A",
  andar: "1",
    },
  {
    id: "2",
    titulo: "Vistoria agendada",
    subtitulo: "Aguardando confirmação",
    descricao:"Pedido de reforma solicitado",
    autor:"Paulo",
    data: "22/03/25",
    hora: "09:00",
    icone: "calendar",
    mesAno: "Março 2025",
    categoria: "solicitacao",
    cor: coresPorCategoria["solicitacao"],
    corIcon: coresPorIcone["solicitacao"],
  },
  {
    id: "3",
    titulo: "Pagamento realizado",
    subtitulo: "Boleto compensado",
    descricao:"Pedido de reforma solicitado",
    autor:"Paulo",
    data: "01/04/26",
    hora: "11:30",
    icone: "dollar-sign",
    mesAno: "Abril 2026",
    categoria:"solicitacao",
    cor: coresPorCategoria["solicitacao"],
    corIcon: coresPorIcone["solicitacao"],
  },
  {
    id: "4",
    titulo: "Documento enviado",
    subtitulo: "PDF anexado com sucesso",
    descricao:"Pedido de reforma solicitado",
    autor:"Paulo",
    data: "05/04/26",
    hora: "16:20",
    icone: "file",
    mesAno: "Abril 2026",
    categoria: "documento",
    cor: coresPorCategoria["documento"],
    corIcon: coresPorIcone["documento"],
  },
  {
    id: "5",
    titulo: "Solicitação em análise",
    subtitulo: "Em processamento",
    descricao:"Pedido de reforma solicitado",
    autor:"Paulo",
    data: "08/04/26",
    hora: "08:45",
    icone: "clock",
    mesAno: "Abril 2026",
    categoria: "solicitacao",
    cor: coresPorCategoria["solicitacao"],
    corIcon: coresPorIcone["solicitacao"],
  },
  {
    id: "6",
    titulo: "Bilhete",
    subtitulo: "Uber",
    descricao: "Pedi um uber e a placa é: njcnkd",
    autor: "André",
    data: "20/04/2023",
    hora: "10:30",
    icone: "user",
    mesAno: "Abril 2023",
    categoria:"bilhete",
    cor: coresPorCategoria["bilhete"],
    corIcon: coresPorIcone["bilhete"]
  }
];

export type componenteAgendamento = {
    id: string;
    espaco: string;
    icone: string;
    corIcone: string;
    categoria: string;
    cor: string;
    data: string;
    hora: string;
    autor:string;
    
}




export function agruparMes(items: componenteList[]) {
  const grupos: Record<string, componenteList[]> = {};
  items.forEach((item) => {
    if (!grupos[item.mesAno]) grupos[item.mesAno] = [];
    grupos[item.mesAno].push(item);
  });
  return Object.entries(grupos).map(([title, data]) => ({ title, data }));
}

/* MODAL PARA VISUALIZAÇÃO COM HOVER */
export function DetalhesModal({
  item,
  onClose,
  onDelete,
 
}: {
  item: componenteList | null;
  onClose: () => void;
  onDelete?: () => void;
 
}) {
    const [confirmExclusao, setConfirmExclusao] = useState(false);
  
    if (!item) return null;


    
    function handleDelete() {
        if (!confirmExclusao){
            setConfirmExclusao(true);
        } else {
            onDelete?.();
            onClose();
        }

    }

    return (
    <Modal
      visible={!!item}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView intensity={40} tint="dark" style={styles.ModalBlur}>
        <Pressable style={styles.ModalOverlay} onPress={onClose}>
 
          <Pressable style={styles.ModalCard} onPress={(e) => e.stopPropagation()}>
 
            {/* Botão fechar */}
            <TouchableOpacity style={styles.ModalBotaoFechar} onPress={onClose}>
              <Feather name="x" size={18} color="#888" />
            </TouchableOpacity>
 
            {/* Ícone + título + autor + subtítulo */}
            <View style={styles.Containerprincipal}>
              <View style={[styles.CardAberto, { backgroundColor: item.cor }]}>
                <Feather name={item.icone as any} size={22} color={item.corIcon} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.TextTitle}>{item.titulo}</Text>
                <Text style={styles.TextTitle}>Autor: {item.autor}</Text>
                <Text style={styles.TextDesc}>{item.subtitulo}</Text>
              </View>
            </View>
 
            <View style={styles.Divisao} />
 
            <Text style={styles.TextDesc}>Descrição: {item.descricao}</Text>
 
            {/* Data e hora */}
            <View style={styles.ContainerDataModal}>
              <View style={styles.infosData}>
                <Feather name="calendar" size={14} color={item.corIcon} />
                <Text style={styles.TextData}>{item.data}</Text>
              </View>
              <View style={styles.infosData}>
                <Feather name="clock" size={14} color={item.corIcon} />
                <Text style={styles.TextData}>{item.hora}</Text>
              </View>
            </View>
 
            {/* Botão excluir — só renderiza se onDelete for passado */}
            {onDelete && (
              <TouchableOpacity
                style={[
                  styles.ModalBotaoExcluir,
                  confirmExclusao && styles.ModalBotaoExcluirConfirmando,
                ]}
                onPress={handleDelete}
              >
                <Feather
                  name={confirmExclusao ? "alert-circle" : "trash"}
                  size={16}
                  color="#fff"
                />
                <Text style={styles.ModalBotaoExcluirTexto}>
                  {confirmExclusao ? "Confirmar exclusão" : "Excluir"}
                </Text>
              </TouchableOpacity>
            )}
 
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}
 



/* COMPONENTE PRINCIPAL QUE SERÁ RENDENIZADO NAS TELAS */

interface ListadoProps {
  dados?: componenteList[];
}

export default function ListadoCenter({ dados = [] }: ListadoProps) {
  const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);

  const [loaded, error] = useFonts({
    "InterRegular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
    "InterBold":    require("../../assets/fonts/Inter_18pt-Bold.ttf"),
    "InterMedium":  require("../../assets/fonts/Inter_18pt-Medium.ttf"),
    "InterBlack":   require("../../assets/fonts/Inter_18pt-Black.ttf"),
  });

  if (!loaded && !error) return null;

  const secoes = agruparMes(dados);

  return (
    <View style={styles.container}>

    <View style={styles.centerContainer}>
      <SectionList
        style={styles.ContainerFundo}
        contentContainerStyle={styles.ContainerFundoContent}
        sections={secoes}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.ContainerTextData}>
            <Text style={styles.TextDataMain}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.Listado}
            onPress={() => setItemSelecionado(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.ContainerIcon, { backgroundColor: item.cor }]}>
              <Feather
                name={item.icone as any}
                size={24}
                style={[styles.icon, { color: item.corIcon }]}
              />
            </View>

            <View style={styles.ContainerBody}>
              <Text style={styles.TextTitle}>{item.titulo}</Text>
              <Text style={styles.TextDesc}>{item.subtitulo}</Text>
            </View>

            <View style={styles.ContainerData}>
              <Text style={styles.TextData}>{item.data}</Text>
              <Text style={styles.TextData}>{item.hora}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* MODAL QUE VAI COBRIR A TELA TODA */}
      <DetalhesModal
        item={itemSelecionado}
        onClose={() => setItemSelecionado(null)}
      />
    </View>
    </View>
    
  );
}