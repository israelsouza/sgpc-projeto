import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { DocumentoService, IDocumento } from '../services/documentoService';

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<IDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchDocumentos = useCallback(async (categoria?: string, limit: number = 20, offset: number = 0) => {
    setLoading(true);
    try {
      const response = await DocumentoService.listar(categoria, limit, offset);
      setDocumentos(response.items || []);
    } catch (error: any) {
      console.error('Erro ao buscar documentos da API:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const openDocumento = useCallback(async (documentoId: number) => {
    setDownloadingId(documentoId);
    try {
      const url = await DocumentoService.obterDownloadUrl(documentoId);
      
      if (Platform.OS === 'web') {
          window.open(url, '_blank');
      } else {
          await Linking.openURL(url);
      }
      
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao tentar abrir o documento.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Erro', msg);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const uploadDocumento = useCallback(async (formData: FormData) => {
    setLoading(true);
    try {
      await DocumentoService.criar(formData);
      if (Platform.OS === 'web') alert('Documento enviado com sucesso!');
      else Alert.alert('Sucesso', 'Documento enviado com sucesso!');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao enviar documento';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Erro', msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDocumento = useCallback(async (documentoId: number) => {
    setLoading(true);
    try {
      await DocumentoService.deletar(documentoId);
      if (Platform.OS === 'web') alert('Documento removido com sucesso!');
      else Alert.alert('Sucesso', 'Documento removido com sucesso!');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao excluir documento';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Erro', msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    documentos,
    loading,
    downloadingId,
    fetchDocumentos,
    openDocumento,
    uploadDocumento,
    deleteDocumento,
  };
}
