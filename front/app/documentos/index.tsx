import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable, Alert, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "@/screens/Documentos/documentos.styles";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { colors, palette } from "@/theme/colors";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BottomNav } from "@/components/BottomNav";
import * as Sharing from "expo-sharing";
import { Directory, File, Paths } from "expo-file-system";
import { WebView } from "react-native-webview";

export default function DocumentsScreen() {
  const documentSections = [
  {
    id: 1,
    title: "Autorização de mudança",
    pdfURL: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  },

  {
    id: 2,
    title: "Autorização de reforma",
    pdfURL: "https://www.orimi.com/pdf-test.pdf",
  },

  {
    id: 3,
    title: "Regimento interno",
    pdfURL: "https://eppge.fgv.br/sites/default/files/teste.pdf",
  },

  {
    id: 4,
    title: "Relatório de manutenção",
    pdfURL: "https://camarademanga.mg.gov.br/arquivo/643db1e220143.pdf",
  },
];

  const [openSelect, setOpenSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);       
  const [tipoDocumento, setTipoDocumento] = useState(""); 
  const [placeHolder, setPlaceHolder] = useState("Ex: Alvará de demolição");
  const [userRole, setUserRole] = useState<
    "sindico" | "usuario" | "administrador" | null
  >("sindico"); //PARA TESTE SÓ TROCAR O VALOR DO PARENTESES
  const [pdfModal, setPdfModal] = useState(false);
  const [selecionarDoc, setSelecionarDoc] = useState<{
  id: number;
  title: string;
  pdfURL: string;
} | null>(null);
  const [downloading, setDownloading] = useState(false);
  
  const handleAddDocument = () => {
    setOpenSelect(true);
  };

  const handleNovoDocumento = () => {
    setOpenSelect(false);
    setShowForm(true); 
  };

  const handleEnviar = () => {
    if (!tipoDocumento) {
      alert("Preencha o tipo do documento");
      return;
    }
    console.log("Enviando documento:", tipoDocumento);
    setShowForm(false);    
    setTipoDocumento("");    
  };

  const handleOpenPDF = (document: {id: number; title: string; pdfURL: string}) => {
    setSelecionarDoc(document);
    setPdfModal(true);
  }

const handleDownloadPdf = async () => {
  try {
    if (!selecionarDoc) return;

    setDownloading(true);

    const destination = new Directory(Paths.cache, "pdfs");
    destination.create({ intermediates: true, idempotent: true });

    // Gera um nome único usando timestamp + id do documento
    const fileName = `documento_${selecionarDoc.id}_${Date.now()}.pdf`;
    const destinationFile = new File(destination, fileName);

    const downloadedFile = await File.downloadFileAsync(
      selecionarDoc.pdfURL,
      destinationFile  // Passa o File com nome único, não o Directory
    );

    const isSharingAvailable = await Sharing.isAvailableAsync();

    if (isSharingAvailable) {
      await Sharing.shareAsync(downloadedFile.uri);
    } else {
      Alert.alert("Sucesso", `Arquivo baixado em: ${downloadedFile.uri}`);
    }
  } catch (error) {
    console.error(error);
    Alert.alert("Erro", "Não foi possível baixar o PDF.");
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
      const token = await AsyncStorage.getItem("token");

      if(token){
        const decoded: any = jwtDecode(token);
        setUserRole(decoded.role);
      }
    };
    loadUser();
  }, []);
 

 /*  useEffect(() => {
    setUserRole("sindico");
  }, []); */ //DESCOMENTAR PARA FAZER TESTE COM USUÁRIO ESPECÍFICO

  return (
    <View style={styles.container}>
      <HeaderFuncApp
        title={"Documentos"}
        subtitle={showForm ? undefined : "Selecione a opção desejada"}
        iconLeft={<Feather name="arrow-left" size={24} color={colors.textLight} />}
        iconRight={
            userRole === "sindico" && !showForm
            ? <Feather name="plus" size={24} color={colors.textLight} />
            : <Feather name="folder" size={24} color={colors.textLight} />
        }
        onPressLeft={showForm ? handleCancelar : () => router.push('/home  ')}
        onPressRight={ userRole === "sindico" && !showForm ? handleAddDocument : undefined}
      />

      <View style={styles.centerContainer}>

        {showForm && userRole === "sindico" ? (
          <View style={{ flex: 1, padding: 20, gap: 16 }}>

            <View style={styles.card}>
              <Text style={styles.label}>Tipo documento</Text>
              <TextInput
                style={styles.input}
                placeholder={placeHolder}
                placeholderTextColor={palette.darkBrown}
                onFocus={() => setPlaceHolder('')}
                onBlur={() => setPlaceHolder("Ex: Alvará de demolição")}
                value={tipoDocumento}
                onChangeText={setTipoDocumento}
              />
            </View>

            <TouchableOpacity style={styles.anexarCard}>
              <Text style={styles.label}>Anexar documentos</Text>
              <Feather name="upload" size={24} color={palette.accent} />
            </TouchableOpacity>

            <View style={styles.containerBotao}>
              <TouchableOpacity
                style={styles.btnEnviar}
                onPress={handleEnviar}
              >
                <Text style={styles.btnEnviarText}>Enviar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={handleCancelar}
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
              {documentSections.map((item) => (
                <TouchableOpacity key={item.id} style={styles.listItem} onPress={() => handleOpenPDF(item)}>
                  <View style={styles.listItemLeft}>
                    <Feather name="folder" size={28} color={colors.earthBrown} />
                    <Text style={styles.listItemText}>{item.title}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={28} color={colors.earthBrown} />
                </TouchableOpacity>
              ))}
              <View/>
            </ScrollView>
        )}

      </View>

      <BottomNav />


      {/* MODAL APENAS PARA O SINDICO ADICIONAR SEUS DOCS */}
   
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


      {/* MODAL PARA APENAS O USUÁRIO BAIXAR O PDF */}
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
          {selecionarDoc?.title}
        </Text>

        <TouchableOpacity onPress={() => setPdfModal(false)}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* PDF */}
      {selecionarDoc && (
        <WebView
        source={{ 
            uri: `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(selecionarDoc.pdfURL)}` 
        }}
        style={{ flex: 1 }}
          startInLoadingState
          onShouldStartLoadWithRequest={(request) => {
          return request.url.includes("docs.google.com");
          }}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>
                Carregando PDF...
              </Text>
            </View>
          )}
        />
      )}

      {/* FOOTER */}
        <View style={styles.footerPDF}>

          <TouchableOpacity
            style={styles.downloadButtonPDF}
            onPress={handleDownloadPdf}
            disabled={downloading}
          >
            <Text style={styles.downloadTextPDF}>
              {downloading ? "Baixando..." : "Baixar PDF"}
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