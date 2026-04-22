import { useState, useEffect } from "react";
import { View, SectionList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { componenteList, listadoMock, DetalhesModal, agruparMes } from "@/components/Listado";
import { styles } from "@/screens/Bilhetes/bilhetes.styles";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { BottomNav } from "@/components/BottomNav";

//FAZ DISTINÇÃO DE QUAL USUÁRIO ESTARÁ UTILIZANDO
interface JwtPayload {
  role: "sindico" | "morador" | "administrador" | "porteiro";
  sub: string;
}

//FUNÇÃO PARA PUXAR PELO JWT
function filtrarPorRole(items: componenteList[], role: "sindico" | "morador" | "administrador" | "porteiro"): componenteList[] {
    if (role === "porteiro"){
        return items.filter((item) => item.icone === "person");
    }
    return items;
}


interface Props {
    onAdicionarBilhete?: () => void;
}


export default function BilhetesScreen({ onAdicionarBilhete } : Props) {
  const [userRole, setUserRole] = useState<"sindico" | "morador" | "administrador" | "porteiro" | null>('morador'); //PARA TESTE SÓ TROCAR O VALOR DO PARENTESES
  const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);
  const [openSelect, setOpenSelect] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [placeHolder, setPlaceHolder] = useState("Escreva sua mensagem em detalhes...");  
  const [assunto, setAssunto] = useState("");
  const [lista, setLista] = useState<componenteList[]>([]);
  
    const handleAddBilhete = () => {
        setOpenSelect(true);
    };

    const handleNovoBilhete = () => {
        setOpenSelect(false);
        setShowForm(true); 
    };

    const handleEnviar = () => {
        if (!assunto) {
        alert("Preencha o assunto");
        return;
        }
        console.log("Enviando documento:", assunto);
        setShowForm(false);    
        setAssunto("");    
    };

    const handleCancelar = () => {
    setShowForm(false);
    setAssunto("");
  };

  useEffect(() => {
      const loadUser = async () => {
          const token = await AsyncStorage.getItem("token");
          if(token){
              const decoded: any = jwtDecode(token);
              setUserRole(decoded.role);
            }
        };
        loadUser();
        setUserRole("morador");
    }, []);

    //FUNÇÃO PARA FILTRAR LISTA DE ACORDO COM CADA ROLE
    useEffect(() => {
        if (userRole) {
        setLista(filtrarPorRole(listadoMock, userRole));
    }
}, [userRole]); 

    function handleDelete(id: string) {
        setLista((prev) => prev.filter((i) => i.id !== id));
    }


if (!userRole) {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
}

    const podeAdicionar = userRole !== "porteiro";
    const secoes = agruparMes(lista);

    
  return (
    <View style={styles.container}>
 
      <HeaderFuncApp
        title="Bilhetes"
        subtitle={podeAdicionar ? "Adicione novos bilhetes" : "Visualização"}
        iconLeft={<Feather name="arrow-left" size={24} color="#fff" />}
        onPressLeft={() => router.push('/Home/Home')}
        iconRight={
          podeAdicionar ? (
            <Feather name="plus" size={24} color="#fff" />
          ) : <Feather name="file-text" size={24} color="#fff" />
        }
        onPressRight={podeAdicionar ? onAdicionarBilhete : undefined}
      />
 
      <View style={styles.centerContainer}>
        <SectionList
          style={styles.ContainerFundo}
          contentContainerStyle={styles.ContainerFundoContent}
          sections={secoes}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.ContainerTextData}>
              <Text style={styles.TextDataMain}>{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.Listado}
              onPress={() => setItemSelecionado(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.ContainerIcon, { backgroundColor: item.cor }]}>
                <Feather
                  name={item.icone as any}
                  size={24}
                  style={[styles.icon, { color: item.corIcon }]}
                />
              </View>
 
              <View style={styles.ContainerBody}>
                <Text style={styles.TextTitle}>{item.titulo}</Text>
                <Text style={styles.TextDesc}>{item.subtitulo}</Text>
              </View>
 
              <View style={styles.ContainerData}>
                <Text style={styles.TextData}>{item.data}</Text>
                <Text style={styles.TextData}>{item.hora}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
 
      <DetalhesModal
        item={itemSelecionado}
        onClose={() => setItemSelecionado(null)}
        onDelete={
          podeAdicionar && itemSelecionado
            ? () => handleDelete(itemSelecionado.id)
            : undefined
        }
      />
 
        <BottomNav />

    </View>
  );
}