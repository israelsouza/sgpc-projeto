// app/(tabs)/avisos/index.tsx
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { styles as staticStyles, createStyles } from "@/screens/Avisos/avisos.styles";
import { colors } from "@/theme/colors";
import { useTheme } from "@/contexts/ThemeContext";
import * as SecureStore from "expo-secure-store";

interface Aviso {
  id: string;
  titulo: string;
  preview: string;
  data: string;
  hora: string;
  novo: boolean;
  anexos?: number;
}

const avisos: Aviso[] = [
  {
    id: "1",
    titulo: "Aviso de manutenção preventiva",
    preview: "Conforme combinado na ...",
    data: "15/03/25",
    hora: "14:50",
    novo: true,
    anexos: 1,
  },
  {
    id: "2",
    titulo: "Ata da assembleia 205",
    preview: "Os assuntos e decisões que...",
    data: "15/03/25",
    hora: "14:50",
    novo: true,
    anexos: 1,
  },
  {
    id: "3",
    titulo: "Lorem Ipsum is simply dummy",
    preview: "Lorem ipsum is simply dummy text...",
    data: "15/03/25",
    hora: "14:50",
    novo: false,
  },
  {
    id: "4",
    titulo: "Lorem Ipsum is simply dummy",
    preview: "Lorem ipsum is simply dummy text...",
    data: "15/03/25",
    hora: "14:50",
    novo: false,
  },
  {
    id: "5",
    titulo: "Lorem Ipsum is simply dummy",
    preview: "Lorem ipsum is simply dummy text...",
    data: "15/03/25",
    hora: "14:50",
    novo: false,
  },
];

// ── Card extraído como componente interno ──────────────────────────────────
// Recebe o styles e as cores já resolvidos pela tela pai
function AvisoCard({
  aviso,
  styles,
  iconColor,
}: {
  aviso: Aviso;
  styles: ReturnType<typeof createStyles>;
  iconColor: string;
}) {
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
          aviso.novo ? styles.iconBoxActive : styles.iconBoxInactive,
        ]}
      >
        <Entypo name="megaphone" size={22} color={iconColor} />
      </View>

      {/* Corpo */}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {aviso.titulo}
            </Text>
            {aviso.novo && (
              <View style={styles.badgeNovo}>
                <Text style={styles.badgeNovoText}>novo</Text>
              </View>
            )}
          </View>

          <View style={styles.dateBlock}>
            <Text style={styles.dateText}>{aviso.data}</Text>
            <Text style={styles.dateText}>{aviso.hora}</Text>
          </View>
        </View>

        <Text style={styles.cardPreview} numberOfLines={1}>
          {aviso.preview}
        </Text>

        {aviso.anexos && aviso.anexos > 0 ? (
          <View style={styles.attachmentRow}>
            <Feather name="paperclip" size={12} color={styles.attachmentText.color as string} />
            <Text style={styles.attachmentText}>
              {aviso.anexos} {aviso.anexos === 1 ? "anexo" : "anexos"}
            </Text>
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

  useEffect(() => {
    async function loadUserData() {
      try {
        const condo = await SecureStore.getItemAsync("userCondo");
        if (condo) setUserCondo(condo);
      } catch (error) {
        console.error("Erro ao carregar condomínio do usuário:", error);
      }
    }
    loadUserData();
  }, []);

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
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {avisos.map((aviso) => {
            // Cor do ícone: HC usa amarelo / normal mantém lógica original
            const iconColor = isHighContrast
              ? themeColors.iconColorOverride
              : aviso.novo
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