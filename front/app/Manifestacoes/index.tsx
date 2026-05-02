import HeaderFuncApp from "@/components/HeaderFunctions";
import { Feather } from "@expo/vector-icons";
import { View, TouchableOpacity, SectionList, Text, TextInput, Modal, Pressable, KeyboardAvoidingView, ScrollView, ActivityIndicator, Platform } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { componenteList, listadoMock, agruparMes, coresPorCategoria, coresPorIcone, StatusSolicitacao, Movimentacao } from "@/components/Listado";
import { router } from "expo-router";
import { styles } from "@/screens/Manifestacoes/manifestacao";
import { BlurView } from "expo-blur";
import { palette } from "@/theme/colors";
import { BottomNav } from "@/components/BottomNav";
import { Picker } from "@react-native-picker/picker";   

//FAZ DISTINÇÃO DE QUAL USUÁRIO ESTARÁ UTILIZANDO
interface JwtPayload {
  role: "sindico" | "morador" | "admin" ;
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
function filtrarPorRole(items: componenteList[], role: "sindico" | "morador" | "admin"): componenteList[] {
    return items;
}

interface Props {
    onAdicionarManifestacao?: () => void;
}



export default function ManifestacoesScreen({ onAdicionarManifestacao }: Props){

    const [userRole, setUserRole] = useState<"sindico" | "morador" | "admin" | null>(null); //PARA TESTE SÓ TROCAR O VALOR DO PARENTESES
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [lista, setLista] = useState<componenteList[]>([]);
    const [itemSelecionado, setItemSelecionado] = useState<componenteList | null>(null);
    const [modalAberta, setModalAberta] = useState(false);
    const [loadingdados, setLoadingDados] = useState(false);
    const [assunto, setAssunto] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [comentario, setComentario] = useState("");
    const [statusSelecionado, setStatusSelecionado] = useState<StatusSolicitacao>("Pendente");
    const [modalStatusAberta, setModalStatusAberta] = useState(false);
    const [confirmExclusao, setConfirmExclusao] = useState(false);
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
                        setNomeUsuario(decoded.nome ?? decoded.sub)
                    }
                };
                loadUser();
                // setUserRole("morador"); //- DESCOMENTAR PARA FORÇAR SER PERFIL DE MORADOR
            }, []);
        
            //FUNÇÃO PARA FILTRAR LISTA DE ACORDO COM CADA ROLE
/*             useEffect(() => {
                if (userRole) {
                setLista(filtrarPorRole(listadoMock, userRole));
            }
        }, [userRole]);  */
        
        //DESCOMENTAR PARA FAZER TESTE COM OS MORADORES -- jwt.io
