import { useState, useEffect, useCallback } from 'react';
import agendamentoService, { Espaco, Reserva, HorarioDisponivel } from '../services/agendamentoService';

export const useAgendamento = () => {
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [minhasReservas, setMinhasReservas] = useState<Reserva[]>([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarEspacos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agendamentoService.listarEspacos();
      setEspacos(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar espaços');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarMinhasReservas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agendamentoService.listarMinhasReservas();
      setMinhasReservas(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar suas reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarHorariosDisponiveis = useCallback(async (espacoId: number, data: string) => {
    try {
      setLoading(true);
      const slots = await agendamentoService.listarHorariosDisponiveis(espacoId, data);
      setHorariosDisponiveis(slots);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar horários disponíveis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const realizarReserva = async (dados: { espaco_id: number; data: string; horario_inicio: string; horario_fim: string }) => {
    try {
      setLoading(true);
      const novaReserva = await agendamentoService.criarReserva(dados);
      setMinhasReservas(prev => [novaReserva, ...prev]);
      return novaReserva;
    } catch (err) {
      setError('Falha ao realizar reserva');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (reservaId: number) => {
    try {
      setLoading(true);
      await agendamentoService.cancelarReserva(reservaId);
      setMinhasReservas(prev => prev.filter(r => r.id !== reservaId));
    } catch (err) {
      setError('Falha ao cancelar reserva');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    espacos,
    minhasReservas,
    horariosDisponiveis,
    loading,
    error,
    carregarEspacos,
    carregarMinhasReservas,
    carregarHorariosDisponiveis,
    realizarReserva,
    cancelarReserva
  };
};
