import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { styles } from "@/screens/Avisos/avisos.styles";
import { colors } from "@/theme/colors";

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

function AvisoCard({ aviso }: { aviso: Aviso }) {
  const iconColor = aviso.novo ? colors.earthAccent : colors.textMuted;

  return (
    <TouchableOpacity activeOpacity={0.75} style={styles.card}>
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
        {/* Título + badge + data na mesma linha */}
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

        {/* Preview */}
        <Text style={styles.cardPreview} numberOfLines={1}>
          {aviso.preview}
        </Text>

        {/* Anexo */}
        {aviso.anexos && aviso.anexos > 0 ? (
          <View style={styles.attachmentRow}>
            <Feather name="paperclip" size={12} color={colors.textMuted} />
            <Text style={styles.attachmentText}>
              {aviso.anexos} {aviso.anexos === 1 ? "anexo" : "anexos"}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

export default function AvisosScreen() {
  return (
    <View style={styles.container}>
      <Header title="Itaim Bibi" subtitle="Unidade 056" initials="IB" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
        <Text style={styles.sectionTitle}>Mural de Avisos</Text>

        {avisos.map((aviso) => (
          <AvisoCard key={aviso.id} aviso={aviso} />
        ))}
      </ScrollView>

      <BottomNav activeIndex={2} />
    </View>
  );
}