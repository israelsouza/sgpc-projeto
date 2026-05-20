# Comparativo de Soluções de Notificações Push

Este documento apresenta as principais opções para envio de Notificações Push (Nativas e Web), com seus prós e contras, para ajudar na decisão técnica do Mural de Avisos.

## 1. Firebase Cloud Messaging (FCM)
O padrão da indústria, oferecido pelo Google.

**Prós:**
- **100% Gratuito:** Sem limite de envios, mensagens ou usuários.
- **Push Nativo:** Suporte excelente para acordar dispositivos iOS/Android.
- **Web Push:** Suporte robusto para notificações de browser (Chrome, Firefox, Safari). O usuário pode receber notificações na área de trabalho mesmo com a aba fechada (via Service Worker).
- **Tópicos:** Capacidade de inscrever usuários em "tópicos" (ex: `condominio_123`), facilitando o envio em massa para todos os moradores de uma vez, com apenas uma requisição do backend.
- **Confiabilidade:** Infraestrutura Google, entrega altíssima.

**Contras:**
- **Configuração Inicial:** Exige configuração de chaves do Google (Service Account) no backend, e certificados p12/APNs para configurar iOS.
- **Complexidade no Frontend:** O código do frontend (service workers) para lidar com o web push pode ser um pouco verboso de configurar do zero.

---

## 2. OneSignal
Serviço popular focado em simplificar notificações.

**Prós:**
- **Facilidade:** SDKs excelentes e painel visual muito rico para testar envios e ver métricas.
- **Push Nativo e Web Push:** Funciona muito bem para iOS/Android e Browser, com pop-ups automáticos de opt-in (permissão do usuário).
- **Segmentação:** Permite segmentar usuários facilmente pelo painel usando tags.
- **Backend Simples:** A integração com a API Rest deles no Python é muito rápida.

**Contras:**
- **Custo futuro (O MAIOR PROBLEMA):** O plano gratuito é severamente limitado a 10.000 inscritos em Push. Se o app crescer (o que é rápido em condomínios com múltiplos moradores/aparelhos), o sistema vai parar de entregar a menos que pague a licença mensal.
- **Dependência de terceiros:** Mais um serviço/painel intermediário (além da AWS/Vercel) entre sua aplicação e os dispositivos.

---

## 3. Supabase (Realtime / Edge Functions)
Plataforma Backend as a Service.

**Prós:**
- **Notificações In-App (WebSockets):** Excelente para atualizar o feed de avisos ou mostrar um alerta instantâneo se a pessoa **estiver com o app/site aberto**.
- **Limites Generosos:** Plano grátis atende perfeitamente a maioria dos usos de WebSockets.

**Contras:**
- **Não resolve o problema de Push Off-line puro:** Se o celular estiver no bolso ou a aba do site fechada, a conexão WebSocket morre. Para enviar a notificação nessas condições (Push Nativo e Web Push fechado), o Supabase precisa disparar funções (Edge Functions) que, no final das contas, **conectam no FCM do Google ou APN da Apple**. Ou seja, você precisaria configurar o Firebase de qualquer maneira.

---

### Conclusão e Recomendação
Para o **Mural de Avisos**, onde é essencial alertar os moradores sobre manutenções ou problemas críticos *mesmo quando eles não estão usando o app*:

- A recomendação técnica primária é o **Firebase (FCM)**. Por ser gratuito e suportar disparo para Tópicos (todos do condomínio de uma vez) nativamente, além de funcionar tanto em celular bloqueado quanto em navegador fechado.
