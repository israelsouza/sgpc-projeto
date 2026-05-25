import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "@/screens/Agendamentos/agendamentos";
import { useAgendamento } from "@/hooks/useAgendamento";

export default function SchedulingSpaces() {
  const router = useRouter();
  const { espacos, loading, carregarEspacos } = useAgendamento();

  useEffect(() => {
    carregarEspacos();
  }, [carregarEspacos]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Agendamento</Text>
          <Text style={styles.headerSubtitle}>{espacos.length} espaços disponíveis</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
          <Feather name="more-horizontal" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Espaços</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#B07850" style={{ marginTop: 20 }} />
        ) : (
          espacos.map((espaco) => (
            <SpaceCard 
              key={espaco.id}
              title={espaco.nome} 
              icon={espaco.icone as any} 
              color={espaco.cor} 
              onPress={() => router.push({
                pathname: "/agendamentos/selecao_horarios",
                params: { id: espaco.id, nome: espaco.nome, icone: espaco.icone, cor: espaco.cor }
              })}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
      <TouchableOpacity 
        style={styles.btnFloating}
        onPress={() => router.push("/agendamentos/minhas_reservas")}
      >
        <Text style={styles.btnFloatingText}>minhas reservas</Text>
      </TouchableOpacity>
    </View>
  );
}

const SpaceCard = ({ title, icon, color, onPress }: any) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color="black" />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);