import api from './api';

export interface HistoricoItem {
  id: string;
  titulo: string;
  subtitulo: string;
  tipo: string;
  data: string;
  icon_name: string;
  icon_library: "Feather" | "MaterialCommunityIcons" | "AntDesign";
  icon_bg: string;
  icon_color: string;
}

const historicoService = {
  async listar(limit: number = 10, offset: number = 0) {
    const response = await api.get<HistoricoItem[]>('/historico', {
      params: { limit, offset }
    });
    return response.data;
  },
};

export default historicoService;
