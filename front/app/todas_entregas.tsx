import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { styles } from "@/screens/Entregas(Porteiro)/entregas.styles";
import { footerStyles } from "@/screens/Documentos/Footer_padrao";

export default function AllDeliveries() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}><MaterialIcons name="arrow-back" size={26} color="white" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Todas Entregas</Text>
          <Text style={styles.headerSubtitle}>4 registros</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.monthTitle}>Abril 2026</Text>
        <DeliveryItem type="Pacote" user="joão" date="18/03/25" time="14:50" color="#9ED99C" icon="box" />
        <DeliveryItem type="Carta" user="Mariana Lira Silva" date="17/03/25" time="14:50" color="#A9B2D9" icon="mail" />
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.monthTitle}>Agosto 2025</Text>
        <DeliveryItem type="Pacote" user="joão" date="18/03/25" time="14:50" color="#9ED99C" icon="box" />
        <DeliveryItem type="Carta" user="Mariana Lira Silva" date="17/03/25" time="14:50" color="#A9B2D9" icon="mail" />
      </ScrollView>
      <View style={footerStyles.footer}>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="home" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <MaterialIcons name="history" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Ionicons name="megaphone-outline" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={footerStyles.footerItem}>
          <Feather name="user" size={26} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const DeliveryItem = ({ type, user, date, time, color, icon }) => (
  <TouchableOpacity style={styles.deliveryCard}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <Feather name={icon} size={24} color="white" />
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{type}</Text>
      <Text style={styles.cardSubtitle}>Retirada por {user}</Text>
    </View>
    <Text style={styles.cardDate}>{date}{"\n"}{time}</Text>
  </TouchableOpacity>
);