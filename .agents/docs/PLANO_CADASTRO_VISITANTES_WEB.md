To resume this session: gemini --resume 'ea5db711-3d63-469d-bf49-68b3f4ebac08'

# Plano de Implementação: Cadastro de Visitantes via Web Link

## Objetivo
Implementar um fluxo onde o morador pode gerar um link de convite temporário e enviá-lo para um visitante. O visitante acessa o link através de um navegador web no celular, preenche seus dados e é automaticamente cadastrado e vinculado à "rede" do morador, sem a necessidade de instalar o aplicativo móvel.

## Arquivos Chave e Contexto
- **Banco de Dados:** `api/prisma/schema.prisma`
- **Backend (FastAPI):** 
  - Novos endpoints para gerenciar convites.
  - Novo arquivo HTML para o formulário: `api/app/templates/cadastro_visitante.html`
- **Frontend (React Native):**
  - Tela de convites: `front/app/convidar/index.tsx` e componentes relacionados em `front/src/screens/Convidar/`.
  - Integração com a API nativa de compartilhamento (Share).

## Passos da Implementação

### 1. Atualização do Banco de Dados (Prisma)
- Criar a tabela `Convite` contendo:
  - `id` (UUID)
  - `token` (String, Unique)
  - `morador_id` (Relacionamento com a tabela de usuários/moradores)
  - `data_expiracao` (DateTime)
  - `status` (Enum/String: PENDENTE, UTILIZADO, EXPIRADO)
- Garantir que a tabela `Visitante` (ou estrutura equivalente) suporte o vínculo direto com o morador que o convidou.

### 2. Backend (FastAPI - `api/`)
- **Módulo de Convites:**
  - Configurar variável de ambiente `BASE_URL` para a construção de URLs absolutas.
  - Criar rota `POST /convites/gerar`: Recebe a solicitação do morador logado, gera um token seguro (utilizando `secrets.token_urlsafe` ou UUID4), define a validade (ex: 24h) e salva no banco. Retorna a URL completa.
  - Criar rota `GET /convites/{token}`: Verifica se o token é válido. Se sim, renderiza o template `cadastro_visitante.html`. Se não, renderiza uma página de erro (Link Expirado/Inválido).
  - Criar rota `POST /convites/{token}/registrar`: Recebe os dados do formulário preenchido pelo visitante. 
    - Implementar *Rate Limit* para evitar spam de cadastros.
    - Processa a criação do `Visitante`, vincula ao morador dono do token e altera o status do convite para `UTILIZADO`.
    - Disparar notificação push para o morador informando que o visitante completou o cadastro.
- **Templates (`api/app/templates/`):**
  - Criar `cadastro_visitante.html`: Uma página simples e responsiva (Mobile First) contendo o formulário de cadastro (Nome, Documento, etc.) com validações rigorosas de input no client-side e server-side.

### 3. Frontend Mobile (React Native - `front/`)
- **Tela de Convites (`src/screens/Convidar`):**
  - Adicionar um botão "Gerar Convite".
  - Ao clicar, consumir o endpoint `POST /convites/gerar`.
  - Exibir o link gerado na tela.
  - Utilizar a API `Share` do React Native (ou `expo-sharing`) para permitir que o morador envie o link pelo WhatsApp, SMS ou outras redes sociais facilmente.

## Validação e Testes
- **Backend:**
  - Testar a geração de tokens e garantir que não haja colisões.
  - Testar a regra de expiração: links vencidos não devem renderizar o formulário.
  - Testar o fluxo de registro: criação do visitante e invalidação imediata do token após o uso.
- **Web (Formulário):**
  - Validar a renderização responsiva do `cadastro_visitante.html` simulando telas de dispositivos móveis.
- **Frontend Mobile:**
  - Testar a chamada à API e o funcionamento do compartilhamento nativo em simuladores/dispositivos físicos.
