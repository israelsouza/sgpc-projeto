import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Register/Register.styles";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Criar conta</Text>
          <Text style={styles.headerSubtitle}>Preencha os dados abaixo</Text>
        </View>
      </View>

      {/* ── Barra de progresso ── */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelLeft}>Passos 1 de 2</Text>
          <Text style={styles.progressLabelRight}>Dados pessoais</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>

      {/* ── Card ── */}
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Seção Acesso */}
        <Text style={styles.sectionLabel}>Acesso</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        {/* Seção Identificação */}
        <Text style={styles.sectionLabelSpaced}>Identificação</Text>

        <View style={styles.identBox}>
          <TextInput
            style={[styles.inputFull, { marginBottom: 10 }]}
            placeholder="RG"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.inputFull}
            placeholder="CPF"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.inputFull, { marginTop: 10 }]}
            placeholder="Data de nascimento"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
          />
        </View>

        {/* Botão */}
        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Continuar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
