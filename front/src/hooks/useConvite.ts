import { useState } from 'react';
import { conviteService, ConviteResponse } from '../services/conviteService';
import { Alert, Share, Platform } from 'react-native';

export const useConvite = () => {
  const [loading, setLoading] = useState(false);
  const [convite, setConvite] = useState<ConviteResponse | null>(null);

  const gerarECompartilhar = async (tipo: 'VISITANTE' | 'PRESTADOR_SERVICO' = 'VISITANTE') => {
    setLoading(true);
    try {
      const response = await conviteService.gerarConvite(tipo);
      
      if (response.data) {
        setConvite(response.data);
        await compartilhar(response.data.url, tipo);
      } else {
        if (Platform.OS === 'web') alert(response.message || 'Não foi possível gerar o convite.');
        else Alert.alert('Erro', response.message || 'Não foi possível gerar o convite.');
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao conectar com o servidor.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  };

  const compartilhar = async (url: string, tipo: string) => {
    try {
      const label = tipo === 'VISITANTE' ? 'Visitante' : 'Prestador de Serviço';
      const message = `Olá! Para agilizar sua entrada no condomínio como ${label}, preencha seus dados neste link: ${url}`;
      
      await Share.share({
        message,
        title: `Convite de ${label} - SGPC`,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  return {
    loading,
    convite,
    gerarECompartilhar,
  };
};
