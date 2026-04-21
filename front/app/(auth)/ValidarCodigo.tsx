import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { styles } from '@/screens/RecuperacaoSenha/recuperacaoSenha.styles';
import { useRecuperacaoSenha } from '@/hooks/useRecuperacaoSenha';
import { colors } from '@/theme/colors';
import { validarCodigoSchema } from '@/validation/authSchemas';

export default function ValidarCodigoScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const { 
    codigo, setCodigo, validarCodigo, 
    loading, error, message, clearError, clearMessage,
    setEmail 
  } = useRecuperacaoSenha();

  const [localError, setLocalError] = useState<string | null>(null);

  // Carrega o e-mail passado da tela anterior para o estado local do hook
  useEffect(() => {
    if (email) {
      setEmail(email);
    }
  }, [email]);

  const handleValidar = async () => {
    setLocalError(null);
    const { error: validationError } = validarCodigoSchema.validate({ codigo });
    
    if (validationError) {
      setLocalError(validationError.details[0].message);
      return;
    }

    const sucesso = await validarCodigo(codigo);
    if (sucesso) {
      router.push({
        pathname: '/ResetarSenha',
        params: { email, codigo }
      });
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
        <Text style={styles.headerTitle}>Verifique seu e-mail</Text>
        <Text style={styles.headerSubtitle}>
          Enviamos um código de 6 dígitos para {email || 'seu e-mail'}.
        </Text>
      </View>

      <View style={styles.bottomSheet}>
        {displayError && <Text style={styles.errorText}>{displayError}</Text>}
        {message && <Text style={styles.messageText}>{message}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Código de 6 dígitos"
          placeholderTextColor={colors.textSubtle}
          keyboardType="number-pad"
          maxLength={6}
          value={codigo}
          onChangeText={(text) => {
            setCodigo(text);
            if (localError) setLocalError(null);
            if (error) clearError();
            if (message) clearMessage();
          }}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.btnPrimary, (loading || codigo.length !== 6) && styles.btnPrimaryDisabled]} 
          onPress={handleValidar}
          disabled={loading || codigo.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color={colors.textLight} />
          ) : (
            <Text style={styles.btnPrimaryText}>Validar Código</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.btnSecondaryText}>Tentar outro e-mail</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
