import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { colors } from "@/theme/colors";
import { styles } from "@/screens/Register/Register.styles";
import api from "@/services/api";
import { registerStep1Schema, registerSchema } from "@/validation/authSchemas";

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { chave_acesso, perfil, condominio } = params;

  const [formData, setFormData] = useState({
    nome_completo: "",
    email: "",
    senha: "",
    confirmacao_senha: "",
    celular: "",
    rg: "",
    cpf: "",
    data_nascimento: "",
    chave_acesso: (chave_acesso as string) || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    const { error } = registerStep1Schema.validate(formData, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      console.log(error);

      const newErrors: Record<string, string> = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      Alert.alert("Erro", "Verifique os dados de acesso");
      return;
    }

    setErrors({});
    setStep(2);
  };

  const handleRegister = async () => {
    const { error } = registerSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors: Record<string, string> = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setErrors(newErrors);
      Alert.alert("Erro", "Verifique os dados de identificação");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        perfil === "MORADOR"
          ? "/moradores/registrar"
          : "/funcionarios/registrar";
      await api.post(endpoint, formData);

      Alert.alert(
        "Sucesso!",
        "Seu cadastro foi realizado e está aguardando aprovação do síndico.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }],
      );
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || "Erro ao realizar cadastro";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (step === 2 ? setStep(1) : router.back())}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Criar conta</Text>
          <Text style={styles.headerSubtitle}>
            {perfil} - {condominio}
          </Text>
        </View>
      </View>

      {/* ── Barra de progresso ── */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabelLeft}>Passo {step} de 2</Text>
          <Text style={styles.progressLabelRight}>
            {step === 1 ? "Dados de acesso" : "Identificação"}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: step === 1 ? "50%" : "100%" },
            ]}
          />
        </View>
      </View>

      {/* ── Card ── */}
      <ScrollView
        style={styles.card}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 ? (
          <>
            <Text style={styles.sectionLabel}>Acesso</Text>

            <TextInput
              style={[
                styles.input,
                errors.nome_completo && { borderColor: "red", borderWidth: 1 },
              ]}
              placeholder="Nome completo"
              placeholderTextColor={colors.textMuted}
              maxLength={100}
              value={formData.nome_completo}
              onChangeText={(v) => handleChange("nome_completo", v)}
            />
            {errors.nome_completo && (
              <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                {errors.nome_completo}
              </Text>
            )}

            <TextInput
              style={[
                styles.input,
                errors.email && { borderColor: "red", borderWidth: 1 },
              ]}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={100}
              value={formData.email}
              onChangeText={(v) => handleChange("email", v)}
            />
            {errors.email && (
              <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                {errors.email}
              </Text>
            )}

            <TextInput
              style={[
                styles.input,
                errors.celular && { borderColor: "red", borderWidth: 1 },
              ]}
              placeholder="Celular (ex: 11999998888)"
              maxLength={11}
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={formData.celular}
              onChangeText={(v) => handleChange("celular", v)}
            />
            {errors.celular && (
              <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                {errors.celular}
              </Text>
            )}

            <TextInput
              style={[
                styles.input,
                errors.senha && { borderColor: "red", borderWidth: 1 },
              ]}
              placeholder="Senha"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              maxLength={70}
              value={formData.senha}
              onChangeText={(v) => handleChange("senha", v)}
            />
            {errors.senha && (
              <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                {errors.senha}
              </Text>
            )}

            <TextInput
              style={[
                styles.input,
                errors.confirmacao_senha && {
                  borderColor: "red",
                  borderWidth: 1,
                },
              ]}
              placeholder="Confirmar senha"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              maxLength={70}
              value={formData.confirmacao_senha}
              onChangeText={(v) => handleChange("confirmacao_senha", v)}
            />
            {errors.confirmacao_senha && (
              <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                {errors.confirmacao_senha}
              </Text>
            )}

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleNextStep}
            >
              <Text style={styles.btnPrimaryText}>Continuar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Identificação</Text>

            <View style={styles.identBox}>
              <TextInput
                style={[
                  styles.inputFull,
                  { marginBottom: 10 },
                  errors.rg && { borderColor: "red", borderWidth: 1 },
                ]}
                placeholder="RG"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={9}
                value={formData.rg}
                onChangeText={(v) => handleChange("rg", v)}
              />
              {errors.rg && (
                <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                  {errors.rg}
                </Text>
              )}

              <TextInput
                style={[
                  styles.inputFull,
                  errors.cpf && { borderColor: "red", borderWidth: 1 },
                ]}
                placeholder="CPF (apenas números)"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={11}
                value={formData.cpf}
                onChangeText={(v) => handleChange("cpf", v)}
              />
              {errors.cpf && (
                <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                  {errors.cpf}
                </Text>
              )}

              <TextInput
                style={[
                  styles.inputFull,
                  { marginTop: 10 },
                  errors.data_nascimento && {
                    borderColor: "red",
                    borderWidth: 1,
                  },
                ]}
                placeholder="Nascimento (DDMMAAAA)"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                maxLength={8}
                value={formData.data_nascimento}
                onChangeText={(v) => handleChange("data_nascimento", v)}
              />
              {errors.data_nascimento && (
                <Text style={{ color: "red", fontSize: 10, marginBottom: 5 }}>
                  {errors.data_nascimento}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnPrimaryText}>Finalizar Cadastro</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSecondary, { marginTop: 10 }]}
              onPress={() => setStep(1)}
            >
              <Text style={styles.btnSecondaryText}>Voltar</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
