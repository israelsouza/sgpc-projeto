import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Agendamentos/agendamentos.styles";
import { footerStyles } from "@/screens/Agendamentos/Footer_provisorio";
// import { BottomNav } from "@/components/BottomNav";

export default function SchedulingSpaces() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><MaterialIcons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Agendamento</Text>
          <Text style={styles.headerSubtitle}>2 reservas</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}><Feather name="more-horizontal" size={28} color="white" /></TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Espaços</Text>
        
        <SpaceCard title="Academia" icon="dumbbell" color="#9ED99C" />
        <SpaceCard title="Espaço Gourmet" icon="food-steak" color="#A9B2D9" />

        <View style={{ height: 40 }} />
        <TouchableOpacity style={styles.btnFloating}>
          <Text style={styles.btnFloatingText}>minhas reservas</Text>
        </TouchableOpacity>
      </ScrollView>

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

const SpaceCard = ({ title, icon, color }: any) => (
  <TouchableOpacity style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color="black" />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);