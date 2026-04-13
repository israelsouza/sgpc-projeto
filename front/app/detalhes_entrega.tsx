import React from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar 
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons"; 
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function DeliveryDetailsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5E3C" />
      
      {/* --- HEADER FIXO NO TOPO --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Entrega</Text>
          <Text style={styles.headerSubtitle}>Detalhes de aviso</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
          <Feather name="more-horizontal" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* --- CONTEÚDO SCROLÁVEL (ROlável) --- */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} // Oculta a barra de rolagem (opcional)
      >
        
        {/* Seção 1: Morador */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Morador</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <View style={{ 
              width: 60, 
              height: 60, 
              borderRadius: 30, 
              backgroundColor: '#D9BBA9', // Cor do avatar da imagem
              marginRight: 15 
            }} />
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                João da silva
              </Text>
              <Text style={{ color: '#999', fontSize: 14 }}>
                Unidade 207 - Bloco A
              </Text>
            </View>
          </View>
        </View>

        {/* Seção 2: Datas */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Datas</Text>
          
          <View style={styles.rowDetail}>
            <Text style={{ color: '#666', fontSize: 14 }}>Criado em</Text>
            <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 16 }}>
              13/03/2026
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={[styles.rowDetail, { alignItems: 'center' }]}>
            <Text style={{ color: '#666', fontSize: 14 }}>Prazo final</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ 
                backgroundColor: '#D4A373', // Cor da tag "Hoje"
                paddingHorizontal: 10, 
                paddingVertical: 3, 
                borderRadius: 15, 
                marginRight: 8 
              }}>
                <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>Hoje</Text>
              </View>
              <Text style={{ fontWeight: 'bold', color: '#333', fontSize: 16 }}>
                18/03/2026 as 18:30
              </Text>
            </View>
          </View>
        </View>

        {/* --- SEÇÃO DE MENSAGEM --- */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>Mensagem</Text>
          <View style={{ marginTop: 15, minHeight: 80 }}>
            <Text style={{ 
              fontSize: 15, 
              color: '#666', 
              lineHeight: 22, 
              textAlign: 'justify' 
            }}>
              Uma entrega esta para chegar mas precisei ir ao hospital, pode guardar até minha mulher chegar do trabalho, favor.
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />

      </ScrollView>

      {/* --- BOTÃO DE AÇÃO FIXO NA BASE --- */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
        <TouchableOpacity style={styles.btnActionSecondary} activeOpacity={0.8}>
          <Text style={styles.btnTextSecondary}>receber</Text>
        </TouchableOpacity>
      </View>

      {/* --- FOOTER PADRONIZADO FIXO NO RODAPÉ --- */}
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