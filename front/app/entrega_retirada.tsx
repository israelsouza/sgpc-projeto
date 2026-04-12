import React from "react";
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native";
import { Feather, Ionicons,  MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DeliveryFinish() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><MaterialIcons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Entrega Retirada</Text>
          <Text style={styles.headerSubtitle}>Aviso ao porteiro</Text>
        </View>
      </View>

      <View style={styles.scrollContent}>
        <TextInput style={styles.input} placeholder="Quem retirou?" placeholderTextColor="#D4A373" />
        <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#D4A373" />

        <TouchableOpacity style={styles.btnAction}>
          <Text style={styles.btnText}>Finalizar</Text>
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