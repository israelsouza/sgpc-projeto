import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Login/login.styles";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [accessKey, setAccessKey] = useState("");
  
  const { loading, handleLogin, handleValidateKey } = useAuth();

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
        {!showKeyInput ? (
          <>
            <Text style={styles.sheetTitle}>Entrar na sua conta</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity 
              style={styles.forgotWrapper}
              onPress={() => router.push("/EsqueciSenha")}
            >
              <Text style={styles.forgotText}>Esqueci a senha</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnPrimary} 
              onPress={() => handleLogin({ email, senha })}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.btnSecondary} 
              onPress={() => setShowKeyInput(true)}
            >
              <Text style={styles.btnSecondaryText}>Primeiro Acesso</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sheetTitle}>Validar Convite</Text>
            <Text style={[styles.appSubtitle, { color: colors.textDark, marginBottom: 20 }]}>
              Insira a chave de acesso que você recebeu
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Chave de Acesso (UUID)"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              value={accessKey}
              onChangeText={setAccessKey}
            />

            <TouchableOpacity 
              style={styles.btnPrimary} 
              onPress={() => handleValidateKey(accessKey)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>Validar Chave</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btnSecondary, { marginTop: 15 }]} 
              onPress={() => setShowKeyInput(false)}
            >
              <Text style={styles.btnSecondaryText}>Voltar para o Login</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.terms}>
          Ao entrar, você concorda com os{" "}
          <Text style={styles.termsLink}>termos de uso</Text> e{" "}
          <Text style={styles.termsLink}>política de privacidade</Text>
        </Text>


      <View>
          <Text style={styles.txtFAC}>Está com dúvidas sobre nosso sistema? {''} <Text style={styles.termsLink} onPress={() => router.push('/FAC')}>Clique aqui!</Text></Text>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
