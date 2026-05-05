import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { BottomNav } from "@/components/BottomNav";
import { colors } from "@/theme/colors";
import { styles } from "../../src/screens/Entregas/Entregas.styles";

// ── Tipos ─────────────────────────────────────────────────
type StatusEntrega = "aguardando" | "retirada";

interface Entrega {
  id: string;
  tipo: "carta" | "pacote";
  prazo: string;
  status: StatusEntrega;
  mensagem?: string;
}

// ── Mock de dados ─────────────────────────────────────────
const mockEntregas: Entrega[] = [
  {
    id: "1",
    tipo: "pacote",
    prazo: "18/03/2026 às 18:00",
    status: "aguardando",
    mensagem: "Por favor aguardar minha chegada até 19h",
  },
  {
    id: "2",
    tipo: "carta",
    prazo: "15/03/2026 às 14:00",
    status: "retirada",
  },
];

// ── Helpers ───────────────────────────────────────────────
const statusConfig = {
  aguardando: { label: "Aguardando", color: "#B8A44A", bg: "#F5F0D6" },
  retirada: { label: "Retirada", color: "#4CAF73", bg: "#D6F5E3" },
};

const tipoConfig = {
  carta: { icon: "mail" as const, label: "Carta" },
  pacote: { icon: "box" as const, label: "Pacote" },
};

// ── Componente principal ──────────────────────────────────
export default function EntregasScreen() {
  const router = useRouter();

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
          <Text style={styles.headerSubtitle}>Cartas e pacotes</Text>
        </View>
      </View>

      {/* ── Lista ── */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockEntregas.length === 0 ? (
          <View style={[styles.card, { alignItems: "center", paddingVertical: 32 }]}>
            <Feather name="inbox" size={40} color="#C5B5AA" />
            <Text style={[styles.fieldLabel, { marginTop: 12, textAlign: "center" }]}>
              Nenhuma entrega registrada
            </Text>
          </View>
        ) : (
          mockEntregas.map((entrega) => {
            const tipo = tipoConfig[entrega.tipo];
            const status = statusConfig[entrega.status];
            return (
              <View key={entrega.id} style={styles.card}>
                {/* Topo: ícone + tipo + status */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "#3D2B1F",
                      }}
                    >
                      {tipo.label}
                    </Text>
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

                {/* Prazo */}
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
                    Prazo: {entrega.prazo}
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
                    }}
                  >
                    "{entrega.mensagem}"
                  </Text>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── FAB: Nova entrega ── */}
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
        onPress={() => router.push("/Entregas/NovaEntrega")}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* ── Bottom Nav ── */}
      <BottomNav activeIndex={-1} />
    </SafeAreaView>
  );
}