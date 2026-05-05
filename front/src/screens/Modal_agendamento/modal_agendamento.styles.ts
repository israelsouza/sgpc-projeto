import { StyleSheet, Platform, Dimensions } from "react-native";

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const styles = StyleSheet.create({
 // Adicione ao seu StyleSheet existente
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escurecido
  justifyContent: 'center',
  padding: 20,
},
modalContent: {
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 25,
  elevation: 5,
},
modalTitle: {
  fontSize: 18,
  color: '#D4A373',
  fontWeight: 'bold',
  marginBottom: 20,
},
confirmRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#E2E8F0',
},
confirmLabel: {
  color: '#718096',
  fontSize: 14,
},
confirmValue: {
  color: '#1A202C',
  fontWeight: 'bold',
  fontSize: 14,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 30,
},
btnModalCancel: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#8B5E3C',
  borderRadius: 12,
  padding: 15,
  marginRight: 10,
  alignItems: 'center',
},
btnModalConfirm: {
  flex: 1,
  backgroundColor: '#8B5E3C',
  borderRadius: 12,
  padding: 15,
  marginLeft: 10,
  alignItems: 'center',
},
successContainer: {
  alignItems: 'center',
  paddingVertical: 30,
},
successTitle: {
  color: '#D4A373',
  fontSize: 18,
  marginBottom: 20,
}
});
