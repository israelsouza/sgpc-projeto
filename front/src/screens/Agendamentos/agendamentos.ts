import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F3EE",
  },
  // --- HEADER ---
  header: {
    height: 120,
    backgroundColor: "#8B5E3C",
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
  },
  backButton: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 45,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  // --- CONTEÚDO ---
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4A373',
    marginBottom: 15,
  },
  // --- CARDS ---
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  cardDateInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'right',
  },
  // --- AGENDAMENTO DE HORÁRIOS ---
  datePickerContainer: {
    backgroundColor: '#0A191E',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 20,
  },
  datePickerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  timeSlotText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  // --- BOTÕES ---
  btnFloating: {
    backgroundColor: '#8B5E3C',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignSelf: 'center',
   position: 'absolute', 
    bottom: 30, // Distância da borda inferior
    minWidth: 250,
    alignItems: 'center',
    elevation: 5, // Sombra para dar destaque
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  btnFloatingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#8B5E3C',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 60,
    alignSelf: 'center',
    marginTop: 20,
  },
  btnOutlineText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  }
  });