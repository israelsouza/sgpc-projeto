import { useState, useEffect, useCallback } from "react";
import historicoService, { HistoricoItem } from "../services/historicoService";

export const useHistorico = (limit: number = 10) => {
  const [itens, setItens] = useState<HistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const carregar = useCallback(async (targetPage: number = 0) => {
    try {
      setLoading(true);
      const offset = targetPage * limit;
      const data = await historicoService.listar(limit, offset);
      setItens(data);
      setPage(targetPage);
      setError(null);
    } catch (err: any) {
      setError("Falha ao carregar histórico");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    carregar(0);
  }, [carregar]);

  return { 
    itens, 
    loading, 
    error, 
    page,
    refresh: () => carregar(0),
    nextPage: () => carregar(page + 1),
    prevPage: () => carregar(page - 1),
    hasNextPage: itens.length === limit,
    hasPrevPage: page > 0
  };
};
