import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Clipboard from 'expo-clipboard';

import HeaderPage from "@/components/HeaderPage";
import { styles } from "@/screens/Convidar/convidar.styles";
import { AuthService } from "@/services/authService";

export default function InviteScreen() {
  const [conviteUrl, setConviteUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const gerarConvite = async () => {
      try {
        const { codigo } = await AuthService.criarConvite();
        // ATENÇÃO: Substitua 'https://seusite.com' pela URL real do seu frontend
        const baseUrl = 'https://seusite.com'; 
        setConviteUrl(`${baseUrl}/visitante/cadastro/${codigo}`);
      } catch (error: any) {
        Alert.alert("Erro", error.message || "Não foi possível gerar o link do convite.");
      } finally {
        setLoading(false);
      }
    };

    gerarConvite();
  }, []);

  const copyToClipboard = async () => {
    if (conviteUrl) {
      await Clipboard.setStringAsync(conviteUrl);
      Alert.alert("Sucesso!", "Link copiado para a área de transferência.");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderPage
        title="Convidar alguém"
        subtitle="Este link expira em 24h"
        iconLeft={<Feather name="arrow-left" size={20} color="white" />}
        onPressLeft={() => router.back()}
        iconRight={<Feather name="more-horizontal" size={20} color="white" />}
      />

      <View style={styles.content}>
        <View style={styles.whiteCard}>
          <Text style={styles.infoText}>Compartilhe este link com seu convidado:</Text>
          {loading ? (
            <Text style={styles.timerText}>Gerando link...</Text>
          ) : (
            <Text style={styles.timerText} selectable>{conviteUrl}</Text>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.btnInvite, !conviteUrl && styles.btnDisabled]} 
          activeOpacity={0.8} 
          onPress={copyToClipboard} 
          disabled={!conviteUrl}
        >
          <Text style={styles.btnInviteText}>Copiar Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
