import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { colors } from "@/theme/colors";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* topo escuro */}
      <View style={styles.topSection}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>SGPC</Text>
        </View>
        <Text style={styles.appName}>CondoApp-(SGPC)</Text>
        <Text style={styles.appSubtitle}>
          Gestão do seu condominio na palma da mão
        </Text>
      </View>

      {/* botão sheet claro */}
      <KeyboardAvoidingView
        style={styles.bottomSheet}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Entrar na sua conta</Text>

        {/* campo de email */}
        <TextInput
          style={styles.input}
          placeholder="email"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* campo de senha */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        {/* esqueci a senha */}
        <TouchableOpacity style={styles.forgotWrapper}>
          <Text style={styles.forgotText}>Esqueci a senha</Text>
        </TouchableOpacity>

        {/* Divisorzinho */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botão primeiro acesso */}
        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Primeiro acesso</Text>
        </TouchableOpacity>

        {/* termos */}
        <Text style={styles.terms}>
          Ao entrar, você concorda com os{" "}
          <Text style={styles.termsLink}>termos de uso</Text> e{" "}
          <Text style={styles.termsLink}>política de privacidade</Text>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topSection: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    justifyContent: "center",
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appIconText: {
    fontSize: 28,
    color: colors.textLight,
    fontWeight: "700",
  },
  appName: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  appSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 200,
  },

  bottomSheet: {
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 24,
  },

  input: {
    backgroundColor: colors.surface,
    color: colors.textLight,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  },

  forgotWrapper: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotText: {
    color: colors.primary,
    fontSize: 13,
  },

  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  btnPrimaryText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textSubtle,
    fontSize: 13,
  },

  btnSecondary: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 28,
    backgroundColor: "transparent",
  },
  btnSecondaryText: {
    color: colors.brown,
    fontSize: 15,
    fontWeight: "500",
  },

  terms: {
    textAlign: "center",
    color: colors.textSubtle,
    fontSize: 12,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
  },
});