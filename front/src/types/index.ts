export interface StandardResponse<T> {
  message: string;
  status_code: number;
  data: T | null;
}

export interface ChaveValidacao {
  perfil: string;
  condominio: string;
  unidade?: string;
  bloco?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  perfil: string;
  nome: string;
  condominio: string;
  unidade: string;
}

export interface IRegisterForm {
  nome_completo: string;
  email: string;
  senha?: string; // Senha e confirmação são opcionais após a validação
  confirmacao_senha?: string;
  celular: string;
  rg: string;
  cpf: string;
  data_nascimento: string;
  chave_acesso: string;
}
