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


class UnauthorizedError(AppError):
    def __init__(
        self,
        mensagem: str = "Não foi possível validar as credenciais.",
        acao: str = "Realize o login novamente.",
    ):
        super().__init__(
            nome="nao_autorizado",
            mensagem=mensagem,
            acao=acao,
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class ForbiddenError(AppError):
    def __init__(
        self,
        mensagem: str = "Você não tem permissão para acessar este recurso.",
        acao: str = "Contate o administrador do sistema se precisar de mais privilégios.",
    ):
        super().__init__(
            nome="acesso_negado",
            mensagem=mensagem,
            acao=acao,
            status_code=status.HTTP_403_FORBIDDEN,
        )


class NotFoundError(AppError):
    def __init__(
        self,
        mensagem: str = "O recurso solicitado não foi encontrado.",
        acao: str = "Verifique o identificador e tente novamente.",
    ):
        super().__init__(
            nome="nao_encontrado",
            mensagem=mensagem,
            acao=acao,
            status_code=status.HTTP_404_NOT_FOUND,
        )
