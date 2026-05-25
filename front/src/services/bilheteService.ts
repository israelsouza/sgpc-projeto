import api from './api';

export interface Bilhete {
  id: number;
  assunto: string;
  mensagem: string;
  categoria: string;
  autor: string;
  data_criacao: string;
  hora_criacao: string;
  unidade?: string;
  bloco?: string;
  andar?: number;
  numero?: string;
  prefixo?: string;
}

const bilheteService = {
  async listarBilhetes() {
    const response = await api.get<Bilhete[]>('/bilhete/listar-bilhetes');
    return response.data;
  },

  async criarBilhetes(dados: { assunto: string; mensagem: string; categoria?: string; hora_criacao: string; unidade?: string; bloco?: string; andar?: number; numero?: string; prefixo?: string }) {
    const response = await api.post<Bilhete>('/bilhete/criar-bilhetes', dados);
    return response.data;
  },

  async deletarBilhete(id: number) {
    const response = await api.delete(`/bilhete/deletar-bilhetes/${id}`);
    return response.data;
  }
};

export default bilheteService;
