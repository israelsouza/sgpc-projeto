import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
// Certifique-se de ter @expo/vector-icons instalado (se usar Expo)
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; 

// =========================================================================================
// !!! INÍCIO DO COMPONENTE DO HEADER PADRONIZADO !!!
// =========================================================================================
const StandardHeader = () => {
  return (
    <View style={styles.header}>
      {/* Ícone de documento à esquerda */}
      <View style={styles.headerIconContainer}>
        <FontAwesome5 name="file-alt" size={32} color="white" />
      </View>
      
      {/* Título Centralizado com sublinhado */}
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Documentos</Text>
        <View style={styles.headerUnderline} />
      </View>
      
      {/* Ícone de 3 pontos à direita */}
      <TouchableOpacity style={styles.headerMoreButton}>
        <Feather name="more-horizontal" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

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

// --- ESTILOS ESPECÍFICOS DO FOOTER PADRÃO ---
const footerStyles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: 80, // Altura total do footer
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0', // Cor da borda superior sutil
    justifyContent: 'space-around', // Distribui os itens uniformemente
    alignItems: 'center', // Centraliza verticalmente
    paddingBottom: 15, // Espaço extra para a "safe area" inferior de iPhones
    paddingHorizontal: 20,
    // Sombra para Android
    elevation: 8,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  footerItem: {
    alignItems: 'center', // Centraliza o ícone horizontalmente
    justifyContent: 'center',
    flex: 1, // Faz com que cada item ocupe o mesmo espaço
    height: '100%',
  },
});

// =========================================================================================
// !!! FIM DO CÓDIGO DO FOOTER PADRÃO !!!
// =========================================================================================


// =========================================================================================
// --- COMPONENTE PRINCIPAL QUE MONTA A TELA ---
// =========================================================================================
export default function App() {
  return (
    // SafeAreaView garante que o conteúdo não fique sob o "notch" ou barra de tarefas
    <SafeAreaView style={styles.container}>
      {/* Configuração da barra de status (hora, bateria, etc.) */}
      <StatusBar barStyle="light-content" backgroundColor="#A07050" />
      
      {/* Header Fixo no Topo */}
      <StandardHeader />

      {/* Conteúdo Central Scrolável */}
      <MainContent />

      {/* Footer Fixo na Base */}
      <StandardFooter />
      
    </SafeAreaView>
  );
}

// --- ESTILOS GERAIS DA TELA E COMPONENTES NÃO-FOOTER ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F1', // Cor de fundo bege clara da tela (abaixo do header)
  },
  
  // Estilos do Header
  header: {
    height: 120, // Altura do header marrom
    backgroundColor: '#A07050', // Cor marrom/terrosa do header
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10, // Ajuste para descer o conteúdo do header
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)', // Fundo semi-transparente para o ícone
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center', // Centraliza título e sublinhado
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerUnderline: {
    height: 3,
    backgroundColor: '#0090FF', // Cor azul do sublinhado
    width: '100%',
    marginTop: 4,
  },
  headerMoreButton: {
    padding: 5,
  },

  // Estilos do Conteúdo Principal (Lista)
  content: {
    flex: 1, // Ocupa o espaço restante entre header e footer
  },
  contentContainer: {
    padding: 20, // Espaçamento ao redor da lista
  },
  listItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    borderRadius: 15, // Cantos arredondados dos itens
    paddingHorizontal: 15,
    marginBottom: 15, // Espaço entre os itens
    // Sombras para os itens da lista
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  folderIcon: {
    marginRight: 15, // Espaço entre o ícone e o texto
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
});