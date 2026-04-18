import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Pressable } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { styles } from "@/screens/Documentos/documentos.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { colors, palette } from "@/theme/colors";

export default function DocumentsScreen() {
  const documentSections = [
    { id: 1, title: "Autorização de mudança" },
    { id: 2, title: "Autorização de reforma" },
    { id: 3, title: "Regimento interno" },
    { id: 4, title: "Relatório de manutenção" },
  ];

  const [openSelect, setOpenSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);       
  const [tipoDocumento, setTipoDocumento] = useState(""); 

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

  const handleCancelar = () => {
    setShowForm(false);
    setTipoDocumento("");
  };

  return (
    <View style={styles.container}>
      <HeaderFuncApp
        title={"Documentos"}
        subtitle={showForm ? undefined : "Selecione a opção desejada"}
        iconLeft={<Feather name="arrow-left" size={24} color={colors.textLight} />}
        iconRight={
          !showForm
            ? <Feather name="plus" size={24} color={colors.textLight} />
            : <Feather name="folder" size={24} color={colors.textLight} />
        }
        onPressLeft={showForm ? handleCancelar : () => router.back()}
        onPressRight={!showForm ? handleAddDocument : undefined}
      />

      <View style={styles.centerContainer}>

        {showForm ? (
          <View style={{ flex: 1, padding: 20, gap: 16 }}>

            <View style={styles.card}>
              <Text style={styles.label}>Tipo documento</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Alvará de demolição"
                placeholderTextColor={palette.darkBrown}
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
              <TouchableOpacity key={item.id} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Feather name="folder" size={28} color="black" />
                  <Text style={styles.listItemText}>{item.title}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={28} color="black" />
              </TouchableOpacity>
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}

      </View>

      <View style={footerStyles.footer}>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="home" size={26} color={palette.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <MaterialIcons name="history" size={28} color={palette.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Ionicons name="megaphone-outline" size={26} color={palette.gray} />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="user" size={26} color={palette.gray} />
        </TouchableOpacity>
      </View>

   
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
    </View>
  );
}