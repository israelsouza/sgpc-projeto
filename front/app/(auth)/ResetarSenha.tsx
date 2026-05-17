import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '@/screens/RecuperacaoSenha/recuperacaoSenha.styles';
import { useRecuperacaoSenha } from '@/hooks/useRecuperacaoSenha';
import { colors } from '@/theme/colors';
import { resetarSenhaSchema } from '@/validation/authSchemas';

export default function ResetarSenhaScreen() {
  const router = useRouter();
  const { email, codigo } = useLocalSearchParams<{ email: string; codigo: string }>();

  const { 
    resetarSenha, loading, error, message, clearError, clearMessage,
    setEmail, setCodigo
  } = useRecuperacaoSenha();
  
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  // Carrega parâmetros de rota para o estado do hook
  useEffect(() => {
    if (email) setEmail(email);
    if (codigo) setCodigo(codigo);
  }, [email, codigo]);

  const handleResetar = async () => {
    setLocalError(null);
    
    const { error: validationError } = resetarSenhaSchema.validate({ 
      nova_senha: novaSenha, 
      confirmar_senha: confirmarSenha 
    });

    if (validationError) {
      setLocalError(validationError.details[0].message);
      return;
    }

    const sucesso = await resetarSenha(novaSenha);
    if (sucesso) {
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      
      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>Criar Nova Senha</Text>
        <Text style={styles.headerSubtitle}>
          Escolha uma senha forte com pelo menos 8 caracteres.
        </Text>
      </View>

      <View style={styles.bottomSheet}>
        {displayError && <Text style={styles.errorText}>{displayError}</Text>}
        {message && <Text style={styles.messageText}>{message}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          placeholderTextColor={colors.textSubtle}
          secureTextEntry
          value={novaSenha}
          onChangeText={(text) => {
            setNovaSenha(text);
            if (localError) setLocalError(null);
            if (error) clearError();
            if (message) clearMessage();
          }}
          editable={!loading && !message} // Desabilita se já teve sucesso
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          placeholderTextColor={colors.textSubtle}
          secureTextEntry
          value={confirmarSenha}
          onChangeText={(text) => {
            setConfirmarSenha(text);
            if (localError) setLocalError(null);
            if (error) clearError();
          }}
          editable={!loading && !message}
        />

        <TouchableOpacity 
          style={[styles.btnPrimary, (loading || message) && styles.btnPrimaryDisabled]} 
          onPress={handleResetar}
          disabled={loading || !!message}
        >
          {loading ? (
            <ActivityIndicator color={colors.textLight} />
          ) : (
            <Text style={styles.btnPrimaryText}>Redefinir Senha</Text>
          )}
        </TouchableOpacity>

        {!message && (
          <TouchableOpacity 
            style={styles.btnSecondary} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.btnSecondaryText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
