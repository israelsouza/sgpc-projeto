import { useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { DocumentoService, IDocumento } from '../services/documentoService';

// PDF de exemplo para o Mock (URL pública e estável)
const MOCK_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export function useDocumentos() {
  const [documentos, setDocumentos] = useState<IDocumento[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const fetchDocumentos = useCallback(async (categoria?: string, limit: number = 10, offset: number = 0) => {
    setLoading(true);
    try {
      const response = await DocumentoService.listar(categoria, limit, offset);
      setDocumentos(response.items || []);
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao buscar documentos';
      // Se falhar a listagem (ex: banco vazio), vamos injetar um documento fake para teste
      if (response?.items?.length === 0 || error) {
          setDocumentos([
              {
                  id: 999,
                  titulo: "Regulamento Interno (Mock)",
                  categoria: "Geral",
                  filename_orig: "regulamento.pdf",
                  criado_em: new Date().toISOString(),
                  quem_criou_id: 1
              },
              {
                  id: 888,
                  titulo: "Ata de Assembleia (Mock)",
                  categoria: "Atas",
                  filename_orig: "ata_2026.pdf",
                  criado_em: new Date().toISOString(),
                  quem_criou_id: 1
              }
          ]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const openDocumento = useCallback(async (documentoId: number) => {
    setDownloadingId(documentoId);
    try {
      // MOCK ATIVO: Ignoramos a chamada ao backend e usamos a URL estática
      console.log(`[MOCK] Abrindo documento ${documentoId} via URL estática segura.`);
      
      if (Platform.OS === 'web') {
          // Na web, abrir em nova aba é mais garantido
          window.open(MOCK_PDF_URL, '_blank');
      } else {
          await Linking.openURL(MOCK_PDF_URL);
      }
      
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao tentar abrir o documento';
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
      if (Platform.OS === 'web') alert('Documento enviado com sucesso (Simulado)');
      else Alert.alert('Sucesso', 'Documento enviado com sucesso');
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
