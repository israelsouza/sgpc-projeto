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

// Cache em memória para evitar requisições redundantes de detalhes
const avisoCache: Record<number, Aviso> = {};

const avisoService = {
  async listar(categoria?: string, limit: number = 20, offset: number = 0) {
    const response = await api.get<any>('/avisos', {
      params: { categoria, limit, offset }
    });
    const data = response.data.data as AvisoListResponse;
    
    // Alimenta o cache com os avisos recebidos
    data.items.forEach(aviso => {
      avisoCache[aviso.id] = aviso;
    });

    return data;
  },

  async obterDetalhes(avisoId: number) {
    // Se o aviso estiver no cache, retorna instantaneamente
    if (avisoCache[avisoId]) {
      return avisoCache[avisoId];
    }

    const response = await api.get<any>(`/avisos/${avisoId}`);
    const aviso = response.data.data as Aviso;
    
    // Guarda no cache para o futuro
    avisoCache[aviso.id] = aviso;
    
    return aviso;
  },

  async atualizar(avisoId: number, dados: Partial<Aviso>) {
    const response = await api.put<any>(`/avisos/${avisoId}`, dados);
    const avisoAtualizado = response.data.data as Aviso;
    
    // Sincroniza o cache local imediatamente após o sucesso do servidor
    avisoCache[avisoAtualizado.id] = avisoAtualizado;
    
    return avisoAtualizado;
  },

  async criar(dados: FormData) {
    const response = await api.post<any>('/avisos', dados, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deletar(avisoId: number) {
    const response = await api.delete(`/avisos/${avisoId}`);
    
    // Remove do cache
    delete avisoCache[avisoId];
    
    return response.data;
  },

  async obterUrlAnexo(avisoId: number) {
    const response = await api.get<any>(`/avisos/${avisoId}/anexo`);
    return response.data.data.url as string;
  }
};

export default avisoService;
