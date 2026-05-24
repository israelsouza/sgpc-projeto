import { useState, useEffect, useCallback } from "react";
import entregaService, { Entrega, CreateEntregaDTO, UpdateStatusEntregaDTO } from "../services/entregaService";
import * as SecureStore from "expo-secure-store";

let listaCacheMorador: Entrega[] = [];
let listaCacheCondominio: Entrega[] = [];

export const useEntrega = (tipoVisao: "morador" | "condominio" = "morador", limit: number = 20) => {
  const [entregas, setEntregas] = useState<Entrega[]>(
    tipoVisao === "morador" ? listaCacheMorador : listaCacheCondominio
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const carregarEntregas = useCallback(
    async (targetPage: number = 0, silent = false) => {
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
          else listaCacheCondominio = data.items;
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
    carregarEntregas(0, 
      (tipoVisao === "morador" && listaCacheMorador.length > 0) || 
      (tipoVisao === "condominio" && listaCacheCondominio.length > 0)
    );
  }, [carregarEntregas, tipoVisao]);

  useEffect(() => {
    let socket: WebSocket | null = null;

    const setupWebSocket = async () => {
      const condoId = await SecureStore.getItemAsync("user_condominio_id");
      if (!condoId) return;

      const wsUrl =
        (
          process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api"
        ).replace("http", "ws") + `/avisos/ws/${condoId}`; // O WebSocket geral do condomínio fica em avisos/ws

      socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "NEW_ENTREGA" || message.type === "UPDATE_ENTREGA") {
          carregarEntregas(0, true); // Atualiza silenciosamente via WS na primeira página
        }
      };
    };

    setupWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [carregarEntregas]);

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
