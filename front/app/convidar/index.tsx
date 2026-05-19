import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import HeaderPage from "@/components/HeaderPage";
import { styles } from "@/screens/Convidar/convidar.styles";

export default function InviteScreen() {
  return (
    <View style={styles.container}>
      <HeaderPage
        title="Convidar alguém"
        subtitle="Link expira em breve"
        iconLeft={<Feather name="arrow-left" size={20} color="white" />}
        onPressLeft={() => router.back()}
        iconRight={<Feather name="more-horizontal" size={20} color="white" />}
      />

      {/* ── Conteúdo principal ── */}
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