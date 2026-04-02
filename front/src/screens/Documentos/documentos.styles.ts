import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6F1', 
  },
  
  //Header
  header: {
    height: 120, 
    backgroundColor: '#A07050',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10, 
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center', 
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerUnderline: {
    height: 3,
    backgroundColor: '#0090FF', 
    width: '100%',
    marginTop: 4,
  },
  headerMoreButton: {
    padding: 5,
  },

  //Conteúdo Principal 
  content: {
    flex: 1, 
  },
  contentContainer: {
    padding: 20, 
  },
  listItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70,
    borderRadius: 15, 
    paddingHorizontal: 15,
    marginBottom: 15, 
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
    marginRight: 15, 
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  fab: {
    position: 'absolute', 
    bottom: 20, 
    right: 20,  
    backgroundColor: '#0090FF', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
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
});