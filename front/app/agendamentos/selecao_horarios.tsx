import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { stylesWeb } from "@/screens/Agendamentos/selecao.styles";
import { styles } from "@/screens/Modal_agendamento/modal_agendamento.styles";
import { useAgendamento } from "@/hooks/useAgendamento";
import { HorarioDisponivel } from "@/services/agendamentoService";

export default function SchedulingTimeWeb() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, nome, icone, cor } = params;

  const { horariosDisponiveis, loading, carregarHorariosDisponiveis, realizarReserva } = useAgendamento();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<HorarioDisponivel | null>(null);
  const [selectedDate, setSelectedDate] = useState("18/03/2026"); // Mocked date for now

  useEffect(() => {
    if (id) {
      carregarHorariosDisponiveis(Number(id), selectedDate);
    }
  }, [id, selectedDate, carregarHorariosDisponiveis]);

  const handleConfirm = async () => {
    if (!selectedSlot || !id) return;

    // Parse time slot "7h - 8h" to start/end (simplified for prototype)
    const [inicio, fim] = selectedSlot.horario.split(" - ");

    try {
      await realizarReserva({
        espaco_id: Number(id),
        data: selectedDate,
        horario_inicio: inicio,
        horario_fim: fim
      });
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/agendamentos/minhas_reservas");
      }, 2000);
    } catch (error) {
      console.error("Erro ao realizar reserva:", error);
    }
  };

  return (
    <SafeAreaView style={stylesWeb.container}>
      {/* HEADER WEB */}
      <View style={stylesWeb.header}>
        <TouchableOpacity 
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 10 }}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={stylesWeb.headerTitle}>Agendamento</Text>
        <TouchableOpacity><Feather name="more-horizontal" size={28} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={stylesWeb.mainContent}>

          {/* CARD DO ESPAÇO */}
          <View style={stylesWeb.spaceCardWeb}>
            <View style={{ backgroundColor: (cor as string) || '#9ED99C', padding: 10, borderRadius: 8, marginRight: 15 }}>
              <MaterialCommunityIcons name={(icone as any) || "dumbbell"} size={24} color="black" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1A202C' }}>{nome || "Espaço"}</Text>
          </View>

          {/* CONTAINER DE AGENDAMENTO COMPLETO */}
          <View style={stylesWeb.formContainer}>
            <Text style={stylesWeb.label}>Data</Text>
            <TouchableOpacity style={stylesWeb.datePickerWeb}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{selectedDate}</Text>
              <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
            </TouchableOpacity>

            <Text style={stylesWeb.label}>Horários</Text>

            {loading ? (
              <ActivityIndicator size="large" color="#B07850" />
            ) : (
              <View style={{ width: '100%', gap: 10 }}>
                {horariosDisponiveis.map((slot) => (
                  <TouchableOpacity 
                    key={slot.id}
                    disabled={slot.status === 'busy'}
                    onPress={() => setSelectedSlot(slot)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: selectedSlot?.id === slot.id ? '#8B5E3C' : '#E2E8F0',
                      backgroundColor: slot.status === 'busy' ? '#F9F9F9' : 'white',
                      opacity: slot.status === 'busy' ? 0.6 : 1,
                    }}
                  >
                    <Ionicons 
                      name={slot.status === 'available' ? "checkmark-circle-outline" : "close-circle-outline"} 
                      size={24} 
                      color={slot.status === 'available' ? "#00FF00" : "#FF0000"} 
                    />
                    <Text style={{ 
                      marginLeft: 15, 
                      fontSize: 16, 
                      fontWeight: '500',
                      color: slot.status === 'busy' ? '#999' : '#333'
                    }}>
                      {slot.horario}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* BOTÃO AGENDAR CENTRALIZADO */}
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <TouchableOpacity 
                style={[
                    stylesWeb.btnAgendarWeb, 
                    { opacity: selectedSlot ? 1 : 0.5 }
                ]}
                disabled={!selectedSlot || loading}
                onPress={() => setShowConfirm(true)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>agendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

{/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confira as informações</Text>

            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Área</Text>
              <Text style={styles.confirmValue}>{nome}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Data</Text>
              <Text style={styles.confirmValue}>{selectedDate}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Horário</Text>
              <Text style={styles.confirmValue}>{selectedSlot?.horario}</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnModalCancel} onPress={() => setShowConfirm(false)}>
                <Text style={{color: '#333'}}>cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalConfirm} onPress={handleConfirm}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE SUCESSO --- */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Agendado com sucesso</Text>
              <Ionicons name="checkmark-circle-outline" size={100} color="#00FF00" />
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}