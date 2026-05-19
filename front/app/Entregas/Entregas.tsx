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
import { colors, palette } from "@/theme/colors";
import { styles } from "@/screens/Entregas/Entregas.styles";
import HeaderPage from "@/components/HeaderPage";

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
const statusConfig: Record<StatusEntrega, { label: string; color: string; bg: string }> = {
  aguardando: { label: "Aguardando", color: "#B8A44A", bg: "#F5F0D6" },
  retirada:   { label: "Retirada",   color: "#4CAF73", bg: "#D6F5E3" },
};

const tipoConfig = {
  carta:  { icon: "mail"  as const, label: "Carta"  },
  pacote: { icon: "box"   as const, label: "Pacote" },
};

// ── Componente principal ──────────────────────────────────
export default function EntregasScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <HeaderPage
        title="Entregas"
        subtitle="Cartas e pacotes"
        iconLeft={<Feather name="arrow-left" size={20} color="white" />}
        onPressLeft={() => router.back()}
      />

      {/* ── Lista ── */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockEntregas.length === 0 ? (
          <View style={[styles.card, styles.emptyState]}>
            <Feather name="inbox" size={40} color={palette.subtle} />
            <Text style={styles.emptyStateText}>Nenhuma entrega registrada</Text>
          </View>
        ) : (
          mockEntregas.map((entrega) => {
            const tipo   = tipoConfig[entrega.tipo];
            const status = statusConfig[entrega.status];

            return (
              <View key={entrega.id} style={styles.card}>
                {/* Topo: ícone + tipo + badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTypeRow}>
                    <View style={styles.cardIconBox}>
                      <Feather
                        name={tipo.icon}
                        size={18}
                        color={colors.earthBrown}
                      />
                    </View>
                    <Text style={styles.cardTypeLabel}>{tipo.label}</Text>
                  </View>

                  <View style={[styles.badge, { backgroundColor: status.bg }]}>
                    <Text style={[styles.badgeText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                {/* Prazo */}
                <View style={[styles.prazoRow, { marginBottom: entrega.mensagem ? 8 : 0 }]}>
                  <Feather name="clock" size={13} color={palette.lightBrown} />
                  <Text style={styles.prazoText}>Prazo: {entrega.prazo}</Text>
                </View>

                {/* Mensagem (se houver) */}
                {entrega.mensagem && (
                  <Text style={styles.mensagemText}>"{entrega.mensagem}"</Text>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── FAB: Nova entrega ── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/Entregas/NovaEntrega")}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={24} color={colors.textLight} />
      </TouchableOpacity>
    </View>
  );
}