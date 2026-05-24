import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { colors, palette } from "@/theme/colors";
import { useFonts } from "expo-font";
import { moradorService } from "@/services/moradorService";
import { conviteService } from "@/services/conviteService";

interface CadastradoItem {
  id: string;
  nome: string;
  tipo: string;
  icone: keyof typeof Ionicons.glyphMap;
}

export default function CadastradosScreen() {
  const [loading, setLoading] = useState(true);
  const [cadastrados, setCadastrados] = useState<CadastradoItem[]>([]);

  const [loaded, error] = useFonts({
    "InterRegular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
    "InterBold":    require("../../assets/fonts/Inter_18pt-Bold.ttf"),
    "InterMedium":  require("../../assets/fonts/Inter_18pt-Medium.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [moradoresRes, visitantesRes] = await Promise.all([
          moradorService.listarMoradoresUnidade(),
          conviteService.listarVisitantes()
        ]);

        const moradoresMapped = (moradoresRes?.data || []).map((m: any) => ({
          id: `m-${m.id}`,
          nome: m.nome_completo,
          tipo: "Morador",
          icone: "person-outline" as const,
        }));

        const visitantesMapped = (visitantesRes?.data || []).map((v: any) => ({
          id: `v-${v.id}`,
          nome: v.nome_completo,
          tipo: v.tipo === "PRESTADOR_SERVICO" ? "Prestador" : "Visitante",
          icone: v.tipo === "PRESTADOR_SERVICO" ? "build-outline" : "walk-outline" as const,
        }));

        setCadastrados([...moradoresMapped, ...visitantesMapped]);
      } catch (err: any) {
        console.error("Erro ao buscar cadastrados:", err);
      } finally {
        setLoading(false);
      }
    }

    if (loaded) {
      fetchData();
    }
  }, [loaded]);

  if (!loaded && !error) return null;

  const renderItem = ({ item }: { item: CadastradoItem }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icone} size={24} color={palette.darkBrown} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.tipo}>{item.tipo}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Cadastrados" 
        showBackButton={true} 
        rightElement={
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={24} color="#FFF" />
          </TouchableOpacity>
        }
      />
      
      <View style={styles.contentWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.darkBrown} />
          </View>
        ) : (
          <FlatList
            data={cadastrados}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum cadastrado encontrado.</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.accent,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingTop: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: "#E6D6CC", // A light warm brown/beige
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nome: {
    fontFamily: "InterBold",
    fontSize: 16,
    color: colors.textDark,
  },
  tipo: {
    fontFamily: "InterRegular",
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textMuted,
    fontFamily: "InterRegular",
  },
});
