import api from './api';
import { IRegisterForm } from '@/types';

export const AuthService = {
  login: async (dados: { email: string; senha: string }) => {
    const response = await api.post("/auth/login", dados)
    return response.data.data; // Retorna o payload { access_token, token_type, perfil }
  },

  validarChave: async (chave: string) => {
    const response = await api.get(`/chaves/validar/${chave}`);
    return response.data.data; // Retorna o payload { perfil, condominio, unidade }
  },

  registrar: async (dados: IRegisterForm, perfil: 'MORADOR' | 'FUNCIONARIO') => {
    const endpoint = perfil === 'MORADOR' ? '/moradores/registrar' : '/funcionarios/registrar';
    const response = await api.post(endpoint, dados);
    return response.data;
  },
};
