import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { colors, palette } from "@/theme/colors";
import avisoService, { Aviso } from "@/services/avisoService";

export default function AvisoDetalhes() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await avisoService.obterDetalhes(Number(id));
        setAviso(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os detalhes do aviso.");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  const handleVerAnexo = async () => {
    try {
      setDownloading(true);
      const url = await avisoService.obterUrlAnexo(Number(id));
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o anexo.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={palette.accent} />
        <ActivityIndicator size="large" color={colors.textLight} />
      </View>
    );
  }

  if (!aviso) return null;

  const dataObj = new Date(aviso.criado_em);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.accent} />
      
      <Header 
        title="Detalhes do Aviso" 
        subtitle={aviso.categoria}
        showBackButton
      />

      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{aviso.categoria}</Text>
              </View>
              <Text style={styles.dateText}>{dataFormatada} às {horaFormatada}</Text>
            </View>

            <Text style={styles.title}>{aviso.titulo}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.descricao}>{aviso.descricao}</Text>

            {aviso.anexo_url && (
              <TouchableOpacity 
                style={styles.anexoButton} 
                onPress={handleVerAnexo}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <>
                    <Feather name="file-text" size={20} color="#FFF" />
                    <Text style={styles.anexoButtonText}>Visualizar Anexo (PDF)</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.accent, // Mesmo azul escuro da Home
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.sheetBg, // Fundo cinza claro arredondado
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 0,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 15,
  },
  descricao: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  anexoButton: {
    backgroundColor: colors.earthAccent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  anexoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