/*         useEffect(() => {
        const salvarToken = async () => {
            await AsyncStorage.clear();
            await AsyncStorage.setItem(
            "token",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJzdWIiOiJhZG1pbjAwMSIsIm5vbWUiOiJBZG1pbiIsInRpcG9Db25kIjoiUFJFRElPIn0.tfxW2FwMRR3Ub2cfQMm8QfB3jcmoREqjL9o-JDgQIcA"
        );
        };

        salvarToken();
        }, []);
 */

        //FUNÇÃO PARA PEGAR INFOS DO APARTAMENTO E ADICIONAR NA MANIFESTAÇÃO
        
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


        //FILTRA APENAS AS MANIFESTAÇÕES DO USUÁRIO
        useEffect(() => {
                if (!userRole || !nomeUsuario) return;

                if( userRole === "morador"){
                    setLista(
                        listadoMock.filter(
                            (item) => item.categoria === "solicitacao" && item.autor === nomeUsuario
                        )
                    );
                } else {
                    setLista(
                        listadoMock.filter((item) => item.categoria === "solicitacao")
                    );
                }
        }, [userRole, nomeUsuario]);

        //FUNÇÃO PARA CRIAR UMA NOVA MANIFESTAÇÃO
        function criarManifestacao( dados: { assunto: string; mensagem: string}) : componenteList{
            return {
                id: Date.now().toString(),
                titulo: dados.assunto,
                subtitulo: dados.mensagem,
                descricao: dados.mensagem,
                autor: nomeUsuario,
                data: new Date().toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', { hour: "2-digit", minute: "2-digit" }),
                mesAno: new Date().toLocaleDateString('pt-BR', { month: "long", year: "2-digit" }),
                icone: "file-text",
                corIcon: coresPorIcone['solicitacao'],
                cor: coresPorCategoria['solicitacao'],
                categoria: 'solicitacao',
                status: "Em Andamento",
                movimentacoes: [
                    {
                        titulo: "",
                        comentario: "",
                        data: new Date().toLocaleDateString('pt-BR'),
                        autorRole: "morador",
                    },
                ],
                tipoCond: tipoCondomino ?? undefined,
                unidade,
                bloco,
                andar,
                numero,
                prefixo,
            };
        }

            function atualizarManifestacao() {
            if (!itemSelecionado) return;

            const novaMov: Movimentacao = {
                titulo: statusSelecionado,
                comentario: comentario || undefined,
                data: new Date().toLocaleDateString('pt-BR'),
                hora: new Date().toLocaleTimeString('pt-BR', { hour: "2-digit", minute: "2-digit" }),
                status: statusSelecionado,
                autorRole: userRole ?? undefined,
            };

            const atualizado: componenteList = {
                ...itemSelecionado,
                status: statusSelecionado,
                subtitulo: statusSelecionado,
                movimentacoes: [...(itemSelecionado.movimentacoes || []), novaMov],
            };

            setLista(prev =>
                prev.map(i => (i.id === atualizado.id ? atualizado : i))
            );

            if (statusSelecionado === "Encerrado") {
                setItemSelecionado(null);
            } else {
                setItemSelecionado(atualizado);
            }

            setComentario("");
            }

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
              ? { assunto, mensagem, unidade, bloco, andar, categoria: 'solicitacao' }
              : { assunto, mensagem, numero, prefixo, categoria: 'solicitacao' };

        console.log("Enviando manifestação:", payload);

        const novoItem = criarManifestacao({ assunto, mensagem });
        setLista((prev) => [...prev, novoItem]);
        handleFecharModal();
    };

        function handleFecharModal(){
            setModalAberta(false);
            setAssunto("");
            setMensagem("");
        }

            const handleDeleteConfirmado = () => {
            if (!itemSelecionado) return;

            if (!confirmExclusao) {
                setConfirmExclusao(true);
                return;
            }

            handleDelete(itemSelecionado.id);

            setConfirmExclusao(false);
            setModalStatusAberta(false);
            setItemSelecionado(null);
            };

        function handleDelete (id: string){
            setLista((prev) => prev.filter((i) => i.id !== id));
        }

        function handleUpdate (itemAtualizado: componenteList) {
           setLista((prev) => 
        prev.map((item) =>
        item.id === itemAtualizado.id ? itemAtualizado : item)
        );
        
        if (itemAtualizado.status === "Encerrado") {
            setItemSelecionado(null);
        } else {
            setItemSelecionado(itemAtualizado);
        }
        };
        
        const secoes = agruparMes(lista.filter((i) => i.status !== "Encerrado"));

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
                    onPress={() => { setItemSelecionado(item);
                    setStatusSelecionado(item.status ?? "Pendente");
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
            </View>

                        {/* VER STATUS OU DEFINIR STATUS */}

                            <Modal
                            visible={modalStatusAberta}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setModalStatusAberta(false)}
                            >   
                            <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
                                <Pressable
                                style={styles.overlay}
                                onPress={() => setModalStatusAberta(false)}
                                >
                                <Pressable
                                    style={styles.card}
                                    onPress={(e) => e.stopPropagation()}
                                >
                                 <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        contentContainerStyle={styles.cardScrollContent}
                                    >
                                <Text style={styles.tituloCard}>{itemSelecionado?.titulo}</Text>

                                <Text style={styles.labelMensagem}>Descrição</Text>
                                <Text style={styles.TextComent}>
                                {itemSelecionado?.descricao}
                                </Text>
                                <Text style={styles.labelCard}>Informações da Unidade</Text>


                                {itemSelecionado?.tipoCond === "PREDIO" ? (
                                <View style={styles.infoUnidadeContainer}>
                                    {itemSelecionado.unidade ? (
                                    <View style={[styles.InputDesabilitadoFull, { flex: 1 }]}>
                                        <Text style={styles.InputDesabilitadoText}>
                                        Nº Unidade: {itemSelecionado.unidade}
                                        </Text>
                                    </View>
                                    ) : null}

                                    <View style={styles.rowcard}>
                                    {itemSelecionado.bloco ? (
                                        <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                                        <Text style={styles.InputDesabilitadoText}>
                                            Bloco: {itemSelecionado.bloco}
                                        </Text>
                                        </View>
                                    ) : null}

                                    {itemSelecionado.andar ? (
                                        <View style={[styles.InputDesabilitado, { flex: 1 }]}>
                                        <Text style={styles.InputDesabilitadoText}>
                                            Andar: {itemSelecionado.andar}
                                        </Text>
                                        </View>
                                    ) : null}
                                    </View>
                                </View>
                                ) : (
                                    <View style={styles.InputDesabilitado}>
                                    <Text style={styles.InputDesabilitadoText}>
                                    {itemSelecionado?.prefixo ?? "Casa/Lote"}: {itemSelecionado?.numero}
                                    </Text>
                                </View>
                                )}
                                

                                    <View style={styles.Divisao} />

                                    <Text style={styles.labelMensagem}>Histórico</Text>

                                    {itemSelecionado?.movimentacoes?.map((mov, index) => (
                                    <View key={index} style={{ marginBottom: 12, }}>
                                        <Text style={styles.Title}>{mov.titulo}</Text>

                                        {mov.comentario ? (
                                            <Text style={styles.TextComent}>{mov.comentario}</Text>
                                        ) : null}

                                        <Text style={styles.TextComent}>
                                        {mov.data} {mov.hora ? `às ${mov.hora}` : ""}
                                        </Text>
                                    </View>
                                    ))} 
                                    {itemSelecionado && userRole === 'morador' && (
                                        <TouchableOpacity
                                        style={[
                                            styles.ModalBotaoExcluir,
                                            confirmExclusao && styles.ModalBotaoExcluirConfirmando,
                                        ]}
                                        onPress={handleDeleteConfirmado}
                                        >
                                        <Feather
                                        name={confirmExclusao ? "alert-circle" : "trash"}
                                        size={16}
                                        color="#fff"
                                        />   
                                        <Text style={styles.ModalBotaoExcluirTexto}>
                                        {confirmExclusao ? "Confirmar exclusão" : "Excluir"}
                                        </Text>
                                    </TouchableOpacity>
                                    )}

                                    {(userRole === "sindico" || userRole === "admin") && (
                                        <>
                                        <View style={styles.Divisao} />

                                                <View style={styles.pickerView}>
                                                <Text style={styles.labelMensagem}>Atualizar status</Text>

                                                <View
                                                    style={{
                                                        borderWidth: 1,
                                                        borderColor: palette.accent,
                                                        backgroundColor: "#F5F5F5",
                                                        borderRadius: 8,
                                                        overflow: "hidden",
                                                    }}
                                                    >
                                                    <Picker
                                                    style={styles.picker}
                                                    selectedValue={statusSelecionado}
                                                    onValueChange={(itemValue) =>
                                                        setStatusSelecionado(itemValue as StatusSolicitacao)
                                                    }
                                                    dropdownIconColor="#000"
                                                    >
                                                    <Picker.Item label="Pendente" value="pendente" />
                                                    <Picker.Item label="Em andamento" value="em_andamento" />
                                                    <Picker.Item label="Aguardando" value="aguardando" />
                                                    <Picker.Item label="Concluído" value="concluido" />
                                                    <Picker.Item label="Encerrado" value="encerrado" />
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
                            <Text style={styles.tituloCard}>Nova Manifestação</Text>
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
                                placeholder="Escreva sua manifestação em detalhes... "
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
    <BottomNav />

    </View>


     );      
}