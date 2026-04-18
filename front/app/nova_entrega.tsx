import React from "react";
import { View, Text, TouchableOpacity, StatusBar, ScrollView, TextInput } from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";

import { styles } from "@/screens/Nova_Entrega/nova_entrega.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function NewDeliveryScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5E3C" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Nova Entrega</Text>
          <Text style={styles.headerSubtitle}>Aviso ao porteiro</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        {/* DATA E HORÁRIO */}
        <View style={styles.sectionCard}>
          <View style={styles.row}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Data</Text>
              <View style={styles.lightInput}>
                <Text style={styles.lightInputText}>06/04/2026</Text>
                <Feather name="calendar" size={18} color="#8B5E3C" />
              </View>
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Horário</Text>
              <View style={styles.lightInput}>
                <Text style={styles.lightInputText}>18:39</Text>
                <Feather name="clock" size={18} color="#8B5E3C" />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Prazo para retirada</Text>
          <View style={styles.deadlineInput}>
            <Text style={styles.deadlineText}>06/04/2026 às 22:39</Text>
          </View>
        </View>

        {/* CATEGORIA */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Categoria</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Feather name="mail" size={20} color="#8B5E3C" />
            <Text style={styles.optionText}>Carta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton}>
            <Feather name="box" size={20} color="#8B5E3C" />
            <Text style={styles.optionText}>Pacote</Text>
          </TouchableOpacity>
        </View>

        {/* MENSAGEM */}
        <View style={styles.sectionCard}>
          <Text style={styles.label}>Mensagem</Text>
          <TextInput 
            style={styles.messageBox}
            placeholder="Ex: Por favor aguardar minha chegada até 19h"
            multiline
            placeholderTextColor="#A68D85"
          />
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btnSave}>
            <Text style={styles.deadlineText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnCancel}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#4A3C31' }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FOOTER PADRONIZADO */}
      <View style={footerStyles.footer}>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="home" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <MaterialIcons name="history" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Ionicons name="megaphone-outline" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="user" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}