import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { styles } from "../../src/screens/Entregas/Entregas.styles";
import { useEntrega } from "@/hooks/useEntrega";
import { storage } from "@/utils/storage";

// ── Helpers ───────────────────────────────────────────────
const statusConfig = {
  AGUARDANDO: { label: "Aguardando", color: "#B8A44A", bg: "#F5F0D6" },
  RECEBIDA: { label: "Recebida", color: "#4CAF73", bg: "#D6F5E3" },
  RETIRADA: { label: "Retirada", color: "#6C757D", bg: "#E9ECEF" },
  CANCELADA: { label: "Cancelada", color: "#DC3545", bg: "#F8D7DA" },
};

const tipoConfig = {
  CARTA: { icon: "mail" as const, label: "Carta" },
  PACOTE: { icon: "box" as const, label: "Pacote" },
};

function formatarDataHora(isoString: string): string {
  const data = new Date(isoString);
  return `${data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })} às ${data.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

// ── Componente principal ──────────────────────────────────
export default function EntregasScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  
  useEffect(() => {
    async function getProfile() {
      try {
        const profile = await storage.getItemAsync("user_perfil");
        console.log("Perfil carregado em Entregas:", profile);
        setUserProfile(profile);
      } finally {
        setIsProfileLoading(false);
      }
    }
    getProfile();
  }, []);

  // Consideramos qualquer perfil que não seja MORADOR como perfil de gestão/portaria
  const isPorter = userProfile && userProfile !== "MORADOR";
  const vision = isProfileLoading ? undefined : (isPorter ? "condominio" : "morador");
  
  const { entregas, loading, refresh } = useEntrega(vision);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Entregas</Text>
          <Text style={styles.headerSubtitle}>
            {isProfileLoading ? "Carregando..." : (isPorter ? "Gestão do condomínio" : "Cartas e pacotes")}
          </Text>
        </View>
      </View>

      {/* ── Lista ── */}
      {(loading || isProfileLoading) && entregas.length === 0 ? (
        <View style={[styles.content, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color={colors.earthBrown ?? "#8B5E3C"} />
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={[colors.primaryDark ?? "#000"]}
            />
          }
        >
          {entregas.length === 0 ? (
            <View style={[styles.card, { alignItems: "center", paddingVertical: 32 }]}>
              <Feather name="inbox" size={40} color="#C5B5AA" />
              <Text style={[styles.fieldLabel, { marginTop: 12, textAlign: "center" }]}>
                Nenhuma entrega registrada
              </Text>
            </View>
          ) : (
            entregas.map((entrega) => {
              const tipo = tipoConfig[entrega.tipo];
              const status = statusConfig[entrega.status];
              const morador = (entrega as any).morador;

              return (
                <TouchableOpacity
                  key={entrega.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push(`/entregas/ResumoEntrega?id=${entrega.id}`)
                  }
                >
                  {/* Topo: ícone + tipo + status */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          backgroundColor: "#F5F0EB",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Feather
                          name={tipo.icon}
                          size={18}
                          color={colors.earthBrown ?? "#8B5E3C"}
                        />
                      </View>
                      <View>
                        <Text
                          style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: "#3D2B1F",
                          }}
                        >
                          {tipo.label}
                        </Text>
                        {isPorter && morador && (
                          <Text style={{ fontSize: 11, color: "#7A5C45" }}>
                            Unidade {morador.unidade?.unidade || "N/A"}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Badge de status */}
                    <View
                      style={{
                        backgroundColor: status.bg,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: status.color,
                        }}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>

                  {/* Prazo / Data */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: entrega.mensagem ? 8 : 0,
                    }}
                  >
                    <Feather name="clock" size={13} color="#A08070" />
                    <Text style={{ fontSize: 13, color: "#A08070" }}>
                      {entrega.status === "AGUARDANDO" 
                        ? `Prazo: ${formatarDataHora(entrega.prazo_retirada)}`
                        : `Atualizado em: ${formatarDataHora(entrega.atualizado_em)}`}
                    </Text>
                  </View>

                  {/* Mensagem (se houver) */}
                  {entrega.mensagem && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#7A5C45",
                        fontStyle: "italic",
                        backgroundColor: "#F5F0EB",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        marginTop: 4,
                      }}
                    >
                      "{entrega.mensagem}"
                    </Text>
                  )}
                  
                  {isPorter && morador && (
                     <Text style={{ fontSize: 13, color: "#3D2B1F", marginTop: 8, fontWeight: '500' }}>
                        Destinatário: {morador.nome_completo}
                     </Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}

          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {/* ── FAB: Nova entrega (Apenas para Moradores) ── */}
      {!isPorter && !isProfileLoading && (
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 80,
            right: 24,
            backgroundColor: colors.earthBrown ?? "#8B5E3C",
            width: 52,
            height: 52,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
          onPress={() => router.push("/entregas/NovaEntrega")}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
