import Joi from 'joi';

// Regras granulares para reaproveitamento
export const nome_completo = Joi.string().trim().min(3).max(100).pattern(/^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ\s]+$/).required().messages({
  'string.empty': 'O nome completo é obrigatório',
  'string.min': 'O nome deve ter pelo menos 3 caracteres',
  'string.max': 'O nome deve ter no máximo 100 caracteres',
  'string.pattern.base': 'O nome não deve conter números e deve ter pelo menos uma letra',
});

export const email = Joi.string().email({ tlds: { allow: false } }).max(100).required().messages({
  'string.email': 'Insira um e-mail válido',
  'string.empty': 'O e-mail é obrigatório',
  'string.max': 'O e-mail deve ter no máximo 100 caracteres',
});

export const senha = Joi.string().min(6).max(70).required().messages({
  'string.min': 'A senha deve ter pelo menos 6 caracteres',
  'string.max': 'A senha deve ter no máximo 70 caracteres',
  'string.empty': 'A senha é obrigatória',
});

export const celular = Joi.string().pattern(/^[0-9]+$/).min(10).max(11).required().messages({
  'string.pattern.base': 'O celular deve conter apenas números',
  'string.min': 'Celular deve ter DDD + número (mínimo 10 dígitos)',
  'string.max': 'Celular inválido',
});

export const rg = Joi.string().pattern(/^[0-9]+$/).max(9).required().messages({
  'string.empty': 'O RG é obrigatório',
  'string.max': 'O RG deve ter no máximo 9 números',
  'string.pattern.base': 'O RG deve conter apenas números',
});

export const cpf = Joi.string().length(11).pattern(/^[0-9]+$/).required().messages({
  'string.length': 'O CPF deve ter exatamente 11 números',
  'string.pattern.base': 'O CPF deve conter apenas números',
});

export const data_nascimento = Joi.string().length(8).regex(/^\d{8}$/).custom((value, helpers) => {
  const day = parseInt(value.substring(0, 2), 10);
  const month = parseInt(value.substring(2, 4), 10);
  const year = parseInt(value.substring(4, 8), 10);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return helpers.error('date.invalid');
  }

  // Optional reasonable year range check
  if (year < 1900 || year > new Date().getFullYear()) {
    return helpers.error('date.invalid');
  }

  return value;
}).required().messages({
  'string.length': 'A data deve ter exatamente 8 números',
  'string.pattern.base': 'A data deve estar no formato DDMMAAAA',
  'date.invalid': 'A data de nascimento é inválida',
  'any.required': 'A data de nascimento é obrigatória',
});

export const chave_acesso = Joi.string().guid({ version: ['uuidv4'] }).required().messages({
  'string.guid': 'Chave de acesso inválida',
});
