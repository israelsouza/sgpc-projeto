import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, Alert, ActivityIndicator, Platform } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "@/screens/Documentos/documentos.styles";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { colors, palette } from "@/theme/colors";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { useDocumentos } from "@/hooks/useDocumentos";
import { IDocumento } from "@/services/documentoService";
import { storage } from "@/utils/storage";

export default function DocumentsScreen() {
  const { documentos, loading, fetchDocumentos, openDocumento, uploadDocumento } = useDocumentos();

  const [openSelect, setOpenSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);       
  const [tipoDocumento, setTipoDocumento] = useState(""); 
  const [placeHolder, setPlaceHolder] = useState("Ex: Alvará de demolição");
  const [userRole, setUserRole] = useState<string | null>(null); 
  const [pdfModal, setPdfModal] = useState(false);
  const [selecionarDoc, setSelecionarDoc] = useState<IDocumento | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleAddDocument = () => {
    setOpenSelect(true);
  };

  const handleNovoDocumento = () => {
    setOpenSelect(false);
    setShowForm(true); 
  };

  const handleEnviar = async () => {
    if (!tipoDocumento) {
      if (Platform.OS === 'web') alert("Preencha o título do documento");
      else Alert.alert("Erro", "Preencha o título do documento");
      return;
    }

    if (!selectedFile) {
      if (Platform.OS === 'web') alert("Por favor, selecione um arquivo PDF");
      else Alert.alert("Erro", "Por favor, selecione um arquivo PDF");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titulo', tipoDocumento);
      formData.append('categoria', 'Geral');
      
      // Ajuste de FormData para Mobile vs Web
      if (Platform.OS === 'web') {
        formData.append('arquivo', selectedFile.file as any);
      } else {
        formData.append('arquivo', {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || 'application/pdf',
        } as any);
      }

      const success = await uploadDocumento(formData);
      if (success) {
        setShowForm(false);
        setTipoDocumento("");
        setSelectedFile(null);
        fetchDocumentos();
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao enviar documento';
      if (Platform.OS === 'web') alert(msg);
      else Alert.alert("Erro", msg);
    }
  };

  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Erro ao selecionar arquivo", error);
    }
  };

  const handleOpenPDF = (document: IDocumento) => {
    setSelecionarDoc(document);
    setPdfModal(true);
  }

  const handleDownloadPdf = async () => {
    try {
      if (!selecionarDoc) return;
      setDownloading(true);
      await openDocumento(selecionarDoc.id);
    } catch (error) {
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCancelar = () => {
    setShowForm(false);
    setTipoDocumento("");
  };

  // ── FIX: Looping infinito corrigido e migrado para storage centralizado ──
  useEffect(() => {
    async function init() {
      try {
        const profile = await storage.getItemAsync("user_perfil");
        setUserRole(profile ? profile.toLowerCase() : null);
      } catch (e) {
        console.error("Erro ao carregar perfil", e);
      }
      fetchDocumentos();
    }
    init();
  }, [fetchDocumentos]);

  const isPorterOrAdmin = userRole === "sindico" || userRole === "administrador" || userRole === "admin";

  return (
    <View style={styles.container}>
      <HeaderFuncApp
        title={"Documentos"}
        subtitle={showForm ? undefined : "Selecione a opção desejada"}
        iconLeft={<Feather name="arrow-left" size={24} color={colors.textLight} />}
        iconRight={
            isPorterOrAdmin && !showForm
            ? <Feather name="plus" size={24} color={colors.textLight} />
            : <Feather name="folder" size={24} color={colors.textLight} />
        }
        onPressLeft={showForm ? handleCancelar : () => router.replace('/home')}
        onPressRight={ isPorterOrAdmin && !showForm ? handleAddDocument : undefined}
      />
      <View style={styles.centerContainer}>

        {showForm && isPorterOrAdmin ? (
          <View style={{ flex: 1, padding: 20, gap: 16 }}>

            <View style={styles.card}>
              <Text style={styles.label}>Título do documento</Text>
              <TextInput
                style={styles.input}
                placeholder={placeHolder}
                placeholderTextColor={palette.darkBrown}
                onFocus={() => setPlaceHolder('')}
                onBlur={() => setPlaceHolder("Ex: Ata de Assembleia")}
                value={tipoDocumento}
                onChangeText={setTipoDocumento}
              />
            </View>

            <TouchableOpacity style={styles.anexarCard} onPress={handleSelectFile}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.label}>
                  {selectedFile ? selectedFile.name : "Anexar PDF"}
                </Text>
                <Feather name="upload" size={24} color={palette.accent} />
              </View>
            </TouchableOpacity>

            <View style={styles.containerBotao}>
              <TouchableOpacity
                style={styles.btnEnviar}
                onPress={handleEnviar}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnEnviarText}>Enviar</Text>}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={handleCancelar}
                disabled={loading}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
            </View>

          </View>

        ) : (
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {loading && documentos.length === 0 ? (
                <View style={{ marginTop: 50 }}>
                   <ActivityIndicator size="large" color={colors.earthBrown} />
                </View>
              ) : documentos.length > 0 ? (
                documentos.map((item) => (
                  <TouchableOpacity key={item.id} style={styles.listItem} onPress={() => handleOpenPDF(item)}>
                    <View style={styles.listItemLeft}>
                      <Feather name="file-text" size={28} color={colors.earthBrown} />
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.listItemText}>{item.titulo}</Text>
                        <Text style={{ fontSize: 12, color: '#666' }}>{item.categoria} • {new Date(item.criado_em).toLocaleDateString()}</Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={28} color={colors.earthBrown} />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                  <Feather name="folder-minus" size={48} color="#ccc" />
                  <Text style={{ color: '#999', marginTop: 10 }}>Nenhum documento encontrado</Text>
                </View>
              )}
              <View/>
            </ScrollView>
        )}

      </View>

      {/* MODAL PARA ADICIONAR DOCS */}
      <Modal
        visible={openSelect}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenSelect(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOpenSelect(false)}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Adicionar</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleNovoDocumento}
            >
              <Text style={styles.optionText}>Novo documento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setOpenSelect(false)}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* MODAL PARA VISUALIZAÇÃO */}
      <Modal
        visible={pdfModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPdfModal(false)}
      >
        <View style={styles.overlayPDFs}>
          <View style={styles.containerPDF}>
            <View style={styles.headerPDFs}>
              <Text style={styles.titlePDFs} numberOfLines={1}>
                {selecionarDoc?.titulo}
              </Text>
              <TouchableOpacity onPress={() => setPdfModal(false)}>
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="file-text" size={100} color={colors.earthBrown} />
              <Text style={{ marginTop: 20, textAlign: 'center', fontSize: 16 }}>
                {selecionarDoc?.titulo}
              </Text>
              <Text style={{ marginTop: 10, color: '#666' }}>
                {selecionarDoc?.filename_orig}
              </Text>
            </View>

            <View style={styles.footerPDF}>
              <TouchableOpacity
                style={styles.downloadButtonPDF}
                onPress={handleDownloadPdf}
                disabled={downloading}
              >
                <ActivityIndicator animating={downloading} size="small" color="#FFF" style={{ position: 'absolute', left: 10 }} />
                <Text style={styles.downloadTextPDF}>
                  {downloading ? "Processando..." : "Visualizar / Baixar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeButtonPDF}
                onPress={() => setPdfModal(false)}
              >
                <Text style={styles.closeTextPDF}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
