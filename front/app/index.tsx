import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao SGPC</Text>
      <Text style={styles.subtitle}>Home Screen</Text>
      
      {/* IDA PARA PAGINA PRINCIPAL -- OU TROQUE 'home' PELO NOME DA PÁGINA QUE ESTA FAZENDO */}
      {/* <Link href="/home" style={styles.link}>  */}

      {/* IDA PARA TELA DE LOGIN PARA TESTAR O FLUXO DE LOGIN */}
      <Link href="/login" style={styles.link}> 
        Ir para Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  link: {
    fontSize: 16,
    color: "#B5845A",
  },
});
