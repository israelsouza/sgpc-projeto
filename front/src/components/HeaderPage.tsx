import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "@/theme/colors";
import { styles } from "@/components/HeaderPage.styles";

interface HeaderPageProps {
  /** Título principal exibido no centro */
  title: string;
  /** Subtítulo opcional abaixo do título */
  subtitle?: string;
  /** Ícone do botão esquerdo (geralmente seta de voltar) */
  iconLeft: React.ReactNode;
  /** Ação ao pressionar o botão esquerdo */
  onPressLeft?: () => void;
  /** Ícone do botão direito (opcional — ex: "···" ou "+" ) */
  iconRight?: React.ReactNode;
  /** Ação ao pressionar o botão direito */
  onPressRight?: () => void;
}

/**
 * Header padrão para todas as telas internas (não-Home).
 *
 * - Fundo: palette.brown (#7C5841) — mesma cor da Home
 * - Topo reto (sem border radius)
 * - Título centralizado entre dois botões de largura fixa
 * - Quando não há botão direito, um placeholder invisível mantém o título centralizado
 *
 * Uso:
 * ```tsx
 * <HeaderPage
 *   title="Entregas"
 *   subtitle="Cartas e pacotes"
 *   iconLeft={<Feather name="arrow-left" size={20} color="white" />}
 *   onPressLeft={() => router.back()}
 *   iconRight={<Feather name="more-horizontal" size={20} color="white" />}
 *   onPressRight={() => openMenu()}
 * />
 * ```
 */
export default function HeaderPage({
  title,
  subtitle,
  iconLeft,
  onPressLeft,
  iconRight,
  onPressRight,
}: HeaderPageProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={palette.accent} />

      <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) + 10 }]}>
        {/* ── Botão esquerdo ── */}
        <TouchableOpacity
          style={styles.sideButton}
          onPress={onPressLeft}
          disabled={!onPressLeft}
          activeOpacity={0.7}
        >
          {iconLeft}
        </TouchableOpacity>

        {/* ── Título central ── */}
        <View style={styles.centerContent}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* ── Botão direito (ou placeholder para centralizar título) ── */}
        {iconRight ? (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={onPressRight}
            disabled={!onPressRight}
            activeOpacity={0.7}
          >
            {iconRight}
          </TouchableOpacity>
        ) : (
          <View style={styles.rightPlaceholder} />
        )}
      </View>
    </>
  );
}