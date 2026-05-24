// app/(tabs)/avisos/index.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, RefreshControl } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Header } from "@/components/Header";
import { styles as staticStyles, createStyles } from "@/screens/Avisos/avisos.styles";
import { colors } from "@/theme/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { storage } from "@/utils/storage";
import { useAviso } from "@/hooks/useAviso";
import { Aviso } from "@/services/avisoService";

// ── Card extraído como componente interno ──────────────────────────────────
function AvisoCard({
  aviso,
  styles,
  iconColor,
}: {
  aviso: Aviso;
  styles: ReturnType<typeof createStyles>;
  iconColor: string;
}) {
  // Formatação básica de data e hora
  const dataObj = new Date(aviso.criado_em);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.card}
      accessibilityLabel={aviso.titulo}
      accessibilityRole="button"
    >
      {/* Ícone */}
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

        <Text style={styles.cardPreview} numberOfLines={1}>
          {aviso.descricao}
        </Text>

        {aviso.anexo_url ? (
          <View style={styles.attachmentRow}>
            <Feather name="paperclip" size={12} color={styles.attachmentText.color as string} />
            <Text style={styles.attachmentText}>Possui anexo</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

// ── Tela ───────────────────────────────────────────────────────────────────
export default function AvisosScreen() {
  const { colors: themeColors, isHighContrast } = useTheme();

  // Normal: styles original / HC: styles dinâmico
  const styles = useMemo(
    () => (isHighContrast ? createStyles(themeColors) : staticStyles),
    [isHighContrast, themeColors]
  );

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
        const condo = await storage.getItemAsync("user_condominio");
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
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

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
          {avisos.map((aviso) => {
            // Cor do ícone: HC usa amarelo / normal mantém lógica original
            const iconColor = isHighContrast
              ? themeColors.iconColorOverride
              : aviso.is_recente
              ? colors.earthAccent
              : colors.textMuted;

            return (
              <AvisoCard
                key={aviso.id}
                aviso={aviso}
                styles={styles}
                iconColor={iconColor}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
