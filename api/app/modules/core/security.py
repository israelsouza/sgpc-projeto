import bcrypt


def hash_senha(senha: str) -> str:
    """Gera um hash seguro da senha."""
    salt = bcrypt.gensalt()
    # O hashpw retorna bytes, então decodificamos para string para salvar no banco
    hashed = bcrypt.hashpw(senha.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verificar_senha(senha_plana: str, senha_hash: str) -> bool:
    """Verifica se a senha plana coincide com o hash do banco."""
    return bcrypt.checkpw(senha_plana.encode("utf-8"), senha_hash.encode("utf-8"))
