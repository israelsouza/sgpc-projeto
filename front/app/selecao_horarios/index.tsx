import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Modal, Platform } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { stylesWeb } from "@/screens/Agendamentos/selecao.styles";
import { styles } from "@/screens/Modal_agendamento/modal_agendamento.styles";

export default function SchedulingTimeWeb() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const timeSlots = [
    { id: '1', time: "7h - 8h", status: "available" },
    { id: '2', time: "8h - 9h", status: "busy" },
    { id: '3', time: "9h - 10h", status: "available" },
    { id: '4', time: "10h - 11h", status: "available" },
    { id: '5', time: "11h - 12h", status: "available" },
    { id: '6', time: "12h - 13h", status: "busy" },
  ];

const handleConfirm = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    // Fecha o sucesso automaticamente após 2 segundos
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <SafeAreaView style={stylesWeb.container}>
      {/* HEADER WEB */}
      <View style={stylesWeb.header}>
        <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 10 }}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={stylesWeb.headerTitle}>Agendamento</Text>
        <TouchableOpacity><Feather name="more-horizontal" size={28} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={stylesWeb.mainContent}>
          
          {/* CARD DO ESPAÇO (Academia) */}
          <View style={stylesWeb.spaceCardWeb}>
            <View style={{ backgroundColor: '#9ED99C', padding: 10, borderRadius: 8, marginRight: 15 }}>
              <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1A202C' }}>Academia</Text>
          </View>

          {/* CONTAINER DE AGENDAMENTO COMPLETO */}
          <View style={stylesWeb.formContainer}>
            <Text style={stylesWeb.label}>Data</Text>
            <TouchableOpacity style={stylesWeb.datePickerWeb}>
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>18/03/2026</Text>
              <MaterialCommunityIcons name="calendar-month" size={24} color="white" />
            </TouchableOpacity>

            <Text style={stylesWeb.label}>Horários</Text>
            
            {/* LISTA DE HORÁRIOS (Fiel à image_8a12cc.png) */}
            <View style={{ width: '100%', gap: 10 }}>
              {timeSlots.map((slot) => (
                <TouchableOpacity 
                  key={slot.id}
                  disabled={slot.status === 'busy'}
                  onPress={() => setSelectedSlot(slot.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: selectedSlot === slot.id ? '#8B5E3C' : '#E2E8F0',
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
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* BOTÃO AGENDAR CENTRALIZADO */}
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <TouchableOpacity 
                style={[
                    stylesWeb.btnAgendarWeb, 
                    { opacity: selectedSlot ? 1 : 0.5 }
                ]}
                disabled={!selectedSlot}
                onPress={() => setShowConfirm(true)}
              >
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>agendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* MODAL DE CONFIRMAÇÃO E SUCESSO (Igual ao código anterior) */}
      {/* ... (Omitido para brevidade, mas deve ser mantido) */}

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

    </SafeAreaView>
  );
}