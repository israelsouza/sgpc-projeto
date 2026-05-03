---
description: como rodar o backend localmente com Poetry
---

> O projeto usa **Poetry** para gerenciar dependências. Certifique-se de ter o Python 3.14+ instalado via [python.org](https://www.python.org/downloads/) (**não** pela Microsoft Store) e o Poetry instalado.

1. Acesse a pasta da API:
```
cd api
```

2. Instale as dependências (na primeira vez ou após mudanças no `pyproject.toml`):
// turbo
```
poetry install
```

3. Copie o `.env.example` e preencha as variáveis (apenas na primeira vez):
```
copy .env.example .env
```

4. Rode o servidor em modo desenvolvimento:
```
poetry run uvicorn index:app --reload
```

O servidor estará disponível em `http://localhost:8000`.
A documentação Swagger estará em `http://localhost:8000/docs`.

## Outros comandos úteis

- Adicionar dependência: `poetry add <pacote>`
- Adicionar dependência de dev: `poetry add --group dev <pacote>`
- Remover dependência: `poetry remove <pacote>`
- Criar migração: `poetry run alembic revision --autogenerate -m "descricao"`
- Aplicar migrações: `poetry run alembic upgrade head`

> ⚠️ Após adicionar/remover dependências, regere o `requirements.txt` usado pela Vercel:
> `poetry export -f requirements.txt --output requirements.txt --without-hashes`
