import { useState, useEffect } from "react";
import { View, SectionList, Text, TouchableOpacity, ActivityIndicator, Pressable, ScrollView, TextInput, KeyboardAvoidingView, Platform, Modal, Alert } from "react-native";
import HeaderFuncApp from "@/components/HeaderFunctions";
import { styles } from "@/screens/Bilhetes/bilhetes.styles";
import { Entypo, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
import { palette } from "@/theme/colors";
import { storage } from "@/utils/storage";
import { useAviso } from "@/hooks/useAviso";
import { Aviso } from "@/services/avisoService";
import { Picker } from "@react-native-picker/picker";

export default function AvisosScreen() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userCondo, setUserCondo] = useState("");
  const [itemSelecionado, setItemSelecionado] = useState<Aviso | null>(null);
  const [modalAberta, setModalAberta] = useState(false);
  const [modalDetalheAberta, setModalStatusAberta] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [confirmExclusao, setConfirmExclusao] = useState(false);

  // Form Fields
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("GERAL");

  const { avisos, loading, refresh, criarAviso, deletarAviso, atualizarAviso } = useAviso();

  useEffect(() => {
    const loadUser = async () => {
      const role = await storage.getItemAsync("user_perfil");
      const condo = await storage.getItemAsync("user_condominio");
      setUserRole(role?.toLowerCase() || null);
      setUserCondo(condo || "Condomínio");
    };
    loadUser();
  }, []);

  const handleSalvar = async () => {
    if (!titulo || !descricao) {
      alert("Preencha título e descrição");
      return;
    }

    try {
      setLoadingAction(true);
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("categoria", categoria);

      await criarAviso(formData);
      setModalAberta(false);
      setTitulo("");
      setDescricao("");
      alert("Aviso criado com sucesso!");
    } catch (error: any) {
      console.error("ERRO AO CRIAR AVISO:", error);
      const detail = error.response?.data?.detail;
      let msg = "Erro ao criar aviso";
      
      if (Array.isArray(detail)) {
        msg += ": " + detail.map((d: any) => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(", ");
      } else if (typeof detail === 'string') {
        msg += ": " + detail;
      }
      
      alert(msg);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdate = async () => {
    if (!itemSelecionado) return;
    try {
      setLoadingAction(true);
      await atualizarAviso(itemSelecionado.id, { titulo, descricao, categoria });
      setModalStatusAberta(false);
      alert("Aviso atualizado!");
    } catch (error) {
      alert("Erro ao atualizar");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!itemSelecionado) return;
    if (!confirmExclusao) {
        setConfirmExclusao(true);
        return;
    }
    try {
      setLoadingAction(true);
      await deletarAviso(itemSelecionado.id);
      setModalStatusAberta(false);
      setConfirmExclusao(false);
      alert("Aviso removido");
    } catch (error) {
      alert("Erro ao remover");
    } finally {
      setLoadingAction(false);
    }
  };

  const isSindico = userRole === "sindico" || userRole === "admin";

  const dataAgrupada = avisos.map(a => ({
      ...a,
      data: new Date(a.criado_em).toLocaleDateString('pt-BR'),
      hora: new Date(a.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  }));

  // Simula o agruparMes do Listado
  const secoes = [
      { title: "Recentes", data: dataAgrupada }
  ];

  return (
    <View style={styles.container}>
      <HeaderFuncApp
        title="Mural de Avisos"
        subtitle={userCondo}
        iconLeft={<Feather name="arrow-left" size={24} color="#fff" />}
        onPressLeft={() => router.push("/home")}
        iconRight={isSindico ? <Feather name="plus" size={24} color="#fff" /> : <Entypo name="megaphone" size={24} color="#fff" />}
        onPressRight={isSindico ? () => setModalAberta(true) : undefined}
      />

      <View style={styles.centerContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={palette.accent} style={{ marginTop: 20 }} />
        ) : (
          <SectionList
            style={styles.ContainerFundo}
            contentContainerStyle={styles.ContainerFundoContent}
            sections={secoes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.Listado}
                onPress={() => {
                  setItemSelecionado(item);
                  setTitulo(item.titulo);
                  setDescricao(item.descricao);
                  setCategoria(item.categoria);
                  setModalStatusAberta(true);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.ContainerIcon, { backgroundColor: palette.accent }]}>
                  <Entypo name="megaphone" size={22} color="#fff" />
                </View>
                <View style={styles.ContainerBody}>
                  <Text style={styles.TextTitle}>{item.titulo}</Text>
                  <Text style={styles.TextDesc} numberOfLines={1}>{item.descricao}</Text>
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

      {/* MODAL DETALHE / EDITAR / EXCLUIR */}
      <Modal visible={modalDetalheAberta} transparent animationType="fade">
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
          <Pressable style={styles.overlay} onPress={() => setModalStatusAberta(false)}>
            <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 15 }}>
                <Text style={styles.tituloCard}>{isSindico ? "Gerenciar Aviso" : itemSelecionado?.titulo}</Text>
                
                {isSindico ? (
                  <>
                    <Text style={styles.labelMensagem}>Título</Text>
                    <TextInput 
                        style={styles.input} 
                        value={titulo} 
                        onChangeText={setTitulo} 
                    />
                    
                    <Text style={styles.labelMensagem}>Descrição</Text>
                    <TextInput 
                        style={[styles.input, { height: 100 }]} 
                        multiline 
                        value={descricao} 
                        onChangeText={setDescricao} 
                    />

                    <Text style={styles.labelMensagem}>Categoria</Text>
                    <View style={{ borderWidth: 1, borderColor: palette.accent, borderRadius: 8 }}>
                        <Picker selectedValue={categoria} onValueChange={setCategoria}>
                            <Picker.Item label="Geral" value="GERAL" />
                            <Picker.Item label="Manutenção" value="MANUTENCAO" />
                            <Picker.Item label="Reunião" value="REUNIAO" />
                            <Picker.Item label="Segurança" value="SEGURANCA" />
                        </Picker>
                    </View>

                    <View style={styles.botoes}>
                      <TouchableOpacity style={styles.btnSalvar} onPress={handleUpdate}>
                        <Text style={styles.btnSalvarText}>Salvar Alterações</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[styles.ModalBotaoExcluir, confirmExclusao && { backgroundColor: '#dc3545' }]} 
                        onPress={handleDelete}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                            {confirmExclusao ? "Confirmar Exclusão" : "Excluir"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.labelMensagem}>Descrição</Text>
                    <Text style={{ fontSize: 16, color: palette.darkGray }}>{itemSelecionado?.descricao}</Text>
                    <View style={styles.Divisao} />
                    <Text style={{ fontSize: 12, color: palette.gray }}>Postado em {itemSelecionado?.data} às {itemSelecionado?.hora}</Text>
                  </>
                )}
                
                <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalStatusAberta(false)}>
                  <Text style={styles.btnCancelarText}>Fechar</Text>
                </TouchableOpacity>
              </ScrollView>
            </Pressable>
          </Pressable>
        </BlurView>
      </Modal>

      {/* MODAL NOVO AVISO */}
      <Modal visible={modalAberta} transparent animationType="slide">
        <BlurView intensity={40} tint="dark" style={{ flex: 1 }}>
          <Pressable style={styles.overlay} onPress={() => setModalAberta(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%" }}>
              <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                <Text style={styles.tituloCard}>Novo Aviso</Text>
                <View style={styles.Divisao} />
                
                <ScrollView contentContainerStyle={{ gap: 10 }}>
                    <Text style={styles.labelMensagem}>Título</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="Título do aviso" 
                        value={titulo} 
                        onChangeText={setTitulo} 
                    />

                    <Text style={styles.labelMensagem}>Mensagem</Text>
                    <TextInput 
                        style={[styles.input, { height: 120 }]} 
                        multiline 
                        placeholder="Descreva o aviso..." 
                        value={descricao} 
                        onChangeText={setDescricao} 
                    />

                    <Text style={styles.labelMensagem}>Categoria</Text>
                    <View style={{ borderWidth: 1, borderColor: palette.accent, borderRadius: 8 }}>
                        <Picker selectedValue={categoria} onValueChange={setCategoria}>
                            <Picker.Item label="Geral" value="GERAL" />
                            <Picker.Item label="Manutenção" value="MANUTENCAO" />
                            <Picker.Item label="Reunião" value="REUNIAO" />
                            <Picker.Item label="Segurança" value="SEGURANCA" />
                        </Picker>
                    </View>

                    <View style={styles.botoes}>
                        <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                            {loadingAction ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSalvarText}>Publicar</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalAberta(false)}>
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
