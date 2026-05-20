import { useState } from 'react';
import { conviteService, ConviteResponse } from '../services/conviteService';
import { Alert, Share } from 'react-native';

export const useConvite = () => {
  const [loading, setLoading] = useState(false);
  const [convite, setConvite] = useState<ConviteResponse | null>(null);

  const gerarECompartilhar = async () => {
    setLoading(true);
    try {
      const response = await conviteService.gerarConvite();
      // O backend agora retorna 'data' e não 'dados'
      // Se não houver erro capturado pelo interceptor, consideramos sucesso
      if (response.data) {
        setConvite(response.data);
        await compartilhar(response.data.url);
      } else {
        Alert.alert('Erro', response.message || 'Não foi possível gerar o convite.');
      }
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const compartilhar = async (url: string) => {
    try {
      await Share.share({
        message: `Olá! Para agilizar sua entrada no condomínio, preencha seus dados neste link: ${url}`,
        title: 'Convite de Visitante - SGPC',
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
