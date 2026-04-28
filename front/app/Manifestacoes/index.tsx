import HeaderFuncApp from "@/components/HeaderFunctions";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, SectionList, Text } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { componenteList, listadoMock, DetalhesModal, agruparMes } from "@/components/Listado";
import { router } from "expo-router";
import { styles } from "@/screens/Manifestacoes/manifestacao";


//FAZ DISTINÇÃO DE QUAL USUÁRIO ESTARÁ UTILIZANDO
interface JwtPayload {
  role: "sindico" | "morador" | "administrador" ;
  sub: string;
  tipoCond:"PREDIO" | "HORIZONTAL";
  unidade?: string;
  bloco?: string;
  andar?: string;
  numero?: string;
  prefixo?: string;
}

//FUNÇÃO PARA PUXAR PELO JWT
function filtrarPorRole(items: componenteList[], role: "sindico" | "morador" | "administrador"): componenteList[] {
    return items;
}

interface Props {
    onAdicionarManifestacao?: () => void;
}



export default function ManifestacoesScreen(){

    const [userRole, setUserRole] = useState<"sindico" | "morador" | "administrador" | null>(null); //PARA TESTE SÓ TROCAR O VALOR DO PARENTESES
    const [lista, setLista] = useState<componenteList[]>([]);
    const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);
    const [modalAberta, setModalAberta] = useState(false);

        //DEFINE QUEM É O USUÁRIO
            useEffect(() => {
                const loadUser = async () => {
                    const token = await AsyncStorage.getItem("token");
                    if(token){
                        const decoded: any = jwtDecode(token);
                        console.log("ROLE:", decoded.role);
                        setUserRole(decoded.role);
                    }
                };
                loadUser();
                // setUserRole("morador"); //- DESCOMENTAR PARA FORÇAR SER PERFIL DE MORADOR
            }, []);
        
            //FUNÇÃO PARA FILTRAR LISTA DE ACORDO COM CADA ROLE
            useEffect(() => {
                if (userRole) {
                setLista(filtrarPorRole(listadoMock, userRole));
            }
        }, [userRole]); 
        

        //DESCOMENTAR PARA FAZER TESTE COM OS MORADORES -- jwt.io
        /* useEffect(() => {
        const salvarToken = async () => {
            await AsyncStorage.clear();
            await AsyncStorage.setItem(
            "token",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInJvbGUiOiJhZG1pbmlzdHJhZG9yIn0.mEiv0QPjkvcWr-Io9iMj4osKvmwVi7bT-W4_E0khNmU"
            );
        };

        salvarToken();
        }, []); */



        
        const secoes = agruparMes(lista);

    return(
        <View style={styles.container}>
            <HeaderFuncApp
                title="Manifestações"
                subtitle="Reclamações ou Sugestões"
                iconLeft={<Feather name="arrow-left" size={24} color="#fff" />}
                onPressLeft={() => router.push("/Home/Home")}
                iconRight={<Feather name="plus" size={24} color="#fff" />}
                onPressRight={() => setModalAberta(true)}
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
                        <Feather name={item.icone as any} size={24} style={[styles.icon, { color: item.corIcon }]}/>
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
        </View>
     );      
}