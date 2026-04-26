import { useState, useEffect } from "react";
import { View, SectionList, Text, TouchableOpacity, ActivityIndicator, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal } from "react-native";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { componenteList, listadoMock, DetalhesModal, agruparMes } from "@/components/Listado";
import { styles } from "@/screens/Bilhetes/bilhetes.styles";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { BottomNav } from "@/components/BottomNav";
import { BlurView } from "expo-blur";
import { palette } from "@/theme/colors";

//FAZ DISTINÇÃO DE QUAL USUÁRIO ESTARÁ UTILIZANDO
interface JwtPayload {
  role: "sindico" | "morador" | "administrador" | "porteiro";
  sub: string;
  tipoCond:"PREDIO" | "HORIZONTAL";
  unidade?: string;
  bloco?: string;
  andar?: string;
  numero?: string;
  prefixo?: string;
}

//FUNÇÃO PARA PUXAR PELO JWT
function filtrarPorRole(items: componenteList[], role: "sindico" | "morador" | "administrador" | "porteiro"): componenteList[] {
    if (role === "porteiro"){
        return items.filter((item) => item.icone === "user");
    }
    return items;
}


interface Props {
    onAdicionarBilhete?: () => void;
}


export default function BilhetesScreen({ onAdicionarBilhete } : Props) {
  const [userRole, setUserRole] = useState<"sindico" | "morador" | "administrador" | "porteiro" | null>(null); //PARA TESTE SÓ TROCAR O VALOR DO PARENTESES
  const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);
  const [lista, setLista] = useState<componenteList[]>([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [placeHolder, setPlaceHolder] = useState("Escreva sua mensagem em detalhes...");
  const [mensagem, setMensagem] = useState("");
  const [loadingdados, setLoadingDados] = useState(false);
  const [assunto, setAssunto] = useState("");
  //DIFERENCIAÇÃO DE TIPOS DAS UNIDADES
  const [tipoCondomino, setTipoCondominio] = useState<"PREDIO" | "HORIZONTAL" | null>(null);
  const [unidade, setUnidade] = useState("");
  const [bloco, setBloco] = useState<string | null>(null);
  const [andar, setAndar] = useState("");
  //RESIDENCIAL-HORIZONTAL
  const [numero, setNumero] = useState("");
  const [prefixo, setPrefixo] = useState("");

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
    await AsyncStorage.setItem(
      "token",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibW9yYWRvciIsInN1YiI6IjEiLCJ0aXBvQ29uZCI6IlBSRURJTyIsInVuaWRhZGUiOiIxMDIiLCJibG9jbyI6IkEiLCJhbmRhciI6IjEifQ.7SfSLuJpmfViDRimEtyrryS3N8CiwSufqm296xUgwdg"
    );
  };

  salvarToken();
}, []);
 */

  //FUNÇÕES PARA O MODAL

  useEffect(() => {
    if (!modalAberta) return;
    const loadingdados = async () => {
      setLoadingDados(true);
      try{
        const token = await AsyncStorage.getItem("token");
        if(token) {
          const decoded = jwtDecode<JwtPayload>(token);
          setTipoCondominio(decoded.tipoCond);

          if (decoded.tipoCond === "PREDIO"){
            setUnidade(decoded.unidade ?? "");
            setBloco(decoded.bloco ?? null);
            setAndar(decoded.andar ?? "");
          } else {
            setNumero(decoded.numero ?? "");
            setPrefixo(decoded.prefixo ?? "Casa/Lote");
          }
        }
      } finally {
        setLoadingDados(false);
      }
    };
    loadingdados();
  }, [modalAberta]);

