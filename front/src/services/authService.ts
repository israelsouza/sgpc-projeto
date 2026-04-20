import api from './api';
import { IRegisterForm, StandardResponse, AuthResponse, ChaveValidacao } from '@/types';

export const AuthService = {
  login: async (dados: { email: string; senha: string }): Promise<AuthResponse> => {
    const response = await api.post<StandardResponse<AuthResponse>>("/auth/login", dados)
    return response.data.data as AuthResponse; // Retorna o payload { access_token, token_type, perfil }
  },

  validarChave: async (chave: string): Promise<ChaveValidacao> => {
    const response = await api.get<StandardResponse<ChaveValidacao>>(`/chaves/validar/${chave}`);
    return response.data.data as ChaveValidacao; // Retorna o payload { perfil, condominio, unidade }
  },

  registrar: async (dados: IRegisterForm, perfil: 'MORADOR' | 'FUNCIONARIO'): Promise<any> => {
    const endpoint = perfil === 'MORADOR' ? '/moradores/registrar' : '/funcionarios/registrar';
    const response = await api.post<StandardResponse<any>>(endpoint, dados);
    return response.data.data;
  },
};
