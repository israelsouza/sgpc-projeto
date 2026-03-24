---
description: como rodar o backend localmente
---

1. Acesse a pasta da API:
```
cd api
```

2. Crie e ative o ambiente virtual Python:
```
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Instale as dependências:
// turbo
```
pip install -r requirements.txt
```

4. Copie o `.env.example` e preencha as variáveis:
```
copy .env.example .env
```

5. Rode o servidor em modo desenvolvimento:
```
uvicorn index:app --reload
```

O servidor estará disponível em `http://localhost:8000`.
A documentação Swagger estará em `http://localhost:8000/docs`.
