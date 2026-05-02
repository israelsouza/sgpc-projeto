import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import notificationService from '../services/notificationService';

// Configura como as notificações devem aparecer quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.warn('Falha ao obter permissão para notificações push!');
        return;
      }

      try {
        // Pegamos o token nativo (FCM no Android) para que a API (Python) 
        // possa enviar via firebase-admin diretamente sem passar pelo backend do Expo
        const deviceToken = await Notifications.getDevicePushTokenAsync();
        token = deviceToken.data;
      } catch (e: any) {
        if (e.message.includes('development build')) {
          console.warn('Notificações Push Reais requerem um Development Build (SDK 53+). Ignorando no Expo Go.');
        } else {
          console.error("Erro ao obter device push token:", e);
        }
      }
    } else {
      console.warn('Notificações push só funcionam em dispositivos físicos.');
    }

    return token;
  };

  const syncToken = async () => {
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        const dispositivo = `${Device.brand} ${Device.modelName} (${Platform.OS})`;
        await notificationService.salvarToken({ token, dispositivo });
        console.log("FCM Token sincronizado com sucesso.");

        // Inscreve o usuário no tópico do condomínio dele
        const condoId = await SecureStore.getItemAsync("user_condominio_id");
        if (condoId) {
          // Nota: No Firebase Admin (backend), enviamos para o tópico 'condominio_{id}'
          // No Expo/FCM nativo, a inscrição geralmente é feita via API ou SDK nativo.
          // Como estamos usando o token nativo na API, a inscrição por tópicos 
          // deve ser gerenciada ou pelo backend ou via uma chamada que associe o token ao tópico.
          console.log(`Usuário deve ser monitorado no tópico: condominio_${condoId}`);
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar FCM Token:", error);
    }
  };

  return {
    registerForPushNotificationsAsync,
    syncToken
  };
};
