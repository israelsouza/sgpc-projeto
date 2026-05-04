import React from "react";
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Agendamentos/agendamentos.styles";

export default function MyReservations() {
  return (
    <SafeAreaView style={styles.container}>
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

      {/* Footer Fixo */}
      <View style={footerStyles.footer}>
        <TouchableOpacity style={footerStyles.footerItem}><Feather name="home" size={26} color="#999" /></TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}><MaterialIcons name="history" size={28} color="#999" /></TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}><MaterialIcons name="megaphone-outline" size={26} color="#999" /></TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}><Feather name="user" size={26} color="#999" /></TouchableOpacity>
      </View>
    </SafeAreaView>
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