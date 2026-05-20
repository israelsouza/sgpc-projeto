import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '@/services/authService';
import { IRegisterForm } from '@/types';
// import { useNotifications } from './useNotifications';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { syncToken } = useNotifications();

  const handleLogin = async (dados: { email: string; senha: string }) => {
    if (!dados.email || !dados.senha) {
      Alert.alert("Erro", "Preencha e-mail e senha");
      return;
    }

    setLoading(true);
    try {
      const authData = await AuthService.login(dados);
      
      // Salva o token de forma segura (SecureStore apenas aceita strings)
      await SecureStore.setItemAsync('user_token', String(authData.access_token || ""));
      await SecureStore.setItemAsync('user_perfil', String(authData.perfil || ""));
      await SecureStore.setItemAsync('user_nome', String(authData.nome || ""));
      await SecureStore.setItemAsync('user_condominio', String(authData.condominio || ""));
      await SecureStore.setItemAsync('user_condominio_id', String(authData.condominio_id || ""));
      await SecureStore.setItemAsync('user_unidade', String(authData.unidade || ""));

      // Tenta sincronizar o Token FCM para notificações.
      // A falha aqui não deve impedir o login.
      // try {
      //   await syncToken();
      // } catch (notificationError) {
      //   console.error("Falha ao sincronizar o token de notificação, mas o login continuará:", notificationError);
      // }

      Alert.alert("Sucesso", "Login realizado com sucesso!", [
        { text: "OK", onPress: () => router.replace("/(tabs)/home") }
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || "E-mail ou senha incorretos";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

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
            ...(unidade ? { unidade } : {})
          }
        });
      };

      if (Platform.OS === 'web') {
        navigateToRegister();
      } else {
        Alert.alert(
          "Chave Validada",
          `Perfil: ${perfil}\nCondomínio: ${condominio}${unidade ? `\nUnidade: ${unidade}` : ""}`,
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

  const checkPermission = async (allowedProfiles: string[]) => {
    try {
      const userProfile = await SecureStore.getItemAsync('user_perfil');
      return userProfile ? allowedProfiles.includes(userProfile) : false;
    } catch {
      return false;
    }
  };

  return { 
    loading,
    handleLogin,
    handleValidateKey,
    handleRegistration,
    checkPermission,
  };
}
