import React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  StatusBar 
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DeliveryFinish() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5E3C" />

      {/* 1. HEADER FIXO NO TOPO */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Entrega Retirada</Text>
          <Text style={styles.headerSubtitle}>Aviso ao porteiro</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
          <Feather name="more-horizontal" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* 2. ÁREA DE CONTEÚDO SCROLLABLE (FLEX: 1) */}
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Quem retirou?</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nome do responsável" 
            placeholderTextColor="#D4A373" 
          />

          <Text style={styles.label}>CPF</Text>
          <TextInput 
            style={styles.input} 
            placeholder="000.000.000-00" 
            placeholderTextColor="#D4A373" 
            keyboardType="numeric"
          />

          <TouchableOpacity style={[styles.btnAction, { marginTop: 10 }]}>
            <Text style={styles.btnText}>Finalizar</Text>
          </TouchableOpacity>
        </View>
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