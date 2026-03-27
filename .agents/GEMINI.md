# Contexto do Projeto — SGPC

## Visão Geral
**SGPC** é um sistema de gerenciamento de portaria e controle de acesso, composto por:
- `api/` — Backend REST em Python/FastAPI, deployado na Vercel
- `front/` — App mobile em React Native com Expo

## Stack Técnica

| Camada     | Tecnologia                        |
|------------|-----------------------------------|
| Backend    | Python 3.12, FastAPI, Uvicorn     |
| Banco      | PostgreSQL                        |
| ORM        | SQLAlchemy + Alembic (migrações)  |
| Deploy API | Vercel (Serverless Functions)     |
| Frontend   | React Native, Expo, TypeScript    |

## Estrutura de Pastas

```
pi/
├── .agents/          # Instruções e workflows para o Gemini
├── api/              # Backend Python/FastAPI
│   ├── app/
│   │   ├── routers/  # Roteadores organizados por recurso
│   │   ├── models/   # Modelos Pydantic (schemas)
│   │   └── db/       # Configuração do banco de dados
│   ├── index.py      # Entry point da aplicação
│   ├── requirements.txt
│   └── vercel.json
└── front/            # App mobile React Native/Expo
    └── src/
        ├── screens/
        ├── components/
        └── services/
```

## Convenções de Código

### Backend (Python)
- Nomenclatura de arquivos: `snake_case`
- Nomenclatura de classes: `PascalCase`
- Rotas agrupadas por recurso em `app/routers/<recurso>.py`
- Schemas Pydantic em `app/models/<recurso>.py`
- Variáveis de ambiente via `python-dotenv` (`api/.env`)

### Frontend (TypeScript)
- Nomenclatura de componentes: `PascalCase`
- Nomenclatura de arquivos: `PascalCase` para componentes, `camelCase` para services/utils
- Telas em `src/screens/`
- Componentes reutilizáveis em `src/components/`

## Regras para o Gemini
- Sempre respeitar a separação entre `api/` e `front/`
- Novas rotas da API devem ser criadas em `api/app/routers/`
- Schemas de validação devem usar Pydantic em `api/app/models/`
- Alterações no banco requerem migration via Alembic
- Nunca commitar o arquivo `.env`
- Para decisões de deploy, consultar `/vercel-best-practices`
