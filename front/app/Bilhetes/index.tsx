import { useState, useEffect } from "react";
import { View, SectionList, Text, TouchableOpacity, ActivityIndicator, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, } from "react-native";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { componenteList, listadoMock, DetalhesModal, agruparMes, coresPorIcone, coresPorCategoria, } from "@/components/Listado";
import { styles } from "@/screens/Bilhetes/bilhetes.styles";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { palette } from "@/theme/colors";
import bilheteService from "@/services/bilheteService";

// FAZ DISTINÇÃO DE QUAL USUÁRIO ESTARÁ UTILIZANDO
interface JwtPayload {
  role: "sindico" | "morador" | "admin" | "porteiro";
  sub: string;
  tipoCond: "PREDIO" | "HORIZONTAL";
  unidade?: string;
  bloco?: string;
  andar?: string;
  numero?: string;
  prefixo?: string;
}

// FUNÇÃO PARA FILTRAR LISTA DE ACORDO COM A ROLE
function filtrarPorRole(
  items: componenteList[],
  role: "sindico" | "morador" | "admin" | "porteiro"
): componenteList[] {
  if (role === "porteiro") {
    return items.filter((item) => item.icone === "user");
  }
  return items;
}

interface Props {
  onAdicionarBilhete?: () => void;
}

