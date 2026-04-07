import { StyleSheet } from "react-native";
export const footerStyles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    height: 80, 
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    paddingBottom: 15, 
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
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1, 
    height: '100%',
  },
});
