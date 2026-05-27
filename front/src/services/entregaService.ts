import api from "./api";

export type StatusEntrega = "AGUARDANDO" | "RECEBIDA" | "RETIRADA" | "CANCELADA";
export type CategoriaEntrega = "CARTA" | "PACOTE";

export interface Entrega {
  id: number;
  morador_id: number;
  tipo: CategoriaEntrega;
  status: StatusEntrega;
  prazo_retirada: string; // ISO 8601 string
  mensagem?: string;
  observacao_porteiro?: string;
  justificativa_cancelamento?: string;
  criado_em: string;
  atualizado_em: string;
  quem_recebeu?: number;
}

export interface CreateEntregaDTO {
  tipo: CategoriaEntrega;
  prazo_retirada: string;
  mensagem?: string;
}

export interface UpdateStatusEntregaDTO {
  status: StatusEntrega;
  justificativa_cancelamento?: string;
  observacao_porteiro?: string;
}

export interface PaginatedEntregas {
  total: number;
  items: Entrega[];
}

const entregaService = {
  criar: async (dados: CreateEntregaDTO): Promise<Entrega> => {
    const response = await api.post("/entregas", dados);
    return response.data.data;
  },

  listarMorador: async (limit: number = 20, offset: number = 0): Promise<PaginatedEntregas> => {
    const response = await api.get("/entregas/morador", {
      params: { limit, offset },
    });
    return response.data.data;
  },

  listarCondominio: async (limit: number = 20, offset: number = 0): Promise<PaginatedEntregas> => {
    const response = await api.get("/entregas/condominio", {
      params: { limit, offset },
    });
    return response.data.data;
  },

  obterPorId: async (id: number): Promise<Entrega> => {
    const response = await api.get(`/entregas/${id}`);
    return response.data.data;
  },

  atualizarStatus: async (id: number, dados: UpdateStatusEntregaDTO): Promise<Entrega> => {
    const response = await api.patch(`/entregas/${id}/status`, dados);
    return response.data.data;
  },

  deletar: async (id: number): Promise<void> => {
    await api.delete(`/entregas/${id}`);
  },
};

export default entregaService;
