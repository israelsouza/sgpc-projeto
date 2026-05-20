import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const stylesWeb = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EE",
  },
  // Header expandido para Web
  header: {
    height: 80,
    backgroundColor: "#8B5E3C",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  // Área principal centralizada e larga
  mainContent: {
    width: isWeb ? '90%' : '100%',
    maxWidth: 1200, // Limita a expansão em monitores muito grandes
    alignSelf: 'center',
    padding: 20,
  },
  // Card de Seleção (conforme image_2bc99c.png)
  spaceCardWeb: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  // Container de Data e Horários expandido
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 30,
    width: '100%',
    minHeight: 400,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4A373',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  datePickerWeb: {
    backgroundColor: '#0A191E',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    width: '100%', // Ocupa toda a largura do container conforme a imagem
    marginBottom: 30,
  },
  btnAgendarWeb: {
    borderWidth: 1,
    borderColor: '#8B5E3C',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 80,
    alignSelf: 'center',
    marginTop: 40,
  }
});
