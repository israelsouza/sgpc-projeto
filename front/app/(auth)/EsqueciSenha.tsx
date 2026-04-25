import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '@/screens/RecuperacaoSenha/recuperacaoSenha.styles';
import { useRecuperacaoSenha } from '@/hooks/useRecuperacaoSenha';
import { colors } from '@/theme/colors';
import { recuperarSenhaSchema } from '@/validation/authSchemas';

export default function EsqueciSenhaScreen() {
  const router = useRouter();
  const { email, setEmail, solicitarRecuperacao, loading, error, message, clearError } = useRecuperacaoSenha();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSolicitar = async () => {
    setLocalError(null);
    const { error: validationError } = recuperarSenhaSchema.validate({ email });
    
    if (validationError) {
      setLocalError(validationError.details[0].message);
      return;
    }

    const sucesso = await solicitarRecuperacao(email);
    if (sucesso) {
      // Pequeno delay para o usuário ver a mensagem antes de ir para a próxima tela
      setTimeout(() => {
        router.push({
          pathname: '/ValidarCodigo',
          params: { email }
        });
      }, 1500);
    }
  };

  const displayError = localError || error;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.headerTitle}>Recuperar Senha</Text>
        <Text style={styles.headerSubtitle}>
          Digite o e-mail cadastrado na sua conta para receber um código de recuperação.
        </Text>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {displayError && <Text style={styles.errorText}>{displayError}</Text>}
        {message && <Text style={styles.messageText}>{message}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor={colors.textSubtle}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (localError) setLocalError(null);
            if (error) clearError();
          }}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.btnPrimary, loading && styles.btnPrimaryDisabled]} 
          onPress={handleSolicitar}
          disabled={loading || !email}
        >
          {loading ? (
            <ActivityIndicator color={colors.textLight} />
          ) : (
            <Text style={styles.btnPrimaryText}>Enviar Código</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.btnSecondaryText}>Voltar para o Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
