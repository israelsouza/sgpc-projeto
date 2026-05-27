import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Utilitário de armazenamento híbrido para suportar Web e Mobile.
 * No Web utiliza localStorage, no Mobile utiliza SecureStore.
 */
export const storage = {
  /**
   * Salva um item no armazenamento.
   */
  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Erro ao salvar no localStorage:', error);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  /**
   * Recupera um item do armazenamento.
   */
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Erro ao ler do localStorage:', error);
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  /**
   * Remove um item do armazenamento.
   */
  deleteItemAsync: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};
