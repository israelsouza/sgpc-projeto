# Plano de Integração Frontend - Backend (SGPC)

## 1. Objetivo
Estabelecer a comunicação real entre o aplicativo React Native (Expo) e a API FastAPI, substituindo dados estáticos por chamadas reais aos endpoints.

## 2. Ordem de Implementação

### 🟢 Fase 1: Cadastro (Register) [ CONCLUÍDA ] 
*   **Status:** Pronto para iniciar.
*   **APIs:** `POST /api/morador/registrar` e `POST /api/funcionario/registrar`.
*   **Ações:**
    1. Configurar Axios em `front/src/services/api.ts`.
    2. Vincular inputs da tela `Register.tsx` ao estado (useState).
    3. Implementar chamada de API e tratamento de erros/sucesso.

### 🔵 Fase 2: Login e Sessão
*   **Status:** Aguardando Fase 1.
*   **API:** `POST /api/auth/login`.
*   **Ações:**
    1. Implementar captura de e-mail/senha em `login.tsx`.
    2. Armazenar Token JWT (SecureStore/AsyncStorage).
    3. Configurar interceptor no Axios para enviar o token em todas as rotas protegidas.

### 🟡 Fase 3: Geração de Chave (Mínimo Viável)
*   **Status:** Aguardando Fase 2.
*   **API:** `POST /api/chave/gerar`.
*   **Ações:**
    1. Criar interface mínima (sem foco em design) para seleção de perfil.
    2. Chamar endpoint autenticado.
    3. Exibir UUID da chave gerada na tela.

---
## 3. Notas de Desenvolvimento
*   Manter as telas o mais simples possível para validar a funcionalidade.
*   Tratar erros de rede e validação da API com feedbacks claros ao usuário.
*   Utilizar a branch `feature-integracao`.
