import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StatusBar 
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

import { styles } from "@/screens/Convidar/convidar.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function InviteScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#A07050" />

      {/* ── HEADER COM VOLTAR ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Convidar alguém</Text>

        <TouchableOpacity style={styles.headerDots}>
          <Feather name="more-horizontal" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <View style={styles.content}>
        
        {/* Card de Expiração */}
        <View style={styles.whiteCard}>
          <Text style={styles.infoText}>Este link de convite expira em</Text>
          <Text style={styles.timerText}>10m59s</Text>
        </View>

        {/* Botão Enviar Link */}
        <TouchableOpacity style={styles.btnInvite} activeOpacity={0.8}>
          <Text style={styles.btnInviteText}>Enviar link ao convidado</Text>
        </TouchableOpacity>

      </View>

      {/* ── FOOTER PADRONIZADO (REUTILIZADO) ── */}
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