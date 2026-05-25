import HeaderFuncApp from "@/components/HeaderFunctions";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, SectionList, Text, TextInput, Modal, Pressable, KeyboardAvoidingView, ScrollView, ActivityIndicator, Platform } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { storage } from "@/utils/storage";
import { jwtDecode } from "jwt-decode";
import { componenteList, agruparMes, coresPorCategoria, coresPorIcone, StatusSolicitacao } from "@/components/Listado";
import { router } from "expo-router";
import { styles } from "@/screens/Manifestacoes/manifestacao";
import { BlurView } from "expo-blur";
import { palette } from "@/theme/colors";
import { Picker } from "@react-native-picker/picker";   
import manifestacaoService from "@/services/manifestacaoService";

//FAZ DISTINÇÃO DE QUAL USUÁRIO ESTARÁ UTILIZANDO
interface JwtPayload {
  role: "sindico" | "morador" | "admin" | "porteiro";
  sub: string;
  nome: string;
  tipoCond:"PREDIO" | "HORIZONTAL";
  unidade?: string;
  bloco?: string;
  andar?: string;
  numero?: string;
  prefixo?: string;
}

//FUNÇÃO PARA PUXAR PELO JWT
function filtrarPorRole(items: componenteList[], role: "sindico" | "morador" | "admin" | "porteiro"): componenteList[] {
    return items;
}

interface Props {
    onAdicionarManifestacao?: () => void;
}

