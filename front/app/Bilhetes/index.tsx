import { useState, useEffect } from "react";
import { View, SectionList, Text, TouchableOpacity, ActivityIndicator, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, } from "react-native";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { componenteList, DetalhesModal, agruparMes, coresPorIcone, coresPorCategoria, } from "@/components/Listado";
import { styles } from "@/screens/Bilhetes/bilhetes.styles";
import { jwtDecode } from "jwt-decode";
import { storage } from "@/utils/storage";
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

      setLista(formatados);
    } catch (error) {
      console.log("Erro ao carregar bilhetes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole) {
      carregarBilhetes();
    }
  }, [userRole]);

  const [tipoCondomino, setTipoCondominio] = useState<"PREDIO" | "HORIZONTAL" | null>(null);
  const [unidade, setUnidade] = useState("");
  const [bloco, setBloco] = useState<string | null>(null);
  const [andar, setAndar] = useState("");

  // RESIDENCIAL-HORIZONTAL
  const [numero, setNumero] = useState("");
  const [prefixo, setPrefixo] = useState("");

  // DEFINE QUEM É O USUÁRIO
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedProfile = await storage.getItemAsync("user_perfil");
        if (storedProfile) {
          setUserRole(storedProfile.toLowerCase() as any);
        }

        const token = await storage.getItemAsync("user_token");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        
        if (!storedProfile) {
          let role = "morador";
          const roleBruta = decoded.role || (decoded.roles && decoded.roles[0]) || decoded.perfil || decoded.roles;
          
          if (roleBruta) {
            if (Array.isArray(roleBruta)) {
              role = roleBruta[0].toLowerCase();
            } else {
              role = roleBruta.toString().toLowerCase();
            }
          }
          setUserRole(role as any);
        }
        
        setNomeUsuario(decoded.nome || "");
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
        const token = await storage.getItemAsync("user_token");
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
    } catch (error: any) {
      console.log("Erro ao deletar bilhete:", error);
      const msg = error.response?.data?.mensagem || error.message || "Erro desconhecido";
      alert(`Erro ao deletar bilhete: ${msg}`);
    }
  }

  // DEFINIÇÕES DE PERMISSÃO
  const podeAdicionar = userRole?.toLowerCase() === "morador";
  const podeDeletar = userRole?.toLowerCase() === "morador" || userRole?.toLowerCase() === "sindico" || userRole?.toLowerCase() === "admin";
  const secoes = agruparMes(lista);

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
          podeAdicionar ? () => setModalAberta(true) : undefined
        }
      />
      <View style={styles.centerContainer}>
        {loading ? (
            <ActivityIndicator size="large" color={palette.accent} style={{ marginTop: 20 }} />
        ) : lista.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                <Feather name="info" size={48} color={palette.gray} />
                <Text style={{ marginTop: 10, color: palette.gray, fontSize: 16 }}>Nenhum bilhete encontrado.</Text>
            </View>
        ) : (
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
        )}
      </View>

      {/* ABRIR DETALHES */}
      <DetalhesModal
        item={itemSelecionado}
        onClose={() => setItemSelecionado(null)}
        onDelete={
          podeDeletar && itemSelecionado
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
    </View>
  );
}
