import { useState, useEffect, useCallback } from 'react';
import avisoService, { Aviso } from '../services/avisoService';
import * as SecureStore from 'expo-secure-store';

export const useAviso = (categoria?: string) => {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAvisos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await avisoService.listar(categoria);
      setAvisos(data.items);
      setError(null);
    } catch (err: any) {
      setError('Falha ao carregar avisos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    carregarAvisos();
  }, [carregarAvisos]);

  useEffect(() => {
    let socket: WebSocket | null = null;

    const setupWebSocket = async () => {
      const condoId = await SecureStore.getItemAsync('user_condominio_id');
      if (!condoId) return;

      const wsUrl = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api')
        .replace('http', 'ws') + `/avisos/ws/${condoId}`;

      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'NEW_AVISO') {
          // Quando um novo aviso chega via WS, recarregamos a lista
          // ou poderíamos adicionar o novo aviso ao topo se o JSON viesse completo
          carregarAvisos();
        }
      };

      socket.onerror = (e) => {
        console.warn('WebSocket error:', e);
      };
    };

    setupWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [carregarAvisos]);

  return {
    avisos,
    loading,
    error,
    refresh: carregarAvisos
  };
};
