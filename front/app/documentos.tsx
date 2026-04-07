import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from "react-native";
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

// Importação dos estilos externos
import { styles } from "@/screens/Documentos/documentos.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DocumentsScreen() {
  const documentSections = [
    { id: 1, title: 'Mudança' },
    { id: 2, title: 'Autorização de reforma' },
    { id: 3, title: 'Regimento interno' },
    { id: 4, title: 'Relatório de manutenção' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#A07050" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <FontAwesome5 name="file-alt" size={24} color="white" />
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Documentos</Text>
        </View>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* ── CONTEÚDO E FAB ── */}
      <View style={styles.centerContainer}>
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.contentContainer}
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

        {/* BOTÃO FLUTUANTE */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <Feather name="download" size={20} color="white" />
          <Text style={styles.fabText}>Baixar</Text>
        </TouchableOpacity>
      </View>

      {/* ── FOOTER PADRONIZADO ── */}
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