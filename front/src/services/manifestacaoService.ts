import api from './api';

export interface Manifestacao {
  id: number;
  assunto: string;
  mensagem: string;
  categoria: string;
  status: string;
  autor: string;
  data_criacao: string;
  hora_criacao: string;
  unidade?: string;
  bloco?: string;
  andar?: number;
  numero?: string;
  prefixo?: string;
}

const manifestacaoService = {
  async listarManifestacoes() {
    const response = await api.get<Manifestacao[]>('/manifestacao/listar-manifestacoes');
    return response.data;
  },

  async criarManifestacao(dados: { assunto: string; mensagem: string; categoria?: string; hora_criacao: string; unidade?: string; bloco?: string; andar?: number; numero?: string; prefixo?: string }) {
    const response = await api.post<Manifestacao>('/manifestacao/criar-manifestacao', dados);
    return response.data;
  },

  async atualizarManifestacao(id: number, dados: { status: string; comentario?: string; autor_role?: string }) {
    const response = await api.put<Manifestacao>(`/manifestacao/atualizar-manifestacao/${id}`, dados);
    return response.data;
  },

  async deletarManifestacao(id: number) {
    const response = await api.delete(`/manifestacao/deletar-manifestacao/${id}`);
    return response.data;
  }
};

export default manifestacaoService;
