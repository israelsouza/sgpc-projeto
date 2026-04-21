import { useState } from 'react';
import { RecuperacaoSenhaService } from '../services/recuperacaoSenhaService';

interface UseRecuperacaoSenhaState {
  email: string;
  codigo: string;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export const useRecuperacaoSenha = () => {
  const [state, setState] = useState<UseRecuperacaoSenhaState>({
    email: '',
    codigo: '',
    loading: false,
    error: null,
    message: null,
  });

  const setEmail = (email: string) => setState(prev => ({ ...prev, email }));
  const setCodigo = (codigo: string) => setState(prev => ({ ...prev, codigo }));
  const clearError = () => setState(prev => ({ ...prev, error: null }));
  const clearMessage = () => setState(prev => ({ ...prev, message: null }));

  const solicitarRecuperacao = async (email: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, message: null }));
    try {      
      const message = await RecuperacaoSenhaService.solicitarRecuperacao(email);
      setState(prev => ({ ...prev, email, loading: false, message }));
      return true; // Sucesso
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao solicitar recuperação. Tente novamente.';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false; // Falha
    }
  };

  const validarCodigo = async (codigo: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, message: null }));
    try {
      const valido = await RecuperacaoSenhaService.validarCodigo(state.email, codigo);
      if (valido) {
        setState(prev => ({ ...prev, codigo, loading: false }));
        return true;
      }
      return false;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensagem || 'Código inválido ou expirado.';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  };

  const resetarSenha = async (novaSenha: string) => {
    setState(prev => ({ ...prev, loading: true, error: null, message: null }));
    try {
      const message = await RecuperacaoSenhaService.resetarSenha(state.email, state.codigo, novaSenha);
      setState(prev => ({ ...prev, loading: false, message }));
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.mensagem || 'Erro ao redefinir a senha. Verifique os dados.';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  };

  return {
    ...state,
    setEmail,
    setCodigo,
    clearError,
    clearMessage,
    solicitarRecuperacao,
    validarCodigo,
    resetarSenha,
  };
};
