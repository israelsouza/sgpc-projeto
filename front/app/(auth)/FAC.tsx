import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { styles } from "@/screens/fac/fac.styles";

const faqs = [
  {
    id: 1,
    question: "Onde posso me cadastrar?",
    answer:
      "Caso você seja um morador, solicite ao seu síndico a geração do token de acesso. Não esqueça de passar os dados básicos para pré-cadastro: CPF, Nome Completo e Data de nascimento. E não se preocupe, todos os seus dados estarão seguros em nossa aplicação! Caso deseje saber como seus dados serão utilizados acesse nossa politica de privacidade.",
    hasLink: true,
    linkText: "política de privacidade",
    linkTarget: "Privacidade",
  },
  {
    id: 2,
    question: "Sou síndico e quero utilizar a ferramenta. Como me cadastro?",
    answer:
      "Síndicos podem entrar em contato diretamente com nossa equipe de suporte. O processo é rápido, prático e seguro.",
    hasLink: false,
  },
  {
    id: 3,
    question: "Como posso cadastrar novos moradores?",
    answer:
      "Moradores: Caso você seja um morador e deseje adicionar novos moradores contacte seu sindico. Sindicos: Acesse Home → Cadastrados → Toque no ícone "+" → Preencha as informações → Compartilhe o link temporário de cadastro.",
    hasLink: false,
  },
  {
    id: 4,
    question: "Como cadastrar visitantes ou funcionários na minha unidade?",
    answer:
      "Todos os moradores podem adicionar novos visitantes de forma segura. Acesse Home → Cadastrar Visitantes → Adicione as informações principais → Compartilhe o link para o visitante preencher o formulário.",
    hasLink: false,
  },
  {
    id: 5,
    question: "Há limite de moradores, funcionários ou visitantes cadastrados?",
    answer:
      "Não, não há restrição de quantidade no aplicativo. Cadastre conforme a necessidade do seu condomínio, sem mínimo ou máximo de cadastrados.",
    hasLink: false,
  },
  {
    id: 6,
    question: "Qual é a função principal da aplicação?",
    answer:
      "O SGPC centraliza dados e informações do condomínio, facilitando o gerenciamento e acesso a informações relevantes. Moradores podem realizar solicitações formais diretamente pela ferramenta.",
    hasLink: false,
  },
];

function FAQItem({ item }: { item: (typeof faqs)[0] }) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => setOpen((prev) => !prev)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.chevron}>{open ? "−" : "+"}</Text>
      </View>

      {open && (
        <View style={styles.answerBox}>
          <Text style={styles.answer}>
            {item.answer}{" "}
            {item.hasLink && (
              <Text
                style={styles.link}
                onPress={() => navigation.navigate(item.linkTarget as never)}
              >
                <br>
                </br>
                Clique aqui acessar nossa {item.linkText}.
              </Text>
            )}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export default function FAQ() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.tag}>SUPORTE</Text>
        <Text style={styles.title}>Perguntas{"\n"}Frequentes</Text>
        <Text style={styles.subtitle}>
          Encontre respostas rápidas sobre o uso da plataforma.
        </Text>
      </View>

      <View style={styles.list}>
        {faqs.map((item) => (
          <FAQItem key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda com dúvidas?</Text>
        <Pressable onPress={() => Linking.openURL("https://forms.gle/M3Dpbzr7RDdAxyoq7")}>
          <Text style={styles.footerLink}>Fale com o suporte  →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
    