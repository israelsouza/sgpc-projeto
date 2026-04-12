import React from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DeliveryReceived() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><MaterialIcons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Entrega Recebida</Text>
          <Text style={styles.headerSubtitle}>Aviso ao porteiro</Text>
        </View>
      </View>

      <View style={styles.scrollContent}>
        <Text style={styles.label}>Observação (opcional)</Text>
        <TextInput style={[styles.input, { height: 80 }]} multiline />

        <Text style={styles.label}>Anexo</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <Feather name="paperclip" size={20} color="#8B5E3C" />
          <Text style={{ color: '#D4A373', marginLeft: 10 }}>Enviar arquivo <Text style={{ color: '#999' }}>(opcional)</Text></Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnAction}>
          <Text style={styles.btnText}>retirar</Text>
        </TouchableOpacity>
      </View>
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