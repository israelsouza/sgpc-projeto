import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { styles } from "@/screens/Convidar/convidar.styles";
import { useConvite } from "@/hooks/useConvite";

export default function InviteScreen() {
  const { loading, convite, gerarECompartilhar } = useConvite();

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
          <Text style={styles.infoText}>
            {convite
              ? "Convite gerado com sucesso!"
              : "Gere um link temporário para seu convidado"}
          </Text>
          <Text style={styles.timerText}>
            {convite ? "Válido por 24 horas" : "Pronto para enviar"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btnInvite, loading && { opacity: 0.7 }]}
          activeOpacity={0.8}
          onPress={gerarECompartilhar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnInviteText}>
              {convite ? "Compartilhar novamente" : "Gerar e enviar link"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

    </View>
  );
}