export default function BilhetesScreen({ onAdicionarBilhete }: Props) {
  const [userRole, setUserRole] = useState<"sindico" | "morador" | "admin" | "porteiro" | null>(null);
  const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [lista, setLista] = useState<componenteList[]>([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [placeHolder] = useState("Escreva sua mensagem em detalhes...");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingdados, setLoadingDados] = useState(false);
  const [assunto, setAssunto] = useState("");

  const carregarBilhetes = async () => {
    setLoading(true);
    try {
      const data = await bilheteService.listarBilhetes();
      const formatados: componenteList[] = data.map((b) => ({
        id: b.id.toString(),
        titulo: b.assunto,
        subtitulo: b.mensagem,
        descricao: b.mensagem,
        autor: b.autor,
        data: new Date(b.data_criacao).toLocaleDateString("pt-BR"),
        hora: b.hora_criacao,
        icone: "user",
        mesAno: new Date(b.data_criacao).toLocaleDateString("pt-BR", {
          month: "long",
          year: "numeric",
        }),
        cor: coresPorCategoria[b.categoria as keyof typeof coresPorCategoria] || coresPorCategoria["bilhete"],
        corIcon: coresPorIcone[b.categoria as keyof typeof coresPorIcone] || coresPorIcone["bilhete"],
        categoria: b.categoria,
      }));

      if (userRole === "morador") {
        setLista(formatados.filter((item) => item.autor === nomeUsuario));
      } else {
        setLista(formatados);
      }
    } catch (error) {
      console.log("Erro ao carregar bilhetes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole && nomeUsuario) {
      carregarBilhetes();
    }
  }, [userRole, nomeUsuario]);

  const [tipoCondomino, setTipoCondominio] = useState<"PREDIO" | "HORIZONTAL" | null>(null);
  const [unidade, setUnidade] = useState("");
  const [bloco, setBloco] = useState<string | null>(null);
  const [andar, setAndar] = useState("");

  // RESIDENCIAL-HORIZONTAL
  const [numero, setNumero] = useState("");
  const [prefixo, setPrefixo] = useState("");

        //DEFINE QUEM É O USUÁRIO
    useEffect(() => {
      const loadUser = async () => {
        try {
          const token = await AsyncStorage.getItem("token");

          if (!token) {
            console.log("Token não encontrado");
            return;
          }

          const decoded: any = jwtDecode(token);

          console.log("ROLE:", decoded.role);

          setUserRole(decoded.role);
          setNomeUsuario(decoded.nome ?? decoded.sub);

        } catch (error) {
          console.log("Erro ao decodificar token:", error);
        }
      };

      loadUser();
    }, []);


  // CARREGA DADOS DO MODAL A PARTIR DO JWT
  useEffect(() => {
    if (!modalAberta) return;

    const carregarDados = async () => {
      setLoadingDados(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode<JwtPayload>(token);
          setTipoCondominio(decoded.tipoCond);

          if (decoded.tipoCond === "PREDIO") {
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

    carregarDados();
  }, [modalAberta]);

  // CRIA UM NOVO BILHETE COM CATEGORIA DEFINIDA AUTOMATICAMENTE
  function criarBilhete(dados: { assunto: string; mensagem: string }): componenteList {
    return {
      id: Date.now().toString(),
      titulo: dados.assunto,
      subtitulo: dados.mensagem,
      descricao: dados.mensagem,
      autor: "Morador 1", // MUDAR PARA UTILIZAR O NOME QUE VEM DA FUNÇÃO DO PERFIL
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      icone: "user",
      mesAno: new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
      cor: coresPorCategoria["bilhete"],
      corIcon: coresPorIcone["bilhete"],
      categoria: "bilhete",
    };
  }

  // ENVIA O NOVO BILHETE
  const handleEnviar = async () => {
  if (!assunto) {
    alert("Preencha o assunto");
    return;
  }
  if (!mensagem) {
    alert("Preencha a mensagem");
    return;
  }

  // FORMATO QUE OS DADOS DEVERÃO SER ENVIADOS PARA O BACKEND
  const payload =
    tipoCondomino === "PREDIO"
      ? {
          assunto,
          mensagem,
          unidade,
          bloco,
          andar: parseInt(andar),
          categoria: "bilhete",
          hora_criacao: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      : {
          assunto,
          mensagem,
          numero,
          prefixo,
          categoria: "bilhete",
          hora_criacao: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

  try {
    await bilheteService.criarBilhetes(payload as any);
    await carregarBilhetes();
    handleFecharModal();
  } catch (error) {
    console.log("Erro ao enviar bilhete:", error);
    alert("Erro ao enviar bilhete");
  }
  };

  function handleFecharModal() {
  setModalAberta(false);
  setAssunto("");
  setMensagem("");
  }

  async function handleDelete(id: string) {
  try {
    await bilheteService.deletarBilhete(parseInt(id));
    await carregarBilhetes();
    setItemSelecionado(null);
  } catch (error) {
    console.log("Erro ao deletar bilhete:", error);
    alert("Erro ao deletar bilhete");
  }
  }



  // DEFINE QUEM NÃO PODE ADICIONAR
  const podeAdicionar = userRole === "morador";
  const secoes = agruparMes(lista.filter((i) => i.categoria === "bilhete"));

  return (
    <View style={styles.container}>
      <HeaderFuncApp
        title="Bilhetes"
        subtitle={podeAdicionar ? "Adicione novos bilhetes" : "Visualização"}
        iconLeft={<Feather name="arrow-left" size={24} color="#fff" />}
        onPressLeft={() => router.push("/home")}
        iconRight={
          podeAdicionar ? (
            <Feather name="plus" size={24} color="#fff" />
          ) : (
            <Feather name="inbox" size={24} color="#fff" />
          )
        }
        onPressRight={
          podeAdicionar
            ? () => setModalAberta(true)
            : () => console.log("Modo visualização do porteiro")
        }
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
        onDelete={
          podeAdicionar && itemSelecionado
            ? () => handleDelete(itemSelecionado.id)
            : undefined
        }
      />

      {/* ADICIONAR BILHETESS */}
      <Modal
        visible={modalAberta}
        transparent
        animationType="slide"
        onRequestClose={handleFecharModal}
      >
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
          <Pressable style={styles.overlay} onPress={handleFecharModal}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
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
                      style={[styles.input, styles.inputAssunto]}
                      placeholder="Digite o assunto"
                      placeholderTextColor={palette.gray}
                      value={assunto}
                      onChangeText={setAssunto}
                      multiline
                      textAlignVertical="top"
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

                  {/* ENVIO DE ARQUIVO  QUE É OPCIONAL */}
                  <TouchableOpacity style={styles.arquivoBotao}>
                    <Text style={styles.arquivoBotaoText}>Enviar Arquivo (Opcional)</Text>
                    <Feather name="upload" size={24} color={palette.accent} />
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
{/* 
       ADICIONAR OS BILHETESS 
      <Modal
        visible={modalAberta}
        transparent
        animationType="slide"
        onRequestClose={handleFecharModal}
      >
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
          <Pressable style={styles.overlay} onPress={handleFecharModal}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
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


                ENVIO DOS ARQUIVOS E QUE SERÁ OPCIONAL 
                <TouchableOpacity style={styles.arquivoBotao}>
                  <Text style={styles.arquivoBotaoText}>Enviar Arquivo (Opcional)</Text>
                  <Feather name="upload" size={24} color={palette.accent}/>
                </TouchableOpacity>

                  CAMPO DE MENSAGEM 
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

                   ENVIO DE ARQUIVO  QUE É OPCIONAL 
                  <TouchableOpacity style={styles.arquivoBotao}>
                    <Text style={styles.arquivoBotaoText}>Enviar Arquivo (Opcional)</Text>
                    <Feather name="upload" size={24} color={palette.accent} />
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
    </Modal> */}
    
    </View>
  );
}