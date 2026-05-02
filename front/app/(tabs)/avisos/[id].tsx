import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, StatusBar, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { colors, palette } from "@/theme/colors";
import avisoService, { Aviso } from "@/services/avisoService";
import { useAuth } from "@/hooks/useAuth";

export default function AvisoDetalhes() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { checkPermission } = useAuth();
  
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  
  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [editTitulo, setEditTitulo] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const data = await avisoService.obterDetalhes(Number(id));
        setAviso(data);
        setEditTitulo(data.titulo);
        setEditDescricao(data.descricao);
        
        // Verifica se o usuário pode editar
        const hasPerm = await checkPermission(['ADMIN', 'SINDICO']);
        setCanEdit(hasPerm);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os detalhes do aviso.");
        router.back();
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, [id]);

  const handleVerAnexo = async () => {
    try {
      setDownloading(true);
      const url = await avisoService.obterUrlAnexo(Number(id));
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível abrir o anexo.");
    } finally {
      setDownloading(false);
    }
  };

  const handleSalvarEdicao = async () => {
    if (!editTitulo || !editDescricao) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      setSaving(true);
      const atualizado = await avisoService.atualizar(Number(id), {
        titulo: editTitulo,
        descricao: editDescricao
      });
      setAviso(atualizado);
      setIsEditing(false);
      Alert.alert("Sucesso", "Aviso atualizado com sucesso.");
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={palette.accent} />
        <ActivityIndicator size="large" color={colors.textLight} />
      </View>
    );
  }

  if (!aviso) return null;

  const dataObj = new Date(aviso.criado_em);
  const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const horaFormatada = dataObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={palette.accent} />
      
      <Header 
        title={isEditing ? "Editar Aviso" : "Detalhes do Aviso"} 
        subtitle={aviso.categoria}
        showBackButton
      />

      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            
            {/* Cabeçalho do Card */}
            <View style={styles.infoRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{aviso.categoria}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={styles.dateText}>{dataFormatada} às {horaFormatada}</Text>
                {canEdit && !isEditing && (
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <MaterialIcons name="edit" size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isEditing ? (
              <View>
                <Text style={styles.label}>Título</Text>
                <TextInput 
                  style={styles.input}
                  value={editTitulo}
                  onChangeText={setEditTitulo}
                  placeholder="Título do aviso"
                />

                <Text style={styles.label}>Descrição</Text>
                <TextInput 
                  style={[styles.input, styles.textArea]}
                  value={editDescricao}
                  onChangeText={setEditDescricao}
                  multiline
                  numberOfLines={4}
                  placeholder="Descrição completa"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.btn, styles.btnCancel]} 
                    onPress={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    <Text style={styles.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.btn, styles.btnSave]} 
                    onPress={handleSalvarEdicao}
                    disabled={saving}
                  >
                    {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSaveText}>Salvar</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>{aviso.titulo}</Text>
                <View style={styles.divider} />
                <Text style={styles.descricao}>{aviso.descricao}</Text>

                {aviso.anexo_url && (
                  <TouchableOpacity 
                    style={styles.anexoButton} 
                    onPress={handleVerAnexo}
                    disabled={downloading}
                  >
                    {downloading ? (
                      <ActivityIndicator color="#FFF" />
                    ) : (
                      <>
                        <Feather name="file-text" size={20} color="#FFF" />
                        <Text style={styles.anexoButtonText}>Visualizar Anexo (PDF)</Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            )}

          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.accent,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: colors.sheetBg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 15,
  },
  descricao: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 20,
  },
  anexoButton: {
    backgroundColor: colors.earthAccent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  anexoButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Estilos de Edição
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textDark,
    backgroundColor: '#F9F9F9',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 25,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: '#EEE',
  },
  btnCancelText: {
    color: colors.textMuted,
    fontWeight: 'bold',
  },
  btnSave: {
    backgroundColor: colors.primary,
  },
  btnSaveText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});
