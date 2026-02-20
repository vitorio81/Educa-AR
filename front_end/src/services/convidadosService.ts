// front_end/src/services/convidadosService.ts
import api from "./api";

const getHeaders = () => {
  const token = localStorage.getItem("@EducaAR:token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const convidadoService = {
  // Lista visitantes vinculados ao professor (via salas dele)
  getByUser: (userId: number | string) =>
    api.get(`/visitors/user/${userId}`, getHeaders()).then((res) => res.data),

  // Plural para seguir o padrão REST do seu Controller
  getById: (id: number) =>
    api.get(`/visitors/${id}`, getHeaders()).then((res) => res.data),

  getByRoomId: (roomId: number) =>
    api.get(`/visitors/room/${roomId}`, getHeaders()).then((res) => res.data),

  create: (data: any) =>
    api.post(`/visitor`, data, getHeaders()).then((res) => res.data),

  update: (id: number, data: any) =>
    api.put(`/visitor/${id}`, data, getHeaders()).then((res) => res.data),

  delete: (id: number) =>
    api.delete(`/visitor/${id}`, getHeaders()).then((res) => res.data),
};