//FUNÇÕES DO MODAL      

    const handleEnviar = () => {
        if (!assunto) {
        alert("Preencha o assunto");
        return;
        } if (!mensagem){
        alert("Preencha a mensagem");
        return;
        }
        //FORMATO QUE OS DADOS DEVERÃO SER ENVIADOS
        const payload = 
            tipoCondomino === "PREDIO"
              ? { assunto, mensagem, unidade, bloco, andar }
              : { assunto, mensagem, numero, prefixo };

        console.log("Enviando bilhete:", payload);
        setAssunto("");    
        handleFecharModal();
        
        if (!userRole) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
              </View>
            );
        }
      }
 
    function handleFecharModal() {
    setModalAberta(false);
    setAssunto("");
    setMensagem("");
  }

    function handleDelete(id: string) {
        setLista((prev) => prev.filter((i) => i.id !== id));
    }

    //DEFINIR QUEM NÃO PODERÁ ADICIONAR
    const podeAdicionar = userRole !== "porteiro";
    const secoes = agruparMes(lista);

    
  return (
    <View style={styles.container}>

      <HeaderFuncApp
        title="Bilhetes"
        subtitle={podeAdicionar ? "Adicione novos bilhetes" : "Visualização"}
        iconLeft={<Feather name="arrow-left" size={24} color="#fff" />}
        onPressLeft={() => router.push('/Home/Home')}
        iconRight={podeAdicionar ? (
          <Feather name="plus" size={24} color="#fff" />
        ) : <Feather name="file-text" size={24} color="#fff" />}
        onPressRight={podeAdicionar ? () => setModalAberta(true) :  () => console.log("Modo visualização do porteiro")}
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

      {/* ABRIR DETALHES */}
      <DetalhesModal
        item={itemSelecionado}
        onClose={() => setItemSelecionado(null)}
        onDelete={podeAdicionar && itemSelecionado
          ? () => handleDelete(itemSelecionado.id)
          : undefined} 
        />

      {/* ADICIONAR OS BILHETESS */}
      <Modal
        visible={modalAberta}
        transparent
        animationType="slide"
        onRequestClose={handleFecharModal}
      >
        <BlurView intensity={40} tint="dark" style={{flex: 1}}>
          <Pressable style={styles.overlay} onPress={handleFecharModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <Pressable
              style={styles.card}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.HeaderCard}>
                <Text style={styles.tituloCard}>Novo Bilhete</Text>
                <TouchableOpacity onPress={handleFecharModal}>
                  <Feather name="x" size={20} color={palette.darkGray} />
                </TouchableOpacity>
              </View>

              <View style={styles.Divisao} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                <Text style={styles.labelCard}>Informações da Unidade</Text>

                {loadingdados ? (
                  <ActivityIndicator
                    size="small"
                    color={palette.accent}
                    style={{ marginVertical: 8 }} 
                    />
                ) : tipoCondomino === "PREDIO" ? (
                    <View style={styles.infoUnidadeContainer}>
                      {unidade ? (
                        <View style={[styles.InputDesabilitadoFull, { flex: 1 }]}>
                          <Text style={styles.InputDesabilitadoText}>Nª Unidade: {unidade}</Text>
                        </View>
                      ) : null}

                      <View style={styles.rowcard}>
                      {bloco ? (
                        <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                          <Text style={styles.InputDesabilitadoText}>Bloco: {bloco}</Text>
                        </View>
                      ) : null}

                      {andar ? (
                        <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                          <Text style={styles.InputDesabilitadoText}>Andar: {andar}</Text>
                        </View>
                      ) : null}
                      </View>
                     </View>
                  ) : (
                  <View style={styles.InputDesabilitado}>
                    <Text style={styles.InputDesabilitadoText}>
                      {prefixo} : {numero}
                    </Text>
                  </View>
                )}

                {/* CAMPO DE ASSUNTO */}
                <View style={styles.containerMensagem}>
                  <Text style={styles.labelMensagem}>Assunto</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o assunto"
                    value={assunto}
                    onChangeText={setAssunto}
                    />
                    </View> 

                {/* CAMPO DE MENSAGEM */}
                <View style={styles.containerMensagem}>
                  <Text style={styles.labelMensagem}>Mensagem</Text>
                  <TextInput
                    style={[styles.input, styles.inputMensagem]}
                    placeholder={placeHolder}
                    placeholderTextColor={palette.gray}
                    value={mensagem}
                    onChangeText={setMensagem}
                    multiline
                    textAlignVertical="top"
                    />
                    </View>

                {/* ENVIO DOS ARQUIVOS E QUE SERÁ OPCIONAL */}
                <TouchableOpacity style={styles.arquivoBotao}>
                  <Text style={styles.arquivoBotaoText}>Enviar Arquivo (Opcional)</Text>
                  <Feather name="upload" size={24} color={palette.accent}/>
                </TouchableOpacity>

                <View style={styles.botoes}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={handleEnviar}>
                    <Text style={styles.btnSalvarText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnCancelar} onPress={handleFecharModal}>
                    <Text style={styles.btnCancelarText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </BlurView>
    </Modal>
    
    <BottomNav/>
    </View>
  );
}