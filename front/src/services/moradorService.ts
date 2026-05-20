import api from './api';

export const moradorService = {
  listarMoradoresUnidade: async () => {
    const response = await api.get('/moradores/unidade');
    return response.data;
  },
};
