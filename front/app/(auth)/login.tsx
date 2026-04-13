import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Login/login.styles";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Topo escuro ── */}
      <View style={styles.topSection}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}></Text>
        </View>
        <Text style={styles.appName}>CondoApp-(SGPC)</Text>
        <Text style={styles.appSubtitle}>
          Gestão do seu condomínio na palma da mão
        </Text>
      </View>

      {/* ── Bottom Sheet claro ── */}
      <KeyboardAvoidingView
        style={styles.bottomSheet}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.sheetTitle}>Entrar na sua conta</Text>

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

        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Esqueci a senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Primeiro Acesso</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          Ao entrar, você concorda com os{" "}
          <Text style={styles.termsLink}>termos de uso</Text> e{" "}
          <Text style={styles.termsLink}>política de privacidade</Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}