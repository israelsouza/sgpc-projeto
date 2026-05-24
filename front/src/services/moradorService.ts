import api from './api';

export interface MoradorResponse {
  id: number;
  nome_completo: string;
  unidade?: {
    unidade: string;
    bloco?: string;
  };
}

export const moradorService = {
  registrar: async (dados: any) => {
    const response = await api.post('/moradores/registrar', dados);
    return response.data;
  },
  listarMoradoresUnidade: async () => {
    const response = await api.get('/moradores/unidade');
    return response.data;
  },
  listarMoradoresCondominio: async () => {
    const response = await api.get('/moradores/condominio');
    return response.data;
  },
};
