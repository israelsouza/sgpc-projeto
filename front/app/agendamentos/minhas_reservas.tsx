import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Modal, ActivityIndicator } from "react-native";
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/screens/Agendamentos/minhas_reservas";
import { useAgendamento } from "@/hooks/useAgendamento";
import { Reserva } from "@/services/agendamentoService";
import { storage } from "@/utils/storage";

export default function MyReservations() {
  const router = useRouter();
  const { minhasReservas, loading, carregarMinhasReservas, cancelarReserva } = useAgendamento();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [headerTitle, setHeaderTitle] = useState("Minhas Reservas");
  const [subtitleLabel, setSubtitleLabel] = useState("reservas");
  const [sectionTitle, setSectionTitle] = useState("Suas reservas");

  useEffect(() => {
    carregarMinhasReservas();
    
    const checkRole = async () => {
      const perfil = await storage.getItemAsync('user_perfil');
      if (perfil === 'SINDICO' || perfil === 'PORTEIRO') {
        setHeaderTitle("Reservas do Condomínio");
        setSubtitleLabel("agendamentos");
        setSectionTitle("Reservas gerais");
      }
    };
    checkRole();
  }, [carregarMinhasReservas]);

  const handleCancelReservation = async () => {
    if (!selectedReserva) return;
    try {
      await cancelarReserva(selectedReserva.id);
      setShowConfirm(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const formatarData = (dataIso: string) => {
    if (!dataIso) return "";
    // A data vem como "2026-05-24T08:00:00.000Z"
    // Pegamos apenas a parte da data para evitar deslocamentos de fuso horário
    const partes = dataIso.split('T');
    if (partes.length === 0) return "";
    const dataPartes = partes[0].split('-');
    if (dataPartes.length < 3) return "";
    return `${dataPartes[2]}/${dataPartes[1]}/${dataPartes[0]}`;
  };

  const formatarHorario = (dataIso: string) => {
    if (!dataIso) return "";
    // Usar split e manipulação manual para evitar que o fuso horário altere a hora exibida
    // A data vem como "2026-05-24T08:00:00.000Z"
    const partes = dataIso.split('T');
    if (partes.length < 2) return "";
    
    const horaCompleta = partes[1].split(':');
    const inicio = `${horaCompleta[0]}:${horaCompleta[1]}`;
    
    // Calcula o fim (adicionando 1 hora)
    const horaFim = (parseInt(horaCompleta[0]) + 1).toString().padStart(2, '0');
    const fim = `${horaFim}:${horaCompleta[1]}`;
    
    return `${inicio} às ${fim}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
          <Text style={styles.headerSubtitle}>{minhasReservas.length} {subtitleLabel}</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}><Feather name="more-horizontal" size={28} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>

        {loading && minhasReservas.length === 0 ? (
          <ActivityIndicator size="large" color="#B07850" style={{ marginTop: 20 }} />
        ) : (
          minhasReservas.map((reserva) => (
            <ReservationCard 
              key={reserva.id}
              title={reserva.espaco?.nome || "Espaço"} 
              date={formatarData(reserva.data_reserva)} 
              time={formatarHorario(reserva.data_reserva)} 
              color={reserva.espaco?.cor || "#9ED99C"} 
              icon={reserva.espaco?.icone || "calendar"}
              onPress={() => {
                setSelectedReserva(reserva);
                setShowConfirm(true);
              }}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

{/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deseja cancelar esta reserva?</Text>

            {selectedReserva && (
              <>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Área</Text>
                  <Text style={styles.confirmValue}>{selectedReserva.espaco?.nome}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Data</Text>
                  <Text style={styles.confirmValue}>{formatarData(selectedReserva.data_reserva)}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Text style={styles.confirmLabel}>Horário</Text>
                  <Text style={styles.confirmValue}>{formatarHorario(selectedReserva.data_reserva)}</Text>
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.btnModalCancel} onPress={() => setShowConfirm(false)}>
                <Text style={{color: '#333'}}>voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalConfirm} onPress={handleCancelReservation}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>confirmar cancelamento</Text>
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
              <Text style={styles.successTitle}>Cancelado com sucesso</Text>
              <Ionicons name="checkmark-circle-outline" size={100} color="#00FF00" />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const ReservationCard = ({ title, date, time, color, icon, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color="black" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardDateInfo}>
      <Text style={styles.dateText}>{date}</Text>
      <Text style={styles.dateText}>{time}</Text>
    </View>
  </TouchableOpacity>
);