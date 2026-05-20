import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { DocumentoService, IDocumento } from '../services/documentoService';

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<IDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchDocumentos = useCallback(async (categoria?: string, limit: number = 10, offset: number = 0) => {
    setLoading(true);
    try {
      const response = await DocumentoService.listar(categoria, limit, offset);
      setDocumentos(response.items);
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao buscar documentos';
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const openDocumento = useCallback(async (documentoId: number) => {
    setDownloadingId(documentoId);
    try {
      const url = await DocumentoService.obterDownloadUrl(documentoId);
      
      // Abre a URL assinada no navegador do sistema de forma segura
      await Linking.openURL(url);
      
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao tentar abrir o documento';
      Alert.alert('Erro', msg);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const uploadDocumento = useCallback(async (formData: FormData) => {
    setLoading(true);
    try {
      await DocumentoService.criar(formData);
      Alert.alert('Sucesso', 'Documento enviado com sucesso');
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao enviar documento';
      Alert.alert('Erro', msg);
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
  };
}
