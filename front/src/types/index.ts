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
}
