import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { storage } from '@/utils/storage';
import { navigation } from '@/utils/navigation';
import { AuthService } from '@/services/authService';
import { IRegisterForm } from '@/types';
// import { useNotifications } from './useNotifications';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // const { syncToken } = useNotifications();

  const handleLogin = async (dados: { email: string; senha: string }) => {
    if (!dados.email || !dados.senha) {
      if (Platform.OS === 'web') {
        alert("Preencha e-mail e senha");
      } else {
        Alert.alert("Erro", "Preencha e-mail e senha");
      }
      return;
    }

    setLoading(true);
    try {
      const authData = await AuthService.login(dados);
      
      // Salva o token de forma segura (No mobile SecureStore, na Web localStorage)
      await storage.setItemAsync('user_token', String(authData.access_token || ""));
      await storage.setItemAsync('user_perfil', String(authData.perfil || ""));
      await storage.setItemAsync('user_nome', String(authData.nome || ""));
      await storage.setItemAsync('user_condominio', String(authData.condominio || ""));
      await storage.setItemAsync('user_condominio_id', String(authData.condominio_id || ""));
      await storage.setItemAsync('user_unidade', String(authData.unidade || ""));

      if (Platform.OS === 'web') {
        // Na Web, o Alert.alert com botões pode não executar o callback onPress corretamente
        // ou ser bloqueado. Vamos navegar diretamente.
        navigation.replace("/home");
      } else {
        Alert.alert("Sucesso", "Login realizado com sucesso!", [
          { text: "OK", onPress: () => navigation.replace("/home") }
        ]);
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || "E-mail ou senha incorretos";
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert("Erro", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleValidateKey = async (accessKey: string) => {
    if (!accessKey) {
      if (Platform.OS === 'web') {
        alert("Informe a chave de acesso");
      } else {
        Alert.alert("Erro", "Informe a chave de acesso");
      }
      return;
    }

    setLoading(true);
    try {
      const { perfil, condominio, unidade } = await AuthService.validarChave(accessKey);

      const navigateToRegister = () => {
        navigation.push("/Register", { 
            chave_acesso: accessKey,
            perfil,
            condominio,
            ...(unidade ? { unidade } : {})
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
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert("Erro", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (formData: IRegisterForm, perfil: 'MORADOR' | 'FUNCIONARIO') => {
    setLoading(true);
    try {
      await AuthService.registrar(formData, perfil);
      if (Platform.OS === 'web') {
        alert("Seu cadastro foi realizado e está aguardando aprovação.");
        navigation.replace("/login");
      } else {
        Alert.alert(
          "Sucesso!",
          "Seu cadastro foi realizado e está aguardando aprovação.",
          [{ text: "OK", onPress: () => navigation.replace("/login") }]
        );
      }
    } catch (err: any) {
      const msg = err.response?.data?.mensagem || "Erro ao realizar cadastro";
      if (Platform.OS === 'web') {
        alert(msg);
      } else {
        Alert.alert("Erro", msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async (allowedProfiles: string[]) => {
    try {
      const userProfile = await storage.getItemAsync('user_perfil');
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