export default function ManifestacoesScreen({ onAdicionarManifestacao }: Props){

    const [userRole, setUserRole] = useState<"sindico" | "morador" | "admin" | "porteiro" | null>(null);
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [lista, setLista] = useState<componenteList[]>([]);
    const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);
    const [modalAberta, setModalAberta] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingdados, setLoadingDados] = useState(false);
    const [assunto, setAssunto] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [comentario, setComentario] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState<StatusSolicitacao>("PENDENTE");
    const [modalStatusAberta, setModalStatusAberta] = useState(false);
    const [confirmExclusao, setConfirmExclusao] = useState(false);
    
    //DIFERENCIAÇÃO DE TIPOS DAS UNIDADES
    const [tipoCondomino, setTipoCondominio] = useState<"PREDIO" | "HORIZONTAL" | null>(null);
    const [unidade, setUnidade] = useState("");
    const [bloco, setBloco] = useState<string | null>(null);
    const [andar, setAndar] = useState("");
    const [numero, setNumero] = useState("");
    const [prefixo, setPrefixo] = useState("");
    
    //DEFINE QUEM É O USUÁRIO
    useEffect(() => {
        const loadUser = async () => {
            try {
                // Tenta pegar primeiro o perfil direto do storage
                const storedProfile = await storage.getItemAsync("user_perfil");
                if (storedProfile) {
                    setUserRole(storedProfile.toLowerCase() as any);
                }

                const token = await storage.getItemAsync("user_token");
                if (!token) return;

                const decoded: any = jwtDecode(token);
                console.log("JWT DECODED:", decoded);
                
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
                    
    const carregarManifestacoes = async () => {
        console.log("INICIANDO CARREGAMENTO DE MANIFESTACOES PARA ROLE:", userRole);
        setLoading(true);
        try {
            const data = await manifestacaoService.listarManifestacoes();
            console.log("DADOS RECEBIDOS DA API (QTD):", data.length);
            const formatados: componenteList[] = data.map((m) => {
                return {
                    id: m.id.toString(),
                    titulo: m.assunto,
                    subtitulo: m.status.charAt(0).toUpperCase() + m.status.slice(1).replace("_", " "),
                    descricao: m.mensagem,
                    autor: m.autor,
                    data: new Date(m.data_criacao).toLocaleDateString('pt-BR'),
                    hora: m.hora_criacao,
                    mesAno: new Date(m.data_criacao).toLocaleDateString('pt-BR', { month: "long", year: "numeric" }),
                    icone: "file-text",
                    corIcon: coresPorIcone['solicitacao'],
                    cor: coresPorCategoria['solicitacao'],
                    categoria: 'solicitacao',
                    status: m.status as any,
                    unidade: m.unidade,
                    bloco: m.bloco,
                    andar: m.andar?.toString(),
                    numero: m.numero,
                    prefixo: m.prefixo,
                    movimentacoes: m.movimentacoes?.map(mov => ({
                        titulo: mov.titulo,
                        comentario: mov.comentario,
                        status: mov.status as any,
                        data: new Date(mov.data_movimentacao).toLocaleDateString('pt-BR'),
                        hora: new Date(mov.data_movimentacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    })) || [],
                };
            });
            setLista(formatados);
        } catch (error) {
            console.error("ERRO CRITICO AO CARREGAR MANIFESTACOES:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userRole) carregarManifestacoes();
    }, [userRole]);

    useEffect(() => {
        if (!modalAberta) return;
        const loadUnidadeData = async () => {
            setLoadingDados(true);
            try{
                const token = await storage.getItemAsync("user_token");
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
        loadUnidadeData();
    }, [modalAberta]);

        async function atualizarManifestacao() {
            if (!itemSelecionado) return;
            try {
                await manifestacaoService.atualizarManifestacao(parseInt(itemSelecionado.id), {
                    status: statusSelecionado,
                    comentario: comentario || undefined,
                    autor_role: userRole ?? undefined
                });
                await carregarManifestacoes();
                setModalStatusAberta(false);
                setComentario("");
            } catch (error: any) {
                console.error("ERRO AO ATUALIZAR STATUS:", error);
                const msg = error.response?.data?.mensagem || error.message || "Erro desconhecido";
                alert(`Erro ao atualizar status: ${msg}`);
            }
        }

    const handleEnviar = async () => {
        if (!assunto || !mensagem) {
            alert("Preencha todos os campos");
            return;
        }
        const payload = tipoCondomino === "PREDIO"
            ? { assunto, mensagem, unidade, bloco, andar: andar ? parseInt(andar) : undefined, categoria: 'solicitacao', hora_criacao: new Date().toLocaleTimeString('pt-BR', { hour: "2-digit", minute: "2-digit" }) }
            : { assunto, mensagem, numero, prefixo, categoria: 'solicitacao', hora_criacao: new Date().toLocaleTimeString('pt-BR', { hour: "2-digit", minute: "2-digit" }) };

        try {
            await manifestacaoService.criarManifestacao(payload as any);
            await carregarManifestacoes();
            handleFecharModal();
        } catch (error) {
            console.log("Erro ao enviar manifestação:", error);
            alert("Erro ao enviar manifestação");
        }
    };

    function handleFecharModal(){
        setModalAberta(false);
        setAssunto("");
        setMensagem("");
    }

    const handleDeleteConfirmado = async () => {
        if (!itemSelecionado) return;
        if (!confirmExclusao) {
            setConfirmExclusao(true);
            return;
        }
        try {
            await manifestacaoService.deletarManifestacao(parseInt(itemSelecionado.id));
            await carregarManifestacoes();
            setConfirmExclusao(false);
            setModalStatusAberta(false);
            setItemSelecionado(null);
        } catch (error) {
            console.log("Erro ao deletar manifestação:", error);
            alert("Erro ao excluir manifestação");
        }
    };

    const secoes = agruparMes(lista);

    return(
        <View style={styles.container}>
            <HeaderFuncApp
                title="Manifestações"
                subtitle="Reclamações ou Sugestões"
                iconLeft={<Feather name="arrow-left" size={24} color="#fff" />}
                onPressLeft={() => router.push("/home")}
                iconRight={userRole !== "porteiro" ? <Feather name="plus" size={24} color="#fff" /> : undefined}
                onPressRight={userRole !== "porteiro" ? () => setModalAberta(true) : undefined}
            />
            <View style={styles.centerContainer}>
                
                {loading ? (
                    <ActivityIndicator size="large" color={palette.accent} style={{ marginTop: 20 }} />
                ) : lista.length === 0 ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Feather name="info" size={48} color={palette.gray} />
                        <Text style={{ marginTop: 10, color: palette.gray, fontSize: 16 }}>Nenhuma manifestação encontrada.</Text>
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
                                onPress={() => { 
                                    setItemSelecionado(item);
                                    setStatusSelecionado((item.status?.toUpperCase() as StatusSolicitacao) ?? "PENDENTE");
                                    setModalStatusAberta(true);
                                }}
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
                )}
            </View>

            <Modal
                visible={modalStatusAberta}
                transparent
                animationType="fade"
                onRequestClose={() => setModalStatusAberta(false)}
            >   
                <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
                    <Pressable style={styles.overlay} onPress={() => setModalStatusAberta(false)}>
                        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardScrollContent}>
                                <Text style={styles.tituloCard}>{itemSelecionado?.titulo}</Text>
                                <Text style={styles.labelMensagem}>Descrição</Text>
                                <Text style={styles.TextComent}>{itemSelecionado?.descricao}</Text>
                                <Text style={styles.labelCard}>Informações da Unidade</Text>

                                {itemSelecionado?.tipoCond === "PREDIO" ? (
                                    <View style={styles.infoUnidadeContainer}>
                                        {itemSelecionado.unidade && (
                                            <View style={[styles.InputDesabilitadoFull, { flex: 1 }]}>
                                                <Text style={styles.InputDesabilitadoText}>Nº Unidade: {itemSelecionado.unidade}</Text>
                                            </View>
                                        )}
                                        <View style={styles.rowcard}>
                                            {itemSelecionado.bloco && (
                                                <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                                                    <Text style={styles.InputDesabilitadoText}>Bloco: {itemSelecionado.bloco}</Text>
                                                </View>
                                            )}
                                            {itemSelecionado.andar && (
                                                <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                                                    <Text style={styles.InputDesabilitadoText}>Andar: {itemSelecionado.andar}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.InputDesabilitado}>
                                        <Text style={styles.InputDesabilitadoText}>{itemSelecionado?.prefixo ?? "Casa/Lote"}: {itemSelecionado?.numero}</Text>
                                    </View>
                                )}

                                <View style={styles.Divisao} />
                                <Text style={styles.labelMensagem}>Histórico</Text>
                                {itemSelecionado?.movimentacoes?.map((mov, index) => (
                                    <View key={index} style={{ marginBottom: 12 }}>
                                        <Text style={styles.Title}>{mov.titulo}</Text>
                                        {mov.comentario && <Text style={styles.TextComent}>{mov.comentario}</Text>}
                                        <Text style={styles.TextComent}>{mov.data} {mov.hora ? `às ${mov.hora}` : ""}</Text>
                                    </View>
                                ))} 

                                {itemSelecionado && (userRole === 'morador' || userRole === 'sindico' || userRole === 'admin') && (
                                    <TouchableOpacity
                                        style={[styles.ModalBotaoExcluir, confirmExclusao && styles.ModalBotaoExcluirConfirmando]}
                                        onPress={handleDeleteConfirmado}
                                    >
                                        <Feather name={confirmExclusao ? "alert-circle" : "trash"} size={16} color="#fff" />   
                                        <Text style={styles.ModalBotaoExcluirTexto}>{confirmExclusao ? "Confirmar exclusão" : "Excluir"}</Text>
                                    </TouchableOpacity>
                                )}

                                {(userRole === "sindico" || userRole === "admin") && (
                                    <>
                                        <View style={styles.Divisao} />
                                        <View style={styles.pickerView}>
                                            <Text style={styles.labelMensagem}>Atualizar status</Text>
                                            <View style={{ borderWidth: 1, borderColor: palette.accent, backgroundColor: "#F5F5F5", borderRadius: 8, overflow: "hidden" }}>
                                                <Picker
                                                    style={styles.picker}
                                                    selectedValue={statusSelecionado}
                                                    onValueChange={(itemValue) => setStatusSelecionado(itemValue as StatusSolicitacao)}
                                                    dropdownIconColor="#000"
                                                >
                                                    <Picker.Item label="Pendente" value="PENDENTE" />
                                                    <Picker.Item label="Em andamento" value="EM_ANDAMENTO" />
                                                    <Picker.Item label="Aguardando" value="AGUARDANDO" />
                                                    <Picker.Item label="Concluído" value="CONCLUIDO" />
                                                    <Picker.Item label="Encerrado" value="ENCERRADO" />
                                                </Picker>
                                            </View>
                                        </View>
                                        <Text style={styles.labelMensagem}>Comentário</Text>
                                        <TextInput
                                            placeholder="Comentário opcional"
                                            value={comentario}
                                            onChangeText={setComentario}
                                            style={[styles.input, styles.inputMensagem]}
                                            multiline
                                        />
                                        <View style={styles.botoes}>
                                            <TouchableOpacity style={styles.btnSalvar} onPress={() => atualizarManifestacao()}>
                                                <Text style={styles.btnSalvarText}>Salvar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalStatusAberta(false)}>
                                                <Text style={styles.btnCancelarText}>Cancelar</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>     
                                )}
                            </ScrollView>                                    
                        </Pressable>
                    </Pressable>
                </BlurView>
            </Modal>

            <Modal visible={modalAberta} transparent animationType="slide" onRequestClose={handleFecharModal}>
                <BlurView intensity={40} tint="dark" style={{flex: 1}}>
                    <Pressable style={styles.overlay} onPress={handleFecharModal}>
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
                            <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                                <View style={styles.HeaderCard}>
                                    <Text style={styles.tituloCard}>Nova Manifestação</Text>
                                    <TouchableOpacity onPress={handleFecharModal}>
                                        <Feather name="x" size={20} color={palette.darkGray} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.Divisao} />
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                                    <Text style={styles.labelCard}>Informações da Unidade</Text>
                                    {loadingdados ? (
                                        <ActivityIndicator size="small" color={palette.accent} style={{ marginVertical: 8 }} />
                                    ) : (
                                        tipoCondomino === "PREDIO" ? (
                                            <View style={styles.infoUnidadeContainer}>
                                                {unidade && (
                                                    <View style={[styles.InputDesabilitadoFull, { flex: 1 }]}>
                                                        <Text style={styles.InputDesabilitadoText}>Nª Unidade: {unidade}</Text>
                                                    </View>
                                                )}
                                                <View style={styles.rowcard}>
                                                    {bloco && (
                                                        <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                                                            <Text style={styles.InputDesabilitadoText}>Bloco: {bloco}</Text>
                                                        </View>
                                                    )}
                                                    {andar && (
                                                        <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                                                            <Text style={styles.InputDesabilitadoText}>Andar: {andar}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={styles.InputDesabilitado}>
                                                <Text style={styles.InputDesabilitadoText}>{prefixo} : {numero}</Text>
                                            </View>
                                        )
                                    )}
                                    <View style={styles.containerMensagem}>
                                        <Text style={styles.labelMensagem}>Assunto</Text>
                                        <TextInput style={[styles.input, styles.inputAssunto]} placeholder="Digite o assunto" placeholderTextColor={palette.gray} value={assunto} onChangeText={setAssunto} multiline textAlignVertical="top" />
                                    </View> 
                                    <View style={styles.containerMensagem}>
                                        <Text style={styles.labelMensagem}>Mensagem</Text>
                                        <TextInput style={[styles.input, styles.inputMensagem]} placeholder="Escreva sua manifestação em detalhes... " placeholderTextColor={palette.gray} value={mensagem} onChangeText={setMensagem} multiline textAlignVertical="top" />
                                    </View>
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
        </View>
    );      
}
