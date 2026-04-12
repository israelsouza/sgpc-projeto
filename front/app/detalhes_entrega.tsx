import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DeliveryDetails() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><MaterialIcons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Entrega</Text>
          <Text style={styles.headerSubtitle}>Detalhes de aviso</Text>
        </View>
      </View>

      <View style={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Morador</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#D9BBA9', marginRight: 15 }} />
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>João da silva</Text>
              <Text style={{ color: '#999' }}>Unidade 207 - Bloco A</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.label}>Datas</Text>
          <View style={styles.rowDetail}><Text>Criado em</Text><Text style={{fontWeight: 'bold'}}>13/03/2026</Text></View>
          <View style={styles.divider} />
          <View style={styles.rowDetail}><Text>Prazo final</Text><Text style={{fontWeight: 'bold'}}>18/03/2026 as 18:30</Text></View>
        </View>

        <TouchableOpacity style={styles.btnActionSecondary}>
          <Text style={styles.btnTextSecondary}>receber</Text>
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