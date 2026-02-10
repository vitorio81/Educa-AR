import api from "./api";

// Função auxiliar para pegar o token rapidamente
const getHeaders = () => {
  const token = localStorage.getItem("@EducaAR:token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const roomService = {
  // Listar
  getAll: (userId: number | string) =>
    api.get(`/rooms/${userId}`, getHeaders()).then((res) => res.data),

  // Criar
  create: (data: any) =>
    api.post(`/room`, data, getHeaders()).then((res) => res.data),

  // Atualizar
  update: (roomId: number, data: any) =>
    api.put(`/room/${roomId}`, data, getHeaders()).then((res) => res.data),

  // Excluir
  // Importante: No delete, o segundo argumento SÃO as configurações (onde vai o header)
  delete: (roomId: number) =>
    api.delete(`/room/${roomId}`, getHeaders()).then((res) => res.data),
};
