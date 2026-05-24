import api from './api';

export interface Espaco {
  id: number;
  nome: string;
  icone: string;
  cor: string;
  descricao?: string;
  capacidade?: number;
}

export interface Reserva {
  id: number;
  espaco_id: number;
  espaco?: Espaco;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
  criado_em: string;
}

export interface HorarioDisponivel {
  id: string;
  horario: string;
  status: 'available' | 'busy';
}

const espacosMock: Espaco[] = [
  { id: 1, nome: "Salão de Festas", icone: "gift", cor: "#b7839f" },
  { id: 2, nome: "Churrasqueira", icone: "bonfire", cor: "#efacac" },
  { id: 3, nome: "Quadra", icone: "basketball", cor: "#08501b" },
  { id: 4, nome: "Academia", icone: "dumbbell", cor: "#9ED99C" },
];

const minhasReservasMock: Reserva[] = [
  {
    id: 1,
    espaco_id: 1,
    espaco: espacosMock[0],
    data: "20/04/26",
    horario_inicio: "18:00",
    horario_fim: "22:00",
    status: "confirmado",
    criado_em: "2026-03-01T10:00:00Z",
  },
  {
    id: 2,
    espaco_id: 2,
    espaco: espacosMock[1],
    data: "25/04/26",
    horario_inicio: "12:00",
    horario_fim: "16:00",
    status: "confirmado",
    criado_em: "2026-03-01T10:00:00Z",
  },
  {
    id: 3,
    espaco_id: 3,
    espaco: espacosMock[2],
    data: "30/04/26",
    horario_inicio: "09:00",
    horario_fim: "11:00",
    status: "confirmado",
    criado_em: "2026-03-01T10:00:00Z",
  },
];

const horariosMock: HorarioDisponivel[] = [
  { id: '1', horario: "08:00 - 09:00", status: 'available' },
  { id: '2', horario: "09:00 - 10:00", status: 'available' },
  { id: '3', horario: "10:00 - 11:00", status: 'busy' },
  { id: '4', horario: "11:00 - 12:00", status: 'available' },
  { id: '5', horario: "12:00 - 13:00", status: 'busy' },
  { id: '6', horario: "13:00 - 14:00", status: 'available' },
];

const agendamentoService = {
  async listarEspacos() {
    // const response = await api.get<any>('/agendamentos/espacos');
    // return response.data.data as Espaco[];
    return espacosMock;
  },

  async listarMinhasReservas() {
    // const response = await api.get<any>('/agendamentos/minhas-reservas');
    // return response.data.data as Reserva[];
    return minhasReservasMock;
  },

  async listarHorariosDisponiveis(espacoId: number, data: string) {
    // const response = await api.get<any>(`/agendamentos/espacos/${espacoId}/horarios`, {
    //   params: { data }
    // });
    // return response.data.data as HorarioDisponivel[];
    return horariosMock;
  },

  async criarReserva(dados: { espaco_id: number; data: string; horario_inicio: string; horario_fim: string }) {
    // const response = await api.post<any>('/agendamentos/reservas', dados);
    // return response.data.data as Reserva;
    const novaReserva: Reserva = {
      id: Math.floor(Math.random() * 1000),
      ...dados,
      status: 'confirmado',
      criado_em: new Date().toISOString(),
      espaco: espacosMock.find(e => e.id === dados.espaco_id)
    };
    return novaReserva;
  },

  async cancelarReserva(reservaId: number) {
    // const response = await api.delete<any>(`/agendamentos/reservas/${reservaId}`);
    // return response.data.data;
    return { message: "Reserva cancelada com sucesso" };
  }
};

export default agendamentoService;
