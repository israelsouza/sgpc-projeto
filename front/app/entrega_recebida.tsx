import React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,  
  ScrollView 
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DeliveryReceived() {
  return (
    <View style={styles.container}>
      
      {/* 1. HEADER FIXO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Entrega Recebida</Text>
          <Text style={styles.headerSubtitle}>Aviso ao porteiro</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
        <Feather name="more-horizontal" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. ÁREA DE CONTEÚDO (SCROLLVIEW) */}
      {/* O flex: 1 aqui garante que ele empurre o footer para o final da tela */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Observação (opcional)</Text>
        <TextInput 
          style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
          multiline 
          placeholder="Digite aqui..."
        />

        <Text style={styles.label}>Anexo</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <Feather name="paperclip" size={20} color="#8B5E3C" />
          <Text style={{ color: '#D4A373', marginLeft: 10 }}>
            Enviar arquivo <Text style={{ color: '#999' }}>(opcional)</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnAction}>
          <Text style={styles.btnText}>retirar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 3. FOOTER PADRONIZADO FIXO NO CHÃO */}
      <View style={footerStyles.footer}>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="home" size={26} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <MaterialIcons name="history" size={28} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Ionicons name="megaphone-outline" size={26} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="user" size={26} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
}