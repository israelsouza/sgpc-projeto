import api from './api';

export interface FCMTokenData {
  token: string;
  dispositivo?: string;
}

const notificationService = {
  async salvarToken(dados: FCMTokenData) {
    const response = await api.post('/notificacoes/tokens', dados);
    return response.data;
  },

  async removerToken(token: string) {
    const response = await api.delete(`/notificacoes/tokens/${token}`);
    return response.data;
  }
};

export default notificationService;
