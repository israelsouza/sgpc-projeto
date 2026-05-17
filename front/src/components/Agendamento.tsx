import { useState } from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/screens/Home/Listado.styles";
import { useFonts } from "expo-font";

import { componenteAgendamento } from "@/components/Listado";

/* MOCK — substituir pelos dados reais do banco futuramente */
const agendamentosMock: componenteAgendamento[] = [
  {
    id: "1",
    espaco: "Salão de Festas",
    icone: "gift",
    corIcone: "#870c4d",
    cor: "#b7839f",
    data: "20/04/26",
    hora: "18:00",
    autor: "Sandra",
  },
  {
    id: "2",
    espaco: "Churrasqueira",
    icone: "bonfire",
    corIcone: "#db1f1f",
    cor: "#efacac",
    data: "25/04/26",
    hora: "12:00",
    autor: "Sandra",
  },
  {
    id: "3",
    espaco: "Quadra",
    icone: "basketball",
    corIcone: "#19a33e",
    cor: "#08501b",
    data: "30/04/26",
    hora: "09:00",
    autor: "Sandra",
  },
];

export default function AgendamentoScreen() {

  const [agendamentos, setAgendamentos] = useState<componenteAgendamento[]>(agendamentosMock);
  const [modoSelecao, setModoSelecao] = useState(false);
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const [loaded, error] = useFonts({
    "InterRegular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
    "InterBold":    require("../../assets/fonts/Inter_18pt-Bold.ttf"),
    "InterMedium":  require("../../assets/fonts/Inter_18pt-Medium.ttf"),
    "InterBlack":   require("../../assets/fonts/Inter_18pt-Black.ttf"),
  });

  if (!loaded && !error) return null;

  function handleEntrarModoSelecao() {
    setModoSelecao(true);
    setSelecionados([]);
  }

  function handleCancelarSelecao() {
    setModoSelecao(false);
    setSelecionados([]);
  }

  /* Marca ou desmarca um item no modo seleção */
  function handleToggleSelecionado(id: string) {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  /* Exclui todos os itens marcados */
  function handleExcluirSelecionados() {
    setAgendamentos((prev) => prev.filter((a) => !selecionados.includes(a.id)));
    setModoSelecao(false);
    setSelecionados([]);
  }

  return (
    <>
      <View style={styles.ContainerFundo}>

        {modoSelecao && (
          <Text style={styles.TextDataMain}>
            Selecione a reserva
          </Text>
        )}

        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ContainerFundoContent}
          renderItem={({ item }) => {
            const estaSelecionado = selecionados.includes(item.id);

            return (
              <TouchableOpacity
                style={styles.Listado}
                onPress={() => {
                  if (modoSelecao) {
                    handleToggleSelecionado(item.id);
                  }

                }}
                activeOpacity={0.7}
              >
                {modoSelecao ? (
                  <View style={[styles.ContainerIcon, {
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderColor: estaSelecionado ? "#B07850" : "#ccc",
                    borderRadius: 10,
                  }]}>
                    {estaSelecionado && (
                      <Ionicons name="checkmark" size={22} color="#B07850" />
                    )}
                  </View>
                ) : (
                  <View style={[styles.ContainerIcon, { backgroundColor: item.cor }]}>
                    <Ionicons
                      name={item.icone as any}
                      size={24}
                      style={[styles.icon, { color: item.corIcone }]}
                    />
                  </View>
                )}

                <View style={styles.ContainerBody}>
                  <Text style={styles.TextTitle}>{item.espaco}</Text>
                </View>

                <View style={styles.ContainerData}>
                  <Text style={styles.TextData}>{item.data}</Text>
                  <Text style={styles.TextData}>{item.hora}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View>
        {modoSelecao ? (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={styles.ModalBotaoCancelarPress}
              onPress={handleCancelarSelecao}
            >
              <Text style={styles.TextCancelar}>
                cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ModalBotaoExcluir}
              onPress={handleExcluirSelecionados}
              disabled={selecionados.length === 0}
            >
              <Text style={styles.ModalBotaoExcluirTexto}>
                excluir
              </Text>
            </TouchableOpacity>
          </View>
        ) : (

          <TouchableOpacity
            style={styles.ModalBotaoCancelar}
            onPress={handleEntrarModoSelecao}
          >
            <Text style={styles.ModalBotaoExcluirTexto}>
              cancelar reserva
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}