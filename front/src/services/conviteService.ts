import api from './api';

export interface ConviteResponse {
  id: number;
  token: string;
  url: string;
  tipo: string;
  data_expiracao: string;
  status: string;
}

export interface Visitante {
  id: number;
  nome_completo: string;
  documento: string;
  celular: string;
  tipo: 'VISITANTE' | 'PRESTADOR_SERVICO';
  morador_id: number;
  criado_em: string;
  morador?: {
      unidade?: {
          unidade: string;
          bloco?: string;
      }
  }
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
  listarVisitantesCondominio: async () => {
    const response = await api.get('/convites/visitantes/condominio');
    return response.data;
  },
  atualizarVisitante: async (id: number, dados: Partial<Visitante>) => {
    const response = await api.patch(`/convites/visitantes/${id}`, dados);
    return response.data;
  },
  excluirVisitante: async (id: number) => {
    const response = await api.delete(`/convites/visitantes/${id}`);
    return response.data;
  },
};
