import { api } from './api';

export interface IDocumento {
  id: number;
  titulo: string;
  descricao?: string;
  categoria: string;
  filename_orig: string;
  criado_em: string;
  quem_criou_id: number;
}

export interface IDocumentosResponse {
  total: number;
  items: IDocumento[];
}

export const DocumentoService = {
  listar: async (categoria?: string, limit: number = 10, offset: number = 0): Promise<IDocumentosResponse> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (categoria) {
      params.append('categoria', categoria);
    }

    const response = await api.get(`/documentos?${params.toString()}`);
    return response.data.data;
  },

  obterDownloadUrl: async (documentoId: number): Promise<string> => {
    const response = await api.get(`/documentos/${documentoId}/download`);
    return response.data.data.url;
  }
};
