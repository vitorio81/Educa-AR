import api from "./api";

// Definindo a interface baseada no seu model do back-end
export interface CreateUserData {
  userName: string;
  userEmail: string;
  userSecret: string;
}

export const registroService = {
  create: async (data: CreateUserData) => {
    // Note: Não passamos getHeaders() aqui pois é uma rota pública
    const response = await api.post("/user", data);
    return response.data;
  },
};
