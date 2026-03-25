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
import { styles } from "./login.styles";

export default function LoginScreen() {
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />

      {/* topo escuro */}
      <View style={styles.topSection}>
        <View style={styles.appIcon}>
          <Text style={styles.appIcon}>SGPC</Text>
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
          placeholderTextColor="#9AA5B4"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* campo de senha */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9AA5B4"
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
