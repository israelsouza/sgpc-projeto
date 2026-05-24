import api from './api';

export interface ConviteResponse {
  id: number;
  token: string;
  url: string;
  tipo: string;
  data_expiracao: string;
  status: string;
}

export const conviteService = {
  gerarConvite: async (tipo: 'VISITANTE' | 'PRESTADOR_SERVICO' = 'VISITANTE') => {
    const response = await api.post('/convites/gerar', { tipo });
    return response.data;
  },
  listarVisitantes: async () => {
    const response = await api.get('/convites/visitantes');
    return response.data;
  },
};
