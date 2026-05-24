import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { colors, palette } from "@/theme/colors";
import { useFonts } from "expo-font";
import { moradorService } from "@/services/moradorService";
import { conviteService, Visitante } from "@/services/conviteService";
import { storage } from "@/utils/storage";

interface CadastradoItem {
  id: string;
  originalId: number;
  nome: string;
  tipo: string;
  tipoOriginal: string;
  icone: keyof typeof Ionicons.glyphMap;
  isVisitante: boolean;
  unidadeInfo?: string;
}

export default function CadastradosScreen() {
  const [loading, setLoading] = useState(true);
  const [cadastrados, setCadastrados] = useState<CadastradoItem[]>([]);
  const [userProfile, setUserProfile] = useState<string | null>(null);
  
  // Estados para Gestão
  const [selectedItem, setSelectedItem] = useState<CadastradoItem | null>(null);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editNome, setEditNome] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const [loaded, error] = useFonts({
    "InterRegular": require("../../assets/fonts/Inter_18pt-Regular.ttf"),
    "InterBold":    require("../../assets/fonts/Inter_18pt-Bold.ttf"),
    "InterMedium":  require("../../assets/fonts/Inter_18pt-Medium.ttf"),
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const profile = await storage.getItemAsync("user_perfil");
      setUserProfile(profile);

      const isStaff = profile && profile !== "MORADOR";

      const [moradoresRes, visitantesRes] = await Promise.all([
        isStaff ? moradorService.listarMoradoresCondominio() : moradorService.listarMoradoresUnidade(),
        isStaff ? conviteService.listarVisitantesCondominio() : conviteService.listarVisitantes()
      ]);

      const moradoresMapped = (moradoresRes?.data || []).map((m: any) => ({
        id: `m-${m.id}`,
        originalId: m.id,
        nome: m.nome_completo,
        tipo: "Morador",
        tipoOriginal: "MORADOR",
        icone: "person-outline" as const,
        isVisitante: false,
        unidadeInfo: m.unidade ? `Unidade ${m.unidade.unidade}${m.unidade.bloco ? ` · Bloco ${m.unidade.bloco}` : ""}` : undefined
      }));

      const visitantesMapped = (visitantesRes?.data || []).map((v: Visitante) => {
        const unidade = v.morador?.unidade;
        return {
            id: `v-${v.id}`,
            originalId: v.id,
            nome: v.nome_completo,
            tipo: v.tipo === "PRESTADOR_SERVICO" ? "Prestador" : "Visitante",
            tipoOriginal: v.tipo,
            icone: v.tipo === "PRESTADOR_SERVICO" ? "build-outline" : "walk-outline" as const,
            isVisitante: true,
            unidadeInfo: unidade ? `Unidade ${unidade.unidade}${unidade.bloco ? ` · Bloco ${unidade.bloco}` : ""}` : undefined
        };
      });

      setCadastrados([...moradoresMapped, ...visitantesMapped]);
    } catch (err: any) {
      console.error("Erro ao buscar cadastrados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loaded) {
      fetchData();
    }
  }, [loaded]);

  const handleOpenOptions = (item: CadastradoItem) => {
    // Apenas moradores podem gerenciar seus visitantes. Funcionários apenas visualizam.
    if (!item.isVisitante || userProfile !== "MORADOR") return;
    setSelectedItem(item);
    setIsOptionsModalVisible(true);
  };

  const handleEditPress = () => {
    if (!selectedItem) return;
    setEditNome(selectedItem.nome);
    setIsOptionsModalVisible(false);
    setIsEditModalVisible(true);
  };

  const handleDeletePress = () => {
    if (!selectedItem) return;

    const performDelete = async () => {
        try {
            setIsUpdating(true);
            await conviteService.excluirVisitante(selectedItem.originalId);
            setIsOptionsModalVisible(false);
            setSelectedItem(null);
            if (Platform.OS === 'web') alert("Visitante removido com sucesso.");
            fetchData();
        } catch (err) {
            if (Platform.OS === 'web') alert("Erro ao excluir visitante.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (Platform.OS === 'web') {
        if (window.confirm(`Tem certeza que deseja remover o cadastro de ${selectedItem.nome}?`)) {
            performDelete();
        }
    } else {
        Alert.alert("Confirmar Exclusão", "Tem certeza que deseja remover este cadastro?", [
            { text: "Sim", onPress: performDelete, style: "destructive" },
            { text: "Não", style: "cancel" }
        ]);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem || !editNome.trim()) return;

    try {
        setIsUpdating(true);
        await conviteService.atualizarVisitante(selectedItem.originalId, { nome_completo: editNome });
        setIsEditModalVisible(false);
        setSelectedItem(null);
        fetchData();
    } catch (err) {
        if (Platform.OS === 'web') alert("Erro ao atualizar.");
    } finally {
        setIsUpdating(false);
    }
  };

  if (!loaded && !error) return null;

  const renderItem = ({ item }: { item: CadastradoItem }) => {
      const isStaff = userProfile && userProfile !== "MORADOR";
      const canManage = item.isVisitante && !isStaff;

      return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => canManage && handleOpenOptions(item)}
            onLongPress={() => canManage && handleOpenOptions(item)}
            activeOpacity={canManage ? 0.7 : 1}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={item.icone} size={24} color={palette.darkBrown} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.nome}>{item.nome}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.tipo}>{item.tipo}</Text>
                {isStaff && item.unidadeInfo && (
                    <>
                        <Text style={{ color: colors.textMuted, fontSize: 10 }}>•</Text>
                        <Text style={styles.unidadeInfo}>{item.unidadeInfo}</Text>
                    </>
                )}
            </View>
          </View>
          {canManage && (
              <Ionicons name="ellipsis-vertical" size={16} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Cadastrados" 
        showBackButton={true} 
      />
      
      <View style={styles.contentWrapper}>
        {loading && cadastrados.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.darkBrown} />
          </View>
        ) : (
          <FlatList
            data={cadastrados}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={fetchData}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum cadastrado encontrado.</Text>
            }
          />
        )}
      </View>

      {/* Modal de Opções (Menu) */}
      <Modal visible={isOptionsModalVisible} transparent animationType="slide" onRequestClose={() => setIsOptionsModalVisible(false)}>
          <TouchableOpacity style={localStyles.modalOverlay} activeOpacity={1} onPress={() => setIsOptionsModalVisible(false)}>
              <View style={localStyles.optionsBox}>
                  <View style={localStyles.modalIndicator} />
                  <Text style={localStyles.modalTitle}>{selectedItem?.nome}</Text>
                  
                  <TouchableOpacity style={localStyles.optionButton} onPress={handleEditPress}>
                      <Ionicons name="pencil-outline" size={20} color={colors.textDark} />
                      <Text style={localStyles.optionText}>Editar Nome</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[localStyles.optionButton, { borderBottomWidth: 0 }]} onPress={handleDeletePress}>
                      <Ionicons name="trash-outline" size={20} color="#DC3545" />
                      <Text style={[localStyles.optionText, { color: "#DC3545" }]}>Excluir Cadastro</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={localStyles.cancelButton} onPress={() => setIsOptionsModalVisible(false)}>
                      <Text style={localStyles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
              </View>
          </TouchableOpacity>
      </Modal>

      {/* Modal de Edição */}
      <Modal visible={isEditModalVisible} transparent animationType="fade" onRequestClose={() => setIsEditModalVisible(false)}>
          <View style={localStyles.modalOverlay}>
              <View style={localStyles.modalBox}>
                  <Text style={localStyles.modalTitle}>Editar Nome</Text>
                  <TextInput 
                    style={localStyles.input}
                    value={editNome}
                    onChangeText={setEditNome}
                    placeholder="Nome completo"
                    autoFocus
                  />
                  <View style={localStyles.modalButtons}>
                      <TouchableOpacity 
                        style={[localStyles.btn, { backgroundColor: '#E9ECEF' }]} 
                        onPress={() => setIsEditModalVisible(false)}
                      >
                          <Text style={{ color: '#333' }}>Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[localStyles.btn, { backgroundColor: palette.darkBrown }]} 
                        onPress={handleUpdate}
                        disabled={isUpdating}
                      >
                          {isUpdating ? <ActivityIndicator color="#FFF" /> : <Text style={{ color: '#FFF' }}>Salvar</Text>}
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    </View>
  );
}

const localStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    optionsBox: {
        backgroundColor: '#FFF',
        width: Platform.OS === 'web' ? 400 : '100%',
        borderRadius: 24,
        padding: 24,
        position: Platform.OS === 'web' ? 'relative' : 'absolute',
        bottom: Platform.OS === 'web' ? 'auto' : 20,
    },
    modalIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#DDD',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
        display: Platform.OS === 'web' ? 'none' : 'flex'
    },
    modalBox: {
        backgroundColor: '#FFF',
        width: Platform.OS === 'web' ? 400 : '90%',
        borderRadius: 16,
        padding: 24,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: colors.textDark,
        textAlign: 'center'
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        gap: 12
    },
    optionText: {
        fontSize: 16,
        color: colors.textDark,
        fontFamily: 'InterMedium'
    },
    cancelButton: {
        marginTop: 10,
        paddingVertical: 16,
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 16,
        color: colors.textMuted,
        fontFamily: 'InterBold'
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
        fontFamily: 'InterRegular'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12
    },
    btn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center'
    }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.accent,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    zIndex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    gap: 16,
    paddingTop: 32,
  },
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    backgroundColor: "#E6D6CC", 
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nome: {
    fontFamily: "InterBold",
    fontSize: 16,
    color: colors.textDark,
  },
  tipo: {
    fontFamily: "InterRegular",
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  unidadeInfo: {
    fontFamily: "InterRegular",
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: colors.textMuted,
    fontFamily: "InterRegular",
  },
});
