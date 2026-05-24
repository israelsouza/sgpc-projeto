import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles } from "../../src/screens/Entregas/Entregas.styles";
import { useEntrega } from "@/hooks/useEntrega";

// ── Tipos ─────────────────────────────────────────────────
type ConfirmacaoExclusao = "sim" | "nao";

function formatarDataCompleta(isoString: string): string {
  const data = new Date(isoString);
  return `${data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} às ${data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function formatarDataSimples(isoString: string): string {
  const data = new Date(isoString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function verificarHoje(isoString: string): boolean {
  const data = new Date(isoString);
  const hoje = new Date();
  return (
    data.getDate() === hoje.getDate() &&
    data.getMonth() === hoje.getMonth() &&
    data.getFullYear() === hoje.getFullYear()
  );
}

// ── Componente principal ──────────────────────────────────
export default function ResumoEntregaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { obterPorId, atualizarStatus } = useEntrega("morador");

  const [entrega, setEntrega] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── Estado do modal ──
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmacao, setConfirmacao] = useState<ConfirmacaoExclusao>("nao");
  const [justificativa, setJustificativa] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!id) return;
      try {
        const data = await obterPorId(Number(id));
        setEntrega(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os detalhes da entrega.");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  async function handleConfirmarCancelamento() {
    if (confirmacao !== "sim") return;
    if (!justificativa.trim()) {
      Alert.alert("Atenção", "A justificativa é obrigatória para cancelar.");
      return;
    }

    try {
      setIsCancelling(true);
      await atualizarStatus(Number(id), {
        status: "CANCELADA",
        justificativa_cancelamento: justificativa,
      });
      setModalVisible(false);
      Alert.alert("Sucesso", "Entrega cancelada.");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao cancelar a entrega.");
    } finally {
      setIsCancelling(false);
    }
  }

  function handleFecharModal() {
    setModalVisible(false);
    setConfirmacao("nao");
    setJustificativa("");
  }

  if (loading || !entrega) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
        <ActivityIndicator size="large" color={colors.earthBrown ?? "#8B5E3C"} />
      </SafeAreaView>
    );
  }

  // Prepara dados formatados
  const criadoEm = formatarDataSimples(entrega.criado_em);
  const prazoFinal = formatarDataCompleta(entrega.prazo_retirada);
  const isPrazoHoje = verificarHoje(entrega.prazo_retirada);
  const morador = entrega.morador || {};
  const iniciais = morador.nome_completo ? morador.nome_completo.substring(0, 2).toUpperCase() : "MO";
  const unidade = morador.unidade ? morador.unidade.unidade : "N/A";
  const bloco = morador.unidade ? morador.unidade.bloco : "N/A";

  const podeCancelar = entrega.status === "AGUARDANDO";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Resumo da entrega</Text>
          <Text style={styles.headerSubtitle}>Detalhes de aviso</Text>
        </View>
      </View>

      {/* ── Conteúdo ── */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Card: Status atual ── */}
        <View style={[styles.card, { alignItems: "center", paddingVertical: 15 }]}>
          <Text style={styles.fieldLabel}>Status atual</Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#3D2B1F", marginTop: 5 }}>
            {entrega.status}
          </Text>
        </View>

        {/* ── Card: Morador ── */}
        <View style={[styles.card, styles.cardHighlight]}>
          <Text style={styles.fieldLabel}>Morador</Text>
          <View style={styles.moradorRow}>
            <View style={styles.moradorAvatar}>
              <Text style={styles.moradorAvatarText}>{iniciais}</Text>
            </View>
            <View>
              <Text style={styles.moradorNome}>{morador.nome_completo || "Morador"}</Text>
              <Text style={styles.moradorUnidade}>
                Unidade {unidade} · Bloco {bloco}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Card: Datas ── */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Datas</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Criado em</Text>
            <Text style={styles.infoValue}>{criadoEm}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prazo final</Text>
            <View style={styles.prazoRow}>
              {isPrazoHoje && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Hoje</Text>
                </View>
              )}
              <Text style={styles.infoValue}>{prazoFinal}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <View style={styles.tipoRow}>
              <Feather
                name={entrega.tipo === "PACOTE" ? "box" : "mail"}
                size={14}
                color={colors.earthBrown ?? "#8B5E3C"}
              />
              <Text style={styles.infoValue}>
                {entrega.tipo === "PACOTE" ? "Pacote" : "Carta"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Card: Mensagem ── */}
        {entrega.mensagem && (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Mensagem (Sua)</Text>
            <Text style={styles.mensagemText}>{entrega.mensagem}</Text>
          </View>
        )}

        {/* ── Card: Observação Porteiro ── */}
        {entrega.observacao_porteiro && (
          <View style={[styles.card, { backgroundColor: "#F5F0D6" }]}>
            <Text style={[styles.fieldLabel, { color: "#B8A44A" }]}>Observação do Porteiro</Text>
            <Text style={{ color: "#8B5E3C", marginTop: 8 }}>{entrega.observacao_porteiro}</Text>
          </View>
        )}

        {/* ── Card: Justificativa (se cancelada) ── */}
        {entrega.justificativa_cancelamento && (
          <View style={[styles.card, { backgroundColor: "#F8D7DA" }]}>
            <Text style={[styles.fieldLabel, { color: "#721C24" }]}>Justificativa de Cancelamento</Text>
            <Text style={{ color: "#721C24", marginTop: 8 }}>{entrega.justificativa_cancelamento}</Text>
          </View>
        )}

        {/* ── Botões ── */}
        {podeCancelar && (
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.btnSalvar, styles.btnExcluir, { width: "100%" }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSalvarText}>Cancelar Entrega</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* ── Modal de exclusão/cancelamento ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleFecharModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleFecharModal}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Deseja cancelar o aviso de encomenda?
            </Text>

            <View style={styles.modalRadioRow}>
              <TouchableOpacity
                style={styles.modalRadioOption}
                onPress={() => setConfirmacao("nao")}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.modalRadioCircle,
                  confirmacao === "nao" && styles.modalRadioCircleActive,
                ]}>
                  {confirmacao === "nao" && <View style={styles.modalRadioDot} />}
                </View>
                <Text style={styles.modalRadioLabel}>Não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalRadioOption}
                onPress={() => setConfirmacao("sim")}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.modalRadioCircle,
                  confirmacao === "sim" && styles.modalRadioCircleActive,
                ]}>
                  {confirmacao === "sim" && <View style={styles.modalRadioDot} />}
                </View>
                <Text style={styles.modalRadioLabel}>Sim</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalTextInput,
                inputFocused && styles.modalTextInputFocused,
              ]}
              placeholder="Justifique o cancelamento"
              placeholderTextColor="#C5B5AA"
              value={justificativa}
              onChangeText={setJustificativa}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.btnSalvar,
                (confirmacao !== "sim" || isCancelling) && { opacity: 0.5 },
              ]}
              onPress={handleConfirmarCancelamento}
              activeOpacity={0.8}
              disabled={confirmacao !== "sim" || isCancelling}
            >
              {isCancelling ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.btnSalvarText}>Confirmar</Text>
              )}
            </TouchableOpacity>

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}