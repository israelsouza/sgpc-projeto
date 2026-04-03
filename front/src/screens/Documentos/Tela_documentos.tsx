import React from 'react-native';
import {Text, View, TouchableOpacity, ScrollView, StatusBar, Feather, StandardHeader } from 'react-native';
import { styles } from './documentos.styles';
import { footerStyles } from './Footer_padrao';


// =========================================================================================
// !!! INÍCIO DO COMPONENTE DO CONTEÚDO PRINCIPAL !!!
// =========================================================================================
// Dados de exemplo para a lista
const documentSections = [
  { id: 1, title: 'Mudança' },
  { id: 2, title: 'Autorização de reforma' },
  { id: 3, title: 'Regimento interno' },
  { id: 4, title: 'Relatório de manutenção' },
];

const MainContent = () => {
  return (
    <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
      {documentSections.map((item) => (
        <TouchableOpacity key={item.id} style={styles.listItem}>
          <View style={styles.listItemLeft}>
            {/* Ícone de pasta */}
            <Feather name="folder" size={32} color="black" style={styles.folderIcon} />
            {/* Texto do item */}
            <Text style={styles.listItemText}>{item.title}</Text>
          </View>
          {/* Seta para a direita */}
          <MaterialIcons name="chevron-right" size={30} color="black" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};


// =========================================================================================
// !!! CÓDIGO DO LAYOUT DO FOOTER (PARA REUTILIZAÇÃO) !!!
// !!! FOCO AQUI PARA PADRONIZAÇÃO !!!
// =========================================================================================

/**
 * Componente StandardFooter
 * * Para reutilizar este footer em outras telas, copie este bloco de componente
 * e o bloco correspondente em 'footerStyles'.
 */
const StandardFooter = () => {
  // Estado para controlar qual item está ativo (para fins de demonstração)
  // Em uma navegação real, isso viria das props de navegação.
  const activeRoute = 'Documents'; 

  return (
    <View style={footerStyles.footer}>
      
      {/* Botão Home */}
      <TouchableOpacity style={footerStyles.footerItem}>
        <Feather 
          name="home" 
          size={28} 
          color={activeRoute === 'Home' ? '#6B7280' : 'black'} // Exemplo de cor ativa/inativa
        />
      </TouchableOpacity>

      {/* Botão Histórico */}
      <TouchableOpacity style={footerStyles.footerItem}>
        <MaterialIcons name="history" size={30} color="black" />
      </TouchableOpacity>

      {/* Botão Comunicados */}
      <TouchableOpacity style={footerStyles.footerItem}>
        <Ionicons name="megaphone-outline" size={28} color="black" />
      </TouchableOpacity>

      {/* Botão Perfil */}
      <TouchableOpacity style={footerStyles.footerItem}>
        <Feather name="user" size={28} color="black" />
      </TouchableOpacity>
      
    </View>
  );
};


// =========================================================================================
// --- COMPONENTE PRINCIPAL QUE MONTA A TELA ---
// =========================================================================================
export default function App() {
  return (
    // SafeAreaView garante que o conteúdo não fique sob o "notch" ou barra de tarefas
    <View style={styles.container}>
      {/* Configuração da barra de status (hora, bateria, etc.) */}
      <StatusBar barStyle="light-content" backgroundColor="#A07050" />
      
      {/* Header Fixo no Topo */}
      <StandardHeader />

      {/* Conteúdo Central Scrolável */}
      <MainContent />

      {/* Footer Fixo na Base */}
      <StandardFooter />
      <View style={styles.centerContainer}>
        <MainContent />
         <TouchableOpacity 
          style={styles.fab} 
          onPress={handleDownloadPress}
          activeOpacity={0.7} // Efeito visual ao tocar
        >
          <Feather name="download" size={24} color="white" />
          <Text style={styles.fabText}>Baixar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

