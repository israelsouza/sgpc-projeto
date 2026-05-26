import api from './api';
import { StandardResponse } from '@/types';

// Supondo que a visita tenha essa estrutura, ajuste conforme o seu backend
export interface Visita {
  id: string;
  nome: string;
  documento: string;
  empresa: string | null;
  // adicione outros campos que vierem da sua API
}

export const VisitanteService = {
  getAll: async (): Promise<Visita[]> => {
    const response = await api.get<StandardResponse<Visita[]>>('/visitantes/');
    if (response.data && Array.isArray(response.data)) {
      return response.data; // Se a resposta for uma lista direta
    } else if (response.data.data && Array.isArray(response.data.data)) {
      return response.data.data; // Se a resposta for aninhada em um objeto { data: [...] }
    }
    throw new Error(response.data.message || 'Erro ao buscar visitantes.');
  },
};
