import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { DocumentoService, IDocumento } from '../services/documentoService';

// PDF de exemplo para o Mock (URL pública e estável que funciona na apresentação)
const MOCK_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<IDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchDocumentos = useCallback(async (categoria?: string, limit: number = 20, offset: number = 0) => {
    setLoading(true);
    try {
      // REATIVADO: Agora buscamos do banco para mostrar deleção/adição em tempo real
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
      // MOCK ATIVO: Mesmo vindo do banco, ignoramos a URL assinada e usamos a estável
      console.log(`[MOCK] Abrindo documento ${documentoId} via URL de apresentação.`);
      
      if (Platform.OS === 'web') {
          window.open(MOCK_PDF_URL, '_blank');
      } else {
          await Linking.openURL(MOCK_PDF_URL);
      }
      
    } catch (error: any) {
      const msg = 'Erro ao tentar abrir o documento.';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert('Erro', msg);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const uploadDocumento = useCallback(async (formData: FormData) => {
    setLoading(true);
    try {
      // REATIVADO: Para que o Síndico possa mostrar que o arquivo aparece na lista
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

  return {
    documentos,
    loading,
    downloadingId,
    fetchDocumentos,
    openDocumento,
    uploadDocumento,
  };
}
