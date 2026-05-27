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
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles } from "../../src/screens/Entregas/Entregas.styles";
import { useEntrega } from "@/hooks/useEntrega";
import { storage } from "@/utils/storage";

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
  
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      try {
        const profile = await storage.getItemAsync("user_perfil");
        setUserProfile(profile);
      } finally {
        setIsProfileLoading(false);
      }
    }
    getProfile();
  }, []);

  const isPorter = userProfile && userProfile !== "MORADOR";
  const vision = isProfileLoading ? undefined : (isPorter ? "condominio" : "morador");
  
  const { obterPorId, atualizarStatus } = useEntrega(vision);

  const [entrega, setEntrega] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ── Estado do modal (Morador) ──
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmacao, setConfirmacao] = useState<ConfirmacaoExclusao>("nao");
  const [justificativa, setJustificativa] = useState("");
  
  // ── Estado do Porteiro ──
  const [observacao, setObservacao] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function carregar() {
      if (!id || isProfileLoading) return;
      try {
        const data = await obterPorId(Number(id));
        setEntrega(data);
        if (data.observacao_porteiro) setObservacao(data.observacao_porteiro);
      } catch (error: any) {
        const errorMsg = error.response?.data?.mensagem || "Não foi possível carregar os detalhes da entrega.";
        if (Platform.OS === 'web') alert(errorMsg);
        else Alert.alert("Erro", errorMsg);
        router.back();
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id, isProfileLoading]);

  async function handleConfirmarCancelamento() {
    if (confirmacao !== "sim") return;
    if (!justificativa.trim()) {
      if (Platform.OS === 'web') alert("A justificativa é obrigatória para cancelar.");
      else Alert.alert("Atenção", "A justificativa é obrigatória para cancelar.");
      return;
    }

    try {
      setIsUpdating(true);
      await atualizarStatus(Number(id), {
        status: "CANCELADA",
        justificativa_cancelamento: justificativa,
      });
      setModalVisible(false);
      if (Platform.OS === 'web') alert("Entrega cancelada.");
      else Alert.alert("Sucesso", "Entrega cancelada.");
      router.back();
    } catch (error) {
       if (Platform.OS === 'web') alert("Ocorreu um erro ao cancelar a entrega.");
       else Alert.alert("Erro", "Ocorreu um erro ao cancelar a entrega.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleUpdateStatus(novoStatus: "RECEBIDA" | "RETIRADA") {
    try {
      setIsUpdating(true);
      await atualizarStatus(Number(id), {
        status: novoStatus,
        observacao_porteiro: observacao,
      });
      if (Platform.OS === 'web') alert(`Status atualizado para ${novoStatus}`);
      else Alert.alert("Sucesso", `Status atualizado para ${novoStatus}`);
      router.back();
    } catch (error) {
      if (Platform.OS === 'web') alert("Erro ao atualizar status.");
      else Alert.alert("Erro", "Erro ao atualizar status.");
    } finally {
      setIsUpdating(false);
    }
  }

  function handleFecharModal() {
    setModalVisible(false);
    setConfirmacao("nao");
    setJustificativa("");
  }

  if (loading || isProfileLoading || !entrega) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
        <ActivityIndicator size="large" color={colors.earthBrown ?? "#8B5E3C"} />
      </SafeAreaView>
    );
  }

  const criadoEm = formatarDataSimples(entrega.criado_em);
  const prazoFinal = formatarDataCompleta(entrega.prazo_retirada);
  const isPrazoHoje = verificarHoje(entrega.prazo_retirada);
  const morador = entrega.morador || {};
  const iniciais = morador.nome_completo ? morador.nome_completo.substring(0, 2).toUpperCase() : "MO";
  const unidade = morador.unidade ? morador.unidade.unidade : "N/A";
  const bloco = morador.unidade ? morador.unidade.bloco : "N/A";

  const podeCancelar = !isPorter && entrega.status === "AGUARDANDO";
  const podeMudarStatus = isPorter && (entrega.status === "AGUARDANDO" || entrega.status === "RECEBIDA");

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
          <Text style={styles.fieldLabel}>Destinatário (Morador)</Text>
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
          <Text style={styles.fieldLabel}>Informações</Text>

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

        {/* ── Card: Mensagem do Morador ── */}
        {entrega.mensagem && (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Mensagem do Morador</Text>
            <Text style={styles.mensagemText}>{entrega.mensagem}</Text>
          </View>
        )}

        {/* ── Área do Porteiro ── */}
        {isPorter && podeMudarStatus && (
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Ações do Porteiro</Text>
            <TextInput
              style={[styles.modalTextInput, { marginTop: 10, minHeight: 80 }]}
              placeholder="Adicionar observação interna (opcional)"
              placeholderTextColor="#C5B5AA"
              value={observacao}
              onChangeText={setObservacao}
              multiline
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 15 }}>
              {entrega.status === "AGUARDANDO" && (
                <TouchableOpacity
                  style={[styles.btnSalvar, { flex: 1, backgroundColor: "#4CAF73" }]}
                  onPress={() => handleUpdateStatus("RECEBIDA")}
                  disabled={isUpdating}
                >
                  <Text style={styles.btnSalvarText}>Marcar RECEBIDA</Text>
                </TouchableOpacity>
              )}
              
              {entrega.status === "RECEBIDA" && (
                <TouchableOpacity
                  style={[styles.btnSalvar, { flex: 1, backgroundColor: "#6C757D" }]}
                  onPress={() => handleUpdateStatus("RETIRADA")}
                  disabled={isUpdating}
                >
                  <Text style={styles.btnSalvarText}>Marcar RETIRADA</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── Histórico de Observações (Visualização) ── */}
        {!podeMudarStatus && (entrega.observacao_porteiro || entrega.justificativa_cancelamento) && (
          <View style={styles.card}>
             <Text style={styles.fieldLabel}>Histórico/Observações</Text>
             {entrega.observacao_porteiro && (
               <Text style={{ color: "#7A5C45", marginTop: 8 }}>Porteiro: {entrega.observacao_porteiro}</Text>
             )}
             {entrega.justificativa_cancelamento && (
               <Text style={{ color: "#DC3545", marginTop: 8 }}>Cancelamento: {entrega.justificativa_cancelamento}</Text>
             )}
          </View>
        )}

        {/* ── Botão de Cancelamento (Morador) ── */}
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

      {/* ── Modal de Cancelamento (Morador) ── */}
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
            <Text style={styles.modalTitle}>Deseja cancelar o aviso?</Text>
            <View style={styles.modalRadioRow}>
              <TouchableOpacity style={styles.modalRadioOption} onPress={() => setConfirmacao("nao")}>
                <View style={[styles.modalRadioCircle, confirmacao === "nao" && styles.modalRadioCircleActive]}>
                  {confirmacao === "nao" && <View style={styles.modalRadioDot} />}
                </View>
                <Text style={styles.modalRadioLabel}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalRadioOption} onPress={() => setConfirmacao("sim")}>
                <View style={[styles.modalRadioCircle, confirmacao === "sim" && styles.modalRadioCircleActive]}>
                  {confirmacao === "sim" && <View style={styles.modalRadioDot} />}
                </View>
                <Text style={styles.modalRadioLabel}>Sim</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Justificativa obrigatória"
              placeholderTextColor="#C5B5AA"
              value={justificativa}
              onChangeText={setJustificativa}
              multiline
            />
            <TouchableOpacity
              style={[styles.btnSalvar, confirmacao !== "sim" && { opacity: 0.5 }]}
              onPress={handleConfirmarCancelamento}
              disabled={confirmacao !== "sim" || isUpdating}
            >
              <Text style={styles.btnSalvarText}>Confirmar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}
