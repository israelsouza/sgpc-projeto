import api from './api';

export interface Espaco {
  id: number;
  nome: string;
  icone: string;
  cor: string;
}

export interface Reserva {
  id: number;
  data_reserva: string;
  usuario_id: number;
  espaco_id: number;
  espaco?: Espaco;
}

export interface HorarioDisponivel {
  id: string;
  horario: string;
  status: 'available' | 'busy';
}

const agendamentoService = {
  async listarEspacos() {
    const response = await api.get<Espaco[]>('/agendamentos/listar-espacos');
    return response.data;
  },

  async listarMinhasReservas() {
    const response = await api.get<Reserva[]>('/agendamentos/listar-reservas');
    return response.data;
  },

  async listarHorariosDisponiveis(espacoId: number, data: string) {
    const response = await api.get<HorarioDisponivel[]>(`/agendamentos/listar-horarios/${espacoId}`, {
      params: { data }
    });
    return response.data;
  },

  async criarReserva(dados: any) {
    const response = await api.post<Reserva>('/agendamentos/criar-reservas', dados);
    return response.data;
  },

  async atualizarReserva(reservaId: number, dados: { data_reserva: string }) {
    const response = await api.put<Reserva>(`/agendamentos/atualizar-reserva/${reservaId}`, dados);
    return response.data;
  },

  async cancelarReserva(reservaId: number) {
    const response = await api.delete(`/agendamentos/deletar-reserva/${reservaId}`);
    return response.data;
  }
};

export default agendamentoService;
