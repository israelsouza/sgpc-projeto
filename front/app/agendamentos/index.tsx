import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Agendamentos/agendamentos";
import { router } from "expo-router";
import HeaderPage from "@/components/HeaderPage";

export default function SchedulingSpaces() {
  return (
    <View style={styles.container}>
      <HeaderPage
        title="Agendamento"
        subtitle="2 reservas"
        iconLeft={<MaterialIcons name="arrow-back" size={26} color="white" />}
        onPressLeft={() => router.back()}
        iconRight={<Feather name="more-horizontal" size={28} color="white" />}
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Espaços</Text>
        
        <SpaceCard title="Academia" icon="dumbbell" color="#9ED99C" />
        <SpaceCard title="Espaço Gourmet" icon="food-steak" color="#A9B2D9" />

        <View style={{ height: 40 }} />
      </ScrollView>
      <TouchableOpacity style={styles.btnFloating}>
        <Text style={styles.btnFloatingText}>minhas reservas</Text>
      </TouchableOpacity>
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