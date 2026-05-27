import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { storage } from "@/utils/storage";
import notificationService from "../services/notificationService";

// Configura como as notificações devem aparecer quando o app está aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // Desativado para não mostrar o popup com o app aberto
    shouldShowBanner: false,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });

      await Notifications.setNotificationChannelAsync("sgpc_avisos_urgentes", {
        name: "Avisos Urgentes",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        showBadge: true,
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.warn("Falha ao obter permissão para notificações push!");
        return;
      }

      try {
        // No Expo Go, precisamos usar o getExpoPushTokenAsync.
        // O getDevicePushTokenAsync (FCM nativo) só funciona em 'Development Builds'.
        const expoToken = await Notifications.getExpoPushTokenAsync({
          projectId: "46b238d8-71c5-4b47-aa77-d794e798841c", // ID do seu projeto no app.json
        });
        token = expoToken.data;
        console.log("Token do Expo obtido:", token);
      } catch (e: any) {
        console.warn(
          "Não foi possível obter o token de notificação no Expo Go:",
          e.message,
        );
      }
    } else {
      console.warn("Notificações push só funcionam em dispositivos físicos.");
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
        const condoId = await storage.getItemAsync("user_condominio_id");
        if (condoId) {
          // Nota: No Firebase Admin (backend), enviamos para o tópico 'condominio_{id}'
          // No Expo/FCM nativo, a inscrição geralmente é feita via API ou SDK nativo.
          // Como estamos usando o token nativo na API, a inscrição por tópicos
          // deve ser gerenciada ou pelo backend ou via uma chamada que associe o token ao tópico.
          console.log(
            `Usuário deve ser monitorado no tópico: condominio_${condoId}`,
          );
        }
      }
    } catch (error) {
      console.error("Erro ao sincronizar FCM Token:", error);
    }
  };

  return {
    registerForPushNotificationsAsync,
    syncToken,
  };
};
