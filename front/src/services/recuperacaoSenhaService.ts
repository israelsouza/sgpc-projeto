import api from './api';
import { StandardResponse } from '@/types';

export const RecuperacaoSenhaService = {
  solicitarRecuperacao: async (email: string): Promise<string> => {
    const response = await api.post<StandardResponse<any>>("/auth/recuperar-senha", { email });    
    return response.data.message;
  },

  validarCodigo: async (email: string, codigo: string): Promise<boolean> => {
    const response = await api.post<StandardResponse<{ valido: boolean }>>("/auth/validar-codigo", { email, codigo });
    return !!response.data.data?.valido;
  },

  resetarSenha: async (email: string, codigo: string, nova_senha: string): Promise<string> => {
    const response = await api.post<StandardResponse<any>>("/auth/resetar-senha", { email, codigo, nova_senha });
    return response.data.message;
  },
};
