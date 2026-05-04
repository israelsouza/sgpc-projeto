import React, { useState } from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Agendamentos/agendamentos.styles";

export default function SchedulingTime() {
    const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    // Fecha o sucesso automaticamente após 2 segundos
    setTimeout(() => setShowSuccess(false), 2000);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><MaterialIcons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Agendamento</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}><Feather name="more-horizontal" size={28} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { marginBottom: 25 }]}>
          <View style={[styles.iconBox, { backgroundColor: '#9ED99C' }]}>
            <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
          </View>
          <Text style={styles.cardTitle}>Academia</Text>
        </View>

        <View style={[styles.card, { flexDirection: 'column', alignItems: 'flex-start' }]}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={[styles.datePickerContainer, { width: '100%' }]}>
            <Text style={styles.datePickerText}>18/03/2026</Text>
            <MaterialCommunityIcons name="calendar-month" size={22} color="white" />
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Horários</Text>
          <TimeSlot time="7h - 8h" status="available" />
          <TimeSlot time="8h - 9h" status="busy" />
          <TimeSlot time="9h - 10h" status="available" />
          <TimeSlot time="10h - 11h" status="available" />
          <TimeSlot time="11h - 12h" status="available" />
          <TimeSlot time="12h - 13h" status="busy" />

          <TouchableOpacity style={styles.btnOutline}>
            <Text style={styles.btnOutlineText}>agendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

<ScrollView contentContainerStyle={styles.scrollContent}>
         {/* Botão Agendar que dispara o Modal */}
         <TouchableOpacity 
           style={styles.btnOutline} 
           onPress={() => setShowConfirm(true)}
         >
            <Text style={styles.btnOutlineText}>agendar</Text>
         </TouchableOpacity>
      </ScrollView>

      {/* --- MODAL DE CONFIRMAÇÃO --- */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confira as informações</Text>
            
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Área</Text>
              <Text style={styles.confirmValue}>Academia</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Data</Text>
              <Text style={styles.confirmValue}>13/03/2026</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Horário de início</Text>
              <Text style={styles.confirmValue}>11:00</Text>
            </View>
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Horário de término</Text>
              <Text style={styles.confirmValue}>12:00</Text>
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

      {/* Footer Fixo */}
      <View style={footerStyles.footer}>
        <TouchableOpacity style={footerStyles.footerItem}><Feather name="home" size={26} color="#999" /></TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}><MaterialIcons name="history" size={28} color="#999" /></TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}><MaterialIcons name="megaphone-outline" size={26} color="#999" /></TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}><Feather name="user" size={26} color="#999" /></TouchableOpacity>
      </View>
    </View>
  );
}

const TimeSlot = ({ time, status }: any) => (
  <TouchableOpacity style={styles.timeSlot}>
    <Ionicons 
      name={status === 'available' ? "checkmark-circle-outline" : "close-circle-outline"} 
      size={24} 
      color={status === 'available' ? "#00FF00" : "#FF0000"} 
    />
    <Text style={styles.timeSlotText}>{time}</Text>
  </TouchableOpacity>
);