import api from './api';

export interface Aviso {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  anexo_url?: string;
  criado_em: string;
  is_recente: boolean;
}

export interface AvisoListResponse {
  total: number;
  items: Aviso[];
}

const avisoService = {
  async listar(categoria?: string, limit: number = 10, offset: number = 0) {
    const response = await api.get<any>('/avisos', {
      params: { categoria, limit, offset }
    });
    return response.data.data as AvisoListResponse;
  },

  async obterDetalhes(avisoId: number) {
    const response = await api.get<any>(`/avisos/${avisoId}`);
    return response.data.data as Aviso;
  },

  async obterUrlAnexo(avisoId: number) {
    const response = await api.get<any>(`/avisos/${avisoId}/anexo`);
    return response.data.data.url as string;
  }
};

export default avisoService;
