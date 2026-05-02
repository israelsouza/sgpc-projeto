import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { styles } from "@/screens/Avisos/avisos.styles";
import { colors } from "@/theme/colors";
import * as SecureStore from "expo-secure-store";
import { useAviso } from "@/hooks/useAviso";
import { Aviso } from "@/services/avisoService";

import { useRouter } from "expo-router";

function AvisoCard({ aviso }: { aviso: Aviso }) {
  const router = useRouter();
  const iconColor = aviso.is_recente ? colors.earthAccent : colors.textMuted;

  // Formatação simples de data/hora
  const dataObj = new Date(aviso.criado_em);
  const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.card}
      onPress={() => router.push(`/avisos/${aviso.id}`)}
    >
      <View
        style={[
          styles.iconBox,
          aviso.is_recente ? styles.iconBoxActive : styles.iconBoxInactive,
        ]}
      >
        <Entypo name="megaphone" size={22} color={iconColor} />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {aviso.titulo}
            </Text>
            {aviso.is_recente && (
              <View style={styles.badgeNovo}>
                <Text style={styles.badgeNovoText}>novo</Text>
              </View>
            )}
          </View>

          <View style={styles.dateBlock}>
            <Text style={styles.dateText}>{dataFormatada}</Text>
            <Text style={styles.dateText}>{horaFormatada}</Text>
          </View>
        </View>

        <Text style={styles.cardPreview} numberOfLines={2}>
          {aviso.descricao}
        </Text>

        {aviso.anexo_url ? (
          <View style={styles.attachmentRow}>
            <Feather name="paperclip" size={12} color={colors.textMuted} />
            <Text style={styles.attachmentText}>Possui anexo</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function AvisosScreen() {
  const [userCondo, setUserCondo] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const { 
    avisos, 
    loading, 
    refresh, 
    page, 
    totalPages, 
    hasNextPage, 
    hasPrevPage, 
    nextPage, 
    prevPage 
  } = useAviso();

  // Efeito para subir ao topo quando a página mudar
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [page]);

  useEffect(() => {
    async function loadUserData() {
      try {
        const condo = await SecureStore.getItemAsync("user_condominio");
        if (condo) setUserCondo(condo);
      } catch (error) {
        console.error("Erro ao carregar condomínio do usuário:", error);
      }
    }
    loadUserData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const megaphoneIcon = (
    <Entypo name="megaphone" size={24} color={colors.textLight} />
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primaryDark}
      />

      <Header
        title="Mural de avisos"
        subtitle={userCondo || "Condomínio"}
        icon={megaphoneIcon}
      />

      <View style={styles.contentWrapper}>
        <ScrollView
          ref={scrollRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
        >
          {avisos.length === 0 && loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          ) : avisos.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={{ color: colors.textMuted }}>
                Nenhum aviso encontrado.
              </Text>
            </View>
          ) : (
            <>
              {avisos.map((aviso) => <AvisoCard key={aviso.id} aviso={aviso} />)}

              {/* Controles de Paginação */}
              {totalPages > 1 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[styles.pageButton, !hasPrevPage && styles.pageButtonDisabled]}
                    onPress={prevPage}
                    disabled={!hasPrevPage || loading}
                  >
                    <Feather name="chevron-left" size={16} color={colors.textLight} />
                    <Text style={styles.pageText}>Anterior</Text>
                  </TouchableOpacity>

                  <Text style={styles.pageInfo}>
                    Página {page + 1} de {totalPages}
                  </Text>

                  <TouchableOpacity
                    style={[styles.pageButton, !hasNextPage && styles.pageButtonDisabled]}
                    onPress={nextPage}
                    disabled={!hasNextPage || loading}
                  >
                    <Text style={styles.pageText}>Próxima</Text>
                    <Feather name="chevron-right" size={16} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
