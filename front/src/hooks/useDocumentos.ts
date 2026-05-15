import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
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
      
      // Abre a URL assinada no navegador interno de forma segura
      await WebBrowser.openBrowserAsync(url);
      
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao tentar abrir o documento';
      Alert.alert('Erro', msg);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  return {
    documentos,
    loading,
    downloadingId,
    fetchDocumentos,
    openDocumento,
  };
}
