from fastapi import status


class AppError(Exception):
    def __init__(self, nome: str, mensagem: str, acao: str, status_code: int = 400):
        self.nome = nome
        self.mensagem = mensagem
        self.acao = acao
        self.status_code = status_code
        super().__init__(self.mensagem)


class ValidationError(AppError):
    def __init__(
        self,
        nome: str,
        mensagem: str,
        acao: str = "Verifique os dados enviados e tente novamente.",
    ):
        super().__init__(
            nome=nome,
            mensagem=mensagem,
            acao=acao,
            status_code=status.HTTP_400_BAD_REQUEST,
        )
