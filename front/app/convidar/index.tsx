import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Platform, Clipboard } from "react-native";

import { styles } from "@/screens/Convidar/convidar.styles";
import { useConvite } from "@/hooks/useConvite";

export default function InviteScreen() {
  const { loading, convite, gerarECompartilhar } = useConvite();

  const handleCopyLink = () => {
    if (convite?.url) {
      Clipboard.setString(convite.url);
      alert("Link copiado para a área de transferência!");
    }
  };

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
              : "Selecione o tipo de acesso que deseja liberar"}
          </Text>
          <Text style={styles.timerText}>
            {convite ? `Tipo: ${convite.tipo === 'VISITANTE' ? 'Visitante' : 'Prestador'}` : "O link expira em 24 horas"}
          </Text>
        </View>

        {!convite ? (
          <View style={{ gap: 15, marginTop: 20 }}>
            <TouchableOpacity
              style={[styles.btnInvite, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={() => gerarECompartilhar('VISITANTE')}
              disabled={loading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="user" size={20} color="white" />
                <Text style={styles.btnInviteText}>Convidar Visitante</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnInvite, { backgroundColor: '#7C5841' }, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={() => gerarECompartilhar('PRESTADOR_SERVICO')}
              disabled={loading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialCommunityIcons name="truck-delivery-outline" size={20} color="white" />
                <Text style={styles.btnInviteText}>Convidar Prestador</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[styles.btnInvite, loading && { opacity: 0.7 }]}
              activeOpacity={0.8}
              onPress={() => gerarECompartilhar(convite.tipo as any)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnInviteText}>
                  {Platform.OS === 'web' ? "Compartilhar novamente" : "Compartilhar via WhatsApp"}
                </Text>
              )}
            </TouchableOpacity>

            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={[styles.btnInvite, { backgroundColor: '#5B9BC4' }]}
                activeOpacity={0.8}
                onPress={handleCopyLink}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Feather name="copy" size={20} color="white" />
                  <Text style={styles.btnInviteText}>Copiar Link</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {loading && !convite && (
           <ActivityIndicator size="large" color="#A07050" style={{ marginTop: 20 }} />
        )}
      </View>

    </View>
  );
}
