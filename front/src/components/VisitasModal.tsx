import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Visita } from '@/services/visitanteService';

interface VisitasModalProps {
  visible: boolean;
  onClose: () => void;
  visitas: Visita[];
}

export const VisitasModal: React.FC<VisitasModalProps> = ({ visible, onClose, visitas }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Visitantes Cadastrados</Text>

          <FlatList
            data={visitas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.visitaItem}>
                <Text style={styles.visitaNome}>{item.nome}</Text>
                <Text style={styles.visitaDocumento}>Documento: {item.documento}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum visitante encontrado.</Text>}
            style={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    width: '100%',
  },
  visitaItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  visitaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  visitaDocumento: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});
