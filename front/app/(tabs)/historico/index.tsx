// app/(tabs)/historico/index.tsx
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Feather, MaterialCommunityIcons, AntDesign, Entypo } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles as staticStyles, createStyles } from "@/screens/Historico/historico.styles";
import { Header } from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useMemo, useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";
import { useHistorico } from "@/hooks/useHistorico";
import { storage } from "@/utils/storage";

function renderIcon(name: string, library: string, color: string) {
  const IconComponent = {
    Feather,
    MaterialCommunityIcons,
    AntDesign,
  }[library as any] as ComponentType<{ name: string; size: number; color: string }> || Feather;
  
  return <IconComponent name={name as any} size={22} color={color} />;
}

export default function HistoricoScreen() {
  const { colors: themeColors, isHighContrast } = useTheme();
  const [userRole, setUserRole] = useState("");
  const { itens, loading, refresh, page, nextPage, prevPage, hasNextPage, hasPrevPage } = useHistorico(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const styles = useMemo(
    () => (isHighContrast ? createStyles(themeColors) : staticStyles),
    [isHighContrast, themeColors]
  );

  useEffect(() => {
    const loadRole = async () => {
      const role = await storage.getItemAsync("user_perfil");
      setUserRole(role || "");
    };
    loadRole();
  }, []);

  // Sobe para o topo ao mudar de página
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [page]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  };

  const historyIcon = (
    <Entypo name="back-in-time" size={26} color={colors.textLight} />
  );

  const title = (userRole === "SINDICO" || userRole === "PORTEIRO") ? "Atividades do Condomínio" : "Minhas Ações";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      <Header
        title={title}
        subtitle={loading ? "Carregando..." : `${itens.length} ações nesta página`}
        icon={historyIcon}
      />

      <View style={styles.contentWrapper}>
        <ScrollView 
            ref={scrollRef}
            style={styles.content} 
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
        >
          {loading && itens.length === 0 ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
          ) : itens.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 60, opacity: 0.5 }}>
                <Feather name="clock" size={48} color={colors.textMuted} />
                <Text style={{ marginTop: 10, color: colors.textMuted }}>Nenhuma atividade registrada.</Text>
            </View>
          ) : (
            <>
                {itens.map((item) => {
                    const dataObj = new Date(item.data);
                    const dateStr = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
                    const timeStr = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                    return (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.itemCard}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconWrapper}>
                        <View style={[styles.iconBox, { backgroundColor: item.icon_bg }]}>
                            {renderIcon(item.icon_name, item.icon_library, item.icon_color)}
                        </View>
                        </View>

                        <View style={styles.itemContent}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                            {item.titulo}
                        </Text>
                        <Text style={styles.itemSubtitle} numberOfLines={2}>
                            {item.subtitulo}
                        </Text>
                        </View>

                        <View style={styles.itemMeta}>
                        <Text style={styles.itemDate}>{dateStr}</Text>
                        <Text style={styles.itemTime}>{timeStr}</Text>
                        </View>
                    </TouchableOpacity>
                    );
                })}

                {/* CONTROLES DE PAGINAÇÃO */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 20, gap: 20 }}>
                    <TouchableOpacity 
                        onPress={prevPage} 
                        disabled={!hasPrevPage || loading}
                        style={{ opacity: hasPrevPage ? 1 : 0.3, padding: 10, backgroundColor: colors.primary, borderRadius: 10 }}
                    >
                        <Feather name="chevron-left" size={24} color="#fff" />
                    </TouchableOpacity>

                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.textPrimary }}>
                        Página {page + 1}
                    </Text>

                    <TouchableOpacity 
                        onPress={nextPage} 
                        disabled={!hasNextPage || loading}
                        style={{ opacity: hasNextPage ? 1 : 0.3, padding: 10, backgroundColor: colors.primary, borderRadius: 10 }}
                    >
                        <Feather name="chevron-right" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </>
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      </View>
    </View>
  );
}
