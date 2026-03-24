# SGPC — Frontend (App Mobile)

App mobile do Sistema SGPC, desenvolvido em **React Native** com **Expo** e **TypeScript**.

## Stack
- **React Native** — framework mobile
- **Expo** — toolchain e build
- **TypeScript** — tipagem estática
- **Axios** — cliente HTTP para consumir a API

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
copy .env.example .env

# 3. Iniciar o servidor de desenvolvimento
npx expo start
```

Opções após o servidor iniciar:
- `a` → Abrir no emulador Android
- `i` → Abrir no simulador iOS (requer macOS)
- Escanear o QR code com o app **Expo Go** no celular

## Estrutura de Pastas

```
front/
├── App.tsx              # Entry point
├── src/
│   ├── screens/         # Telas da aplicação
│   ├── components/      # Componentes reutilizáveis
│   └── services/
│       └── api.ts       # Cliente HTTP (axios)
└── .env.example         # Template de variáveis de ambiente
```

## Variáveis de Ambiente

| Variável               | Descrição                          |
|------------------------|------------------------------------|
| `EXPO_PUBLIC_API_URL`  | URL base da API (backend)          |

> **Atenção**: Em dispositivo físico, substitua `localhost` pelo IP local da máquina.
