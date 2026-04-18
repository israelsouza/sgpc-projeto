import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '@/services/authService';
import { IRegisterForm } from '@/types';
import { registerStep1Schema, registerSchema } from '@/validation/authSchemas';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleValidateKey = async (accessKey: string) => {
    if (!accessKey) {
      Alert.alert("Erro", "Informe a chave de acesso");
      return;
    }

    setLoading(true);
    try {
      const { perfil, condominio, unidade } = await AuthService.validarChave(accessKey);

      const navigateToRegister = () => {
        router.push({
          pathname: "/(auth)/Register",
          params: { 
            chave_acesso: accessKey,
            perfil,
            condominio,
          }
        });
      };

      if (Platform.OS === 'web') {
        navigateToRegister();
      } else {
        Alert.alert(
          "Chave Validada",
          `Perfil: ${perfil}
Condomínio: ${condominio}${unidade ? `
Unidade: ${unidade}` : ""}`,
          [{ text: "Continuar Cadastro", onPress: navigateToRegister }]
        );
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || "Chave inválida ou expirada";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (formData: IRegisterForm, perfil: 'MORADOR' | 'FUNCIONARIO') => {
    setLoading(true);
    try {
      await AuthService.registrar(formData, perfil);
      Alert.alert(
        "Sucesso!",
        "Seu cadastro foi realizado e está aguardando aprovação.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }]
      );
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || "Erro ao realizar cadastro";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading,
    handleValidateKey,
    handleRegistration,
  };
}
