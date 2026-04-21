import Joi from 'joi';
import * as common from './common';

export const loginSchema = Joi.object({
  email: common.email,
  senha: common.senha,
});

export const registerStep1Schema = Joi.object({
  nome_completo: common.nome_completo,
  email: common.email,
  senha: common.senha,
  confirmacao_senha: Joi.any().valid(Joi.ref('senha')).required().messages({
    'any.only': 'As senhas não coincidem',
  }),
  celular: common.celular,
});

export const registerStep2Schema = Joi.object({
  rg: common.rg,
  cpf: common.cpf,
  data_nascimento: common.data_nascimento,
});

export const registerSchema = registerStep1Schema
  .concat(registerStep2Schema)
  .append({ chave_acesso: common.chave_acesso });

export const recuperarSenhaSchema = Joi.object({
  email: common.email,
});

export const validarCodigoSchema = Joi.object({
  codigo: common.codigo,
});

export const resetarSenhaSchema = Joi.object({
  nova_senha: common.senha.min(8).messages({
    'string.min': 'A nova senha deve ter pelo menos 8 caracteres',
  }),
  confirmar_senha: Joi.any().valid(Joi.ref('nova_senha')).required().messages({
    'any.only': 'As senhas não coincidem',
    'any.required': 'A confirmação de senha é obrigatória',
  }),
});

