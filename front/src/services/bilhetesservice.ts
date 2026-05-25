import api from "@/services/api"

//ROTAS
//GET
export const listar_bilhetes = async () => {
    const response = await api.get("/bilhete/listar-bilhetes");
    return response.data;
};

//POST
export const criar_bilhete = async (payload: { assunto: string; mensagem: string; unidade: string; bloco: string | null; andar: string; categoria: string; numero?: undefined; prefixo?: undefined; } | { assunto: string; mensagem: string; numero: string; prefixo: string; categoria: string; unidade?: undefined; bloco?: undefined; andar?: undefined; }) => {
    const response = await api.post("/bilhete/criar-bilhetes", payload);
    return response.data;
};

//DELETE
export const deletar_bilhete = async (id: number) => {
    const response = await api.delete(`/bilhete/deletar-bilhetes/${id}`);
    return response.data;
};
