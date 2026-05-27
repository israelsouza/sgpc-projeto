import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles } from "../../src/screens/Entregas/Entregas.styles";
import { useEntrega } from "@/hooks/useEntrega";

// ── Tipos ─────────────────────────────────────────────────
type Categoria = "CARTA" | "PACOTE" | null;

// ── Helpers ───────────────────────────────────────────────
function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Calcula o prazo de retirada: data + 4 horas após o horário informado */
function calcularPrazo(date: Date, time: Date): string {
  const prazo = new Date(date);
  prazo.setHours(time.getHours() + 4, time.getMinutes(), 0, 0);
  return `${formatDate(date)} às ${formatTime(prazo)}`;
}

// ── Componente principal ──────────────────────────────────
export default function NovaEntregaScreen() {
  const router = useRouter();
  const { criarEntrega } = useEntrega("morador");

  // ── Estado do formulário ──
  const [data, setData] = useState(new Date());
  const [horario, setHorario] = useState(new Date());
  const [categoria, setCategoria] = useState<Categoria>(null);
  const [mensagem, setMensagem] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Pickers visíveis ──
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // ── Handlers de picker ──
  function onDataChange(_: DateTimePickerEvent, selected?: Date) {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) setData(selected);
  }

  function onHorarioChange(_: DateTimePickerEvent, selected?: Date) {
    setShowTimePicker(Platform.OS === "ios");
    if (selected) setHorario(selected);
  }

  const handleWebTimeChange = (event: any) => {
    const [hours, minutes] = event.target.value.split(':');
    const newTime = new Date(horario);
    newTime.setHours(parseInt(hours), parseInt(minutes));
    setHorario(newTime);
  };

  const mudarDia = (dias: number) => {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() + dias);
    setData(novaData);
  };

  // ── Submit ──
  async function handleSalvar() {
    if (!categoria) {
      Alert.alert("Erro", "Selecione uma categoria (Carta ou Pacote).");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const prazo = new Date(data);
      prazo.setHours(horario.getHours() + 4, horario.getMinutes(), 0, 0);

      await criarEntrega({
        tipo: categoria,
        prazo_retirada: prazo.toISOString(),
        mensagem: mensagem.trim() || undefined,
      });

      Alert.alert("Sucesso", "Entrega cadastrada com sucesso!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a entrega.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header com back button ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Nova Entrega</Text>
          <Text style={styles.headerSubtitle}>Aviso ao porteiro</Text>
        </View>
      </View>

      {/* ── Formulário ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Card: Data e Horário ── */}
        <View style={styles.card}>
          <View style={styles.row}>
            {/* Data */}
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Data</Text>
              {Platform.OS === 'web' ? (
                <View style={[styles.fieldInput, { paddingHorizontal: 10, justifyContent: 'space-between', backgroundColor: colors.earthBrown ?? "#8B5E3C" }]}>
                  <TouchableOpacity onPress={() => mudarDia(-1)} style={{ padding: 5 }}>
                    <Feather name="chevron-left" size={20} color="white" />
                  </TouchableOpacity>
                  
                  <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>
                    {formatDate(data)}
                  </Text>

                  <TouchableOpacity onPress={() => mudarDia(1)} style={{ padding: 5 }}>
                    <Feather name="chevron-right" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.fieldInput}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.fieldInputText}>{formatDate(data)}</Text>
                  <Feather name="calendar" size={16} color={colors.earthBrown ?? "#8B5E3C"} />
                </TouchableOpacity>
              )}
            </View>

            {/* Horário */}
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Horário</Text>
              {Platform.OS === 'web' ? (
                <View style={[styles.fieldInput, { padding: 0 }]}>
                  <TextInput
                    type="time"
                    value={formatTime(horario)}
                    onChange={handleWebTimeChange}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#4A3728',
                      fontSize: 14,
                      padding: 10,
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                    } as any}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.fieldInput}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.fieldInputText}>{formatTime(horario)}</Text>
                  <Feather name="clock" size={16} color={colors.earthBrown ?? "#8B5E3C"} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Prazo calculado */}
          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
            Prazo para retirada
          </Text>
          <View style={styles.prazoBox}>
            <Text style={styles.prazoText}>{calcularPrazo(data, horario)}</Text>
          </View>
        </View>

        {/* Pickers nativos */}
        {showDatePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={data}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onDataChange}
            minimumDate={new Date()}
          />
        )}
        {showTimePicker && Platform.OS !== 'web' && (
          <DateTimePicker
            value={horario}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onHorarioChange}
          />
        )}

        {/* ── Card: Categoria ── */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Categoria</Text>
          <View style={styles.categoriaOptions}>
            <TouchableOpacity
              style={[
                styles.categoriaOption,
                categoria === "CARTA" && styles.categoriaOptionActive,
              ]}
              onPress={() => setCategoria("CARTA")}
              activeOpacity={0.7}
            >
              <Feather
                name="mail"
                size={18}
                color={
                  categoria === "CARTA"
                    ? (colors.earthBrown ?? "#8B5E3C")
                    : "#B8A89A"
                }
              />
              <Text
                style={[
                  styles.categoriaOptionText,
                  categoria === "CARTA" && styles.categoriaOptionTextActive,
                ]}
              >
                Carta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoriaOption,
                categoria === "PACOTE" && styles.categoriaOptionActive,
              ]}
              onPress={() => setCategoria("PACOTE")}
              activeOpacity={0.7}
            >
              <Feather
                name="box"
                size={18}
                color={
                  categoria === "PACOTE"
                    ? (colors.earthBrown ?? "#8B5E3C")
                    : "#B8A89A"
                }
              />
              <Text
                style={[
                  styles.categoriaOptionText,
                  categoria === "PACOTE" && styles.categoriaOptionTextActive,
                ]}
              >
                Pacote
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Card: Mensagem ── */}
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Mensagem</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ex: Por favor aguardar minha chegada até 19h"
            placeholderTextColor="#C5B5AA"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* ── Botões ── */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.btnSalvar}
            onPress={handleSalvar}
            activeOpacity={0.8}
            disabled={!categoria || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.btnSalvarText}>Salvar</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnCancelar}
            onPress={() => router.back()}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <Text style={styles.btnCancelarText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
