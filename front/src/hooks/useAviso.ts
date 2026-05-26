import { useState, useEffect, useCallback } from "react";
import avisoService, { Aviso } from "../services/avisoService";
import { storage } from "@/utils/storage";

// Cache da lista em nível de módulo para persistir entre navegações
let listaCache: Aviso[] = [];

export const useAviso = (categoria?: string, limit: number = 20) => {
  const [avisos, setAvisos] = useState<Aviso[]>(listaCache);
  const [loading, setLoading] = useState(listaCache.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const carregarAvisos = useCallback(
    async (targetPage: number = 0, silent = false) => {
      try {
        if (!silent) setLoading(true);
        const offset = targetPage * limit;
        const data = await avisoService.listar(categoria, limit, offset);

        setAvisos(data.items);
        setTotal(data.total);
        setPage(targetPage);
        
        if (targetPage === 0) {
          listaCache = data.items; // Só atualiza o cache global na primeira página
        }

        setError(null);
      } catch (err: any) {
        setError("Falha ao carregar avisos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [categoria, limit],
  );

  useEffect(() => {
    carregarAvisos(0, listaCache.length > 0);
  }, [carregarAvisos]);

  useEffect(() => {
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
        if (message.type === "NEW_AVISO" || message.type === "UPDATE_AVISO") {
          carregarAvisos(0, true); // Atualiza silenciosamente via WS na primeira página
        }
      };
    };

    setupWebSocket();

    return () => {
      if (socket) socket.close();
    };
  }, [carregarAvisos]);

  return {
    avisos,
    loading,
    error,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNextPage: (page + 1) * limit < total,
    hasPrevPage: page > 0,
    nextPage: () => carregarAvisos(page + 1),
    prevPage: () => carregarAvisos(page - 1),
    refresh: () => carregarAvisos(0, false),
    criarAviso: async (dados: FormData) => {
      const result = await avisoService.criar(dados);
      carregarAvisos(0, true);
      return result;
    },
    deletarAviso: async (id: number) => {
      const result = await avisoService.deletar(id);
      carregarAvisos(0, true);
      return result;
    },
    atualizarAviso: async (id: number, dados: Partial<Aviso>) => {
      const result = await avisoService.atualizar(id, dados);
      carregarAvisos(0, true);
      return result;
    },
  };
};
