import api from './api';
import { IRegisterForm, StandardResponse, AuthResponse, ChaveValidacao } from '@/types';

export const AuthService = {
  login: async (dados: { email: string; senha: string }): Promise<AuthResponse> => {
    const response = await api.post<StandardResponse<AuthResponse>>("/auth/login", dados)
    if (!response.data.data) {
      throw new Error(response.data.message || "Erro ao realizar login");
    }
    return response.data.data;
  },

  validarChave: async (chave: string): Promise<ChaveValidacao> => {
    const response = await api.get<StandardResponse<ChaveValidacao>>(`/chaves/validar/${chave}`);
    if (!response.data.data) {
      throw new Error(response.data.message || "Chave inválida");
    }
    return response.data.data;
  },

  registrar: async (dados: IRegisterForm, perfil: 'MORADOR' | 'FUNCIONARIO'): Promise<any> => {
    const endpoint = perfil === 'MORADOR' ? '/moradores/registrar' : '/funcionarios/registrar';
    const response = await api.post<StandardResponse<any>>(endpoint, dados);
    return response.data.data;
  },
};
