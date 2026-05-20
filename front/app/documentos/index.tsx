import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, Alert, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "@/screens/Documentos/documentos.styles";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { colors, palette } from "@/theme/colors";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sharing from "expo-sharing";
import { Directory, File, Paths } from "expo-file-system";
import { WebView } from "react-native-webview";

export default function DocumentsScreen() {
  const { documentos, loading, fetchDocumentos, openDocumento, uploadDocumento } = useDocumentos();

  const [openSelect, setOpenSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);       
  const [tipoDocumento, setTipoDocumento] = useState(""); 
  const [placeHolder, setPlaceHolder] = useState("Ex: Alvará de demolição");
  const [userRole, setUserRole] = useState<
    "sindico" | "usuario" | "administrador" | null
  >(null); 
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
      Alert.alert("Erro", "Preencha o título do documento");
      return;
    }

    if (!selectedFile) {
      Alert.alert("Erro", "Por favor, selecione um arquivo PDF");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titulo', tipoDocumento);
      formData.append('categoria', 'Geral');
      formData.append('arquivo', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/pdf',
      } as any);

      const success = await uploadDocumento(formData);
      if (success) {
        setShowForm(false);
        setTipoDocumento("");
        setSelectedFile(null);
        fetchDocumentos();
      }
    } catch (error: any) {
      const msg = error.response?.data?.mensagem || 'Erro ao enviar documento';
      Alert.alert("Erro", msg);
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
      Alert.alert("Erro", "Ocorreu um erro ao selecionar o arquivo.");
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

      const url = await openDocumento(selecionarDoc.id);
      // O openDocumento já abre no browser, mas se quisermos baixar e compartilhar:
      // Note: openDocumento no hook não retorna a URL, ele abre direto.
      // Vou manter a lógica original adaptada se necessário, mas o plano foca em URL assinada.
      
      // Se quiser baixar via expo-file-system, precisa da URL.
      // Vou modificar o hook ou chamar o service direto aqui para download.
      
      Alert.alert("Download", "O documento será aberto no navegador para visualização e download.");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível processar o documento.");
    } finally {
      setDownloading(false);
    }
  };


  const handleCancelar = () => {
    setShowForm(false);
    setTipoDocumento("");
  };
      useEffect(() => {
        const loadUser = async () => {
          try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
              console.log("Token não encontrado");
              return;
            }

      if(token){
        try {
          const decoded: any = jwtDecode(token);
          setUserRole(decoded.role?.toLowerCase());
        } catch (e) {
          console.error("Erro ao decodificar token", e);
        }
      }
    };
    loadUser();
    fetchDocumentos();
  }, [fetchDocumentos]);

  return (
    <View style={styles.container}>
      <HeaderFuncApp
        title={"Documentos"}
        subtitle={showForm ? undefined : "Selecione a opção desejada"}
        iconLeft={<Feather name="arrow-left" size={24} color={colors.textLight} />}
        iconRight={
            (userRole === "sindico" || userRole === "administrador") && !showForm
            ? <Feather name="plus" size={24} color={colors.textLight} />
            : <Feather name="folder" size={24} color={colors.textLight} />
        }
        onPressLeft={showForm ? handleCancelar : () => router.push('/home')}
        onPressRight={ (userRole === "sindico" || userRole === "administrador") && !showForm ? handleAddDocument : undefined}
      />
      <View style={styles.centerContainer}>

        {showForm && (userRole === "sindico" || userRole === "administrador") ? (
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
                <ActivityIndicator size="large" color={colors.earthBrown} style={{ marginTop: 20 }} />
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



      {/* MODAL PARA SINDICO/ADMIN ADICIONAR SEUS DOCS */}
   
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


      {/* MODAL PARA VISUALIZAÇÃO E DOWNLOAD */}
      <Modal
        visible={pdfModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPdfModal(false)}
      >
  <View style={styles.overlayPDFs}>
    
    <View style={styles.containerPDF}>

      {/* HEADER */}
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

      {/* FOOTER */}
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