import api from "@/services/api"

export const listar_manifestacoes = async () => {
    const response = await api.get("/manifestacao/listar-manifestacoes");
    return response.data;
};

export const criar_manifestacao = async (payload: { assunto: string; mensagem: string; unidade: string; bloco: string | null; andar: string; categoria: string; numero?: undefined; prefixo?: undefined; } | { assunto: string; mensagem: string; numero: string; prefixo: string; categoria: string; unidade?: undefined; bloco?: undefined; andar?: undefined; }) => {
    const response = await api.post("/manifestacao/criar-manifestacao");
    return response.data;
};

export const atualizar_manifestacao = async (id: Number, payload: any) => {
    const response = await api.put("/manifestacao/atualizar-manifestacao");
    return response.data;
};

export const delete_manifestacao = async (id: Number) => {
    const response = await api.delete("/manifestacao/deletar-manifestacao");
    return response.data;
};