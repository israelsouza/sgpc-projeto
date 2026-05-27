import { useState, useEffect, useCallback } from "react";
import entregaService, { Entrega, CreateEntregaDTO, UpdateStatusEntregaDTO } from "../services/entregaService";
import { storage } from "@/utils/storage";

let listaCacheMorador: Entrega[] = [];
let listaCacheCondominio: Entrega[] = [];

/**
 * Hook para gerenciar entregas com suporte a visões de morador e condomínio (porteiro).
 * @param tipoVisao Se omitido, o hook não carregará os dados automaticamente até que seja definido.
 */
export const useEntrega = (tipoVisao?: "morador" | "condominio", limit: number = 20) => {
  const [entregas, setEntregas] = useState<Entrega[]>(
    tipoVisao === "morador" ? listaCacheMorador : tipoVisao === "condominio" ? listaCacheCondominio : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const carregarEntregas = useCallback(
    async (targetPage: number = 0, silent = false) => {
      if (!tipoVisao) return;

      try {
        if (!silent) setLoading(true);
        const offset = targetPage * limit;
        
        const data = tipoVisao === "morador" 
          ? await entregaService.listarMorador(limit, offset)
          : await entregaService.listarCondominio(limit, offset);

        setEntregas(data.items);
        setTotal(data.total);
        setPage(targetPage);
        
        if (targetPage === 0) {
          if (tipoVisao === "morador") listaCacheMorador = data.items;
          else if (tipoVisao === "condominio") listaCacheCondominio = data.items;
        }

        setError(null);
      } catch (err: any) {
        setError("Falha ao carregar entregas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [limit, tipoVisao],
  );

  useEffect(() => {
    if (!tipoVisao) return;

    carregarEntregas(0, 
      (tipoVisao === "morador" && listaCacheMorador.length > 0) || 
      (tipoVisao === "condominio" && listaCacheCondominio.length > 0)
    );
  }, [carregarEntregas, tipoVisao]);

  useEffect(() => {
    if (!tipoVisao) return;

    let socket: WebSocket | null = null;

    const setupWebSocket = async () => {
      const condoId = await storage.getItemAsync("user_condominio_id");
      if (!condoId) return;

      const wsUrl =
        (
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api"
        ).replace("http", "ws") + `/avisos/ws/${condoId}`;

      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "NEW_ENTREGA" || message.type === "UPDATE_ENTREGA") {
          carregarEntregas(0, true);
        }
      };
    };

    setupWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [carregarEntregas, tipoVisao]);

  const criarEntrega = async (dados: CreateEntregaDTO) => {
    try {
      setLoading(true);
      await entregaService.criar(dados);
      await carregarEntregas(0, true);
    } catch (err) {
      console.error("Erro ao criar entrega:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (id: number, dados: UpdateStatusEntregaDTO) => {
    try {
      setLoading(true);
      await entregaService.atualizarStatus(id, dados);
      await carregarEntregas(page, true);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarEntrega = async (id: number) => {
    try {
      setLoading(true);
      await entregaService.deletar(id);
      await carregarEntregas(page, true);
    } catch (err) {
      console.error("Erro ao deletar entrega:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const obterPorId = async (id: number) => {
    return await entregaService.obterPorId(id);
  };

  return {
    entregas,
    loading,
    error,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: (page + 1) * limit < total,
    hasPrevPage: page > 0,
    nextPage: () => carregarEntregas(page + 1),
    prevPage: () => carregarEntregas(page - 1),
    refresh: () => carregarEntregas(0, false),
    criarEntrega,
    atualizarStatus,
    deletarEntrega,
    obterPorId,
  };
};
