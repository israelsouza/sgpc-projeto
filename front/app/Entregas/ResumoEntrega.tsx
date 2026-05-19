import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, palette } from "@/theme/colors";
import { styles } from "@/screens/Entregas/Entregas.styles";
import HeaderPage from "@/components/HeaderPage";

// ── Tipos ─────────────────────────────────────────────────
type Categoria = "carta" | "pacote";
type ConfirmacaoExclusao = "sim" | "nao";

interface EntregaDetalhe {
  id: string;
  morador: {
    nome: string;
    unidade: string;
    bloco: string;
    iniciais: string;
  };
  criadoEm: string;
  prazoFinal: string;
  isPrazoHoje: boolean;
  tipo: Categoria;
  mensagem: string;
}

// ── Mock (substituir por chamada real à API) ──────────────
const mockEntrega: EntregaDetalhe = {
  id: "1",
  morador: {
    nome: "João da Silva",
    unidade: "207",
    bloco: "A",
    iniciais: "JS",
  },
  criadoEm: "13/03/2026",
  prazoFinal: "18/03/2026 às 18:30",
  isPrazoHoje: true,
  tipo: "pacote",
  mensagem:
    "Uma entrega está para chegar mas precisei ir ao hospital, pode guardar até minha mulher chegar do trabalho, favor.",
};

// ── Componente principal ──────────────────────────────────
export default function ResumoEntregaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: buscar entrega pelo `id` via API
  const entrega = mockEntrega;

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmacao, setConfirmacao] = useState<ConfirmacaoExclusao>("nao");
  const [justificativa, setJustificativa] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  function handleEditar() {
    router.push({
      pathname: "/Entregas/nova-entrega",
      params: { id: entrega.id },
    });
  }

  function handleConfirmarExclusao() {
    if (confirmacao !== "sim") return;
    // TODO: chamar API de exclusão passando justificativa
    setModalVisible(false);
    router.back();
  }

  function handleFecharModal() {
    setModalVisible(false);
    setConfirmacao("nao");
    setJustificativa("");
  }

  return (
    <View style={styles.container}>
      <HeaderPage
        title="Resumo da entrega"
        subtitle="Detalhes de aviso"
        iconLeft={<Feather name="arrow-left" size={20} color="white" />}
        onPressLeft={() => router.back()}
      />

      {/* ── Conteúdo ── */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Card: Morador ── */}
        <View style={[styles.card, styles.cardHighlight]}>
          <Text style={styles.fieldLabel}>Morador</Text>
          <View style={styles.moradorRow}>
            <View style={styles.moradorAvatar}>
              <Text style={styles.moradorAvatarText}>{entrega.morador.iniciais}</Text>
            </View>
            <View>
              <Text style={styles.moradorNome}>{entrega.morador.nome}</Text>
              <Text style={styles.moradorUnidade}>
                Unidade {entrega.morador.unidade} · Bloco {entrega.morador.bloco}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Card: Datas ── */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Datas</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Criado em</Text>
            <Text style={styles.infoValue}>{entrega.criadoEm}</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prazo final</Text>
            <View style={styles.prazoRow}>
              {entrega.isPrazoHoje && (
                <View style={[styles.badge, { backgroundColor: "#F5F0D6" }]}>
                  <Text style={[styles.badgeText, { color: "#B8A44A" }]}>Hoje</Text>
                </View>
              )}
              <Text style={styles.infoValue}>{entrega.prazoFinal}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <View style={styles.tipoRow}>
              <Feather
                name={entrega.tipo === "pacote" ? "box" : "mail"}
                size={14}
                color={colors.earthBrown}
              />
              <Text style={styles.infoValue}>
                {entrega.tipo === "pacote" ? "Pacote" : "Carta"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Card: Mensagem ── */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Mensagem</Text>
          <Text style={styles.mensagemText}>{entrega.mensagem}</Text>
        </View>

        {/* ── Botões ── */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={handleEditar}
            activeOpacity={0.8}
          >
            <Text style={styles.btnCancelarText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnSalvar, styles.btnExcluir]}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSalvarText}>Excluir</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Modal de exclusão ── */}
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
            <Text style={styles.modalTitle}>Deseja excluir a sua encomenda?</Text>

            {/* Radio buttons */}
            <View style={styles.modalRadioRow}>
              <TouchableOpacity
                style={styles.modalRadioOption}
                onPress={() => setConfirmacao("nao")}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.modalRadioCircle,
                    confirmacao === "nao" && styles.modalRadioCircleActive,
                  ]}
                >
                  {confirmacao === "nao" && <View style={styles.modalRadioDot} />}
                </View>
                <Text style={styles.modalRadioLabel}>não</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalRadioOption}
                onPress={() => setConfirmacao("sim")}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.modalRadioCircle,
                    confirmacao === "sim" && styles.modalRadioCircleActive,
                  ]}
                >
                  {confirmacao === "sim" && <View style={styles.modalRadioDot} />}
                </View>
                <Text style={styles.modalRadioLabel}>sim</Text>
              </TouchableOpacity>
            </View>

            {/* Campo de justificativa */}
            <TextInput
              style={[
                styles.modalTextInput,
                inputFocused && styles.modalTextInputFocused,
              ]}
              placeholder="Justifique"
              placeholderTextColor={palette.subtle}
              value={justificativa}
              onChangeText={setJustificativa}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              multiline
            />

            {/* Botão confirmar */}
            <TouchableOpacity
              style={[
                styles.btnSalvar,
                styles.btnExcluir,
                confirmacao !== "sim" && { opacity: 0.5 },
              ]}
              onPress={handleConfirmarExclusao}
              activeOpacity={0.8}
              disabled={confirmacao !== "sim"}
            >
              <Text style={styles.btnSalvarText}>Excluir</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}