import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { styles } from "@/screens/Convidar/convidar.styles";
import BottomNav  from "@/components/BottomNav";

export default function InviteScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#A07050" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Convidar alguém</Text>

        <TouchableOpacity style={styles.headerDots}>
          <Feather name="more-horizontal" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <View style={styles.content}>
        <View style={styles.whiteCard}>
          <Text style={styles.infoText}>Este link de convite expira em</Text>
          <Text style={styles.timerText}>10m59s</Text>
        </View>

        <TouchableOpacity style={styles.btnInvite} activeOpacity={0.8}>
          <Text style={styles.btnInviteText}>Enviar link ao convidado</Text>
        </TouchableOpacity>
      </View>


    </View>
  );
}
