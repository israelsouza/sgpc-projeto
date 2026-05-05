import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Agendamentos/agendamentos.styles";
import { footerStyles } from "@/screens/Agendamentos/Footer_provisorio";

export default function MyReservations() {
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
          <Text style={styles.headerTitle}>Minhas Reservas</Text>
          <Text style={styles.headerSubtitle}>2 reservas</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}><Feather name="more-horizontal" size={28} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Abril 2026</Text>
        
        <ReservationCard title="Academia" date="18/03/25" time="11:00 às 12:00" color="#9ED99C" icon="box" />
        <ReservationCard title="Espaço Gourmet" date="17/03/25" time="12:00 às 14:00" color="#9ED99C" icon="food-steak" />

        <View style={{ height: 40 }} />
        <TouchableOpacity style={styles.btnFloating}>
          <Text style={styles.btnFloatingText}>cancelar reserva</Text>
        </TouchableOpacity>
      </ScrollView>

<ScrollView contentContainerStyle={styles.scrollContent}>
         {/* Botão cancelar reserva que dispara o Modal */}
         <TouchableOpacity 
           style={styles.btnOutline} 
           onPress={() => setShowConfirm(true)}
         >
            <Text style={styles.btnOutlineText}>cancelar reserva</Text>
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
              <Text style={styles.successTitle}>Cancelado com sucesso</Text>
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

const ReservationCard = ({ title, date, time, color, icon }: any) => (
  <TouchableOpacity style={styles.card}>
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