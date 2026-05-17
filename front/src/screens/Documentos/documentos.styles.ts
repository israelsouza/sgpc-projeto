import { colors, palette } from "@/theme/colors";
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.offWhite, 
  },
  

  centerContainer: {
    width: "95%",
    height: "80%",
    backgroundColor: palette.offWhite,
    borderRadius: 10,
    marginTop: -15,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 18,
    paddingHorizontal: 19,
    alignSelf:"center" 
  },

  
  // --- LISTA ---
  content: {
    flex:1
  },

  contentContainer: {
    padding: 20,
    gap: 10
  },
  listItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.earthAccent,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: 230
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
  },
  // --- BOTÃO FLUTUANTE (FAB) ---
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0090FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },


  //FORM PARA ADICIONAR DOCUMENTO
  card: {
    backgroundColor: "#ffff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e0d9d0",
    flex: 1,
    gap: 16
  },

  label: {
    fontSize: 16,
    color: palette.negro,
    fontFamily: "InterBold",
    marginBottom: 6,
  },
  
  input: {
    fontSize: 14,
    fontFamily:"interMedium",
    color: palette.negro,
  },

  anexarCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0d9d0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 25,
  },
 
  containerBotao:{
    flexDirection: "row",
    marginTop: 15,
    justifyContent:"space-evenly",
  },

  btnEnviar: {
    backgroundColor: palette.accent,
    borderRadius: 10,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    elevation: 6, 
},     

  btnEnviarText: {
    color: "#fff",
    fontSize: 14,
    fontFamily:"InterBold"
  },

  btnCancelar: {
    backgroundColor: palette.offWhite,
    borderRadius: 10,
    padding:20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
    elevation: 6,
    borderWidth: 1,
    borderColor: palette.accent
},     

  btnCancelarText: {
    color: palette.negro,
    fontSize: 14,
    fontFamily:"InterBold"
  },

  //MODAL PARA ADICIONAR

  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.35)",
  justifyContent: "center",
  alignItems: "center",
  padding: 24,
},

modalContainer: {
  width: "100%",
  maxWidth: 320,
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 20,
},

modalTitle: {
  fontSize: 20,
  fontFamily: "InterBold",
  textAlign: "center",
  marginBottom: 18,
  color: "#000",
},

optionButton: {
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 12,
  backgroundColor: palette.gray,
  marginBottom: 12,
  alignItems: "center"
},

optionText: {
  fontSize: 16,
  fontFamily: "InterMedium",
  color: colors.textDark,
},

cancelButton: {
  marginTop: 6,
  paddingVertical: 12,
  alignItems: "center",
  backgroundColor: palette.accent,
  borderRadius: 14
},

cancelText: {
  fontSize: 15,
  fontFamily: "InterBold",
  color: colors.textLight
},

//MODAL PARA BAIXAR OS PDF NO PERFIL DE USUÁRIO
overlayPDFs:{
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  padding: 16,
},

containerPDF:{
  backgroundColor: "#FFF",
  borderRadius: 16,
  overflow: "hidden",
  marginTop: 40,
  marginBottom: 40,
},

headerPDFs:{
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderBottomColor: "#E5E5E5",
},

titlePDFs:{
  fontSize: 16,
  fontWeight: "700",
  flex: 1,
  marginRight: 12,
},

loadingContainer:{
  fontSize: 16,
  fontWeight: "700",
  flex: 1,
  marginRight: 12,
},

loadingText:{
  marginTop: 10
},

footerPDF:{
  flexDirection: "row",
  gap: 12,
  padding: 16,
  borderTopWidth: 1,
  borderTopColor: "#E5E5E5",
},

downloadButtonPDF:{
  flex: 1,
  backgroundColor: palette.accent,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},

downloadTextPDF:{
  color: colors.textLight,
  fontFamily: "InterMedium",
  fontSize: 16
},

closeButtonPDF:{
  flex: 1,
  backgroundColor: palette.offWhite,
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: "center",
  justifyContent: "center",
},

closeTextPDF:{
  fontFamily: "InterMedium",
  fontSize: 16,
  color: palette.negro
}
});