# SGPC — Sistema de Gerenciamento de Portaria e Controle de Acesso

Monorepo do projeto SGPC, composto por backend Python/FastAPI e app mobile React Native/Expo.

## Estrutura do Repositório

```
pi/
├── .agents/          # Instruções e workflows para o Gemini
│   ├── GEMINI.md     # Contexto do projeto (stack, convenções)
│   └── workflows/    # Workflows de desenvolvimento
├── api/              # Backend REST (Python/FastAPI) → Vercel
└── front/            # App Mobile (React Native/Expo)
```

## Início Rápido

### Backend
```bash
cd api
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env   # Configure as variáveis
uvicorn index:app --reload
```
→ API em `http://localhost:8000` | Docs em `http://localhost:8000/docs`

### Frontend
```bash
cd front
npm install
npx expo start
```

## Links
- [Documentação da API](api/README.md)
- [Documentação do App](front/README.md)
