import api from "./api";

// Função auxiliar para pegar o token
const getHeaders = () => {
  const token = localStorage.getItem("@EducaAR:token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const objetoService = {
  getByUser: (userId: number | string) =>
    api.get(`/objectsRa/user/${userId}`, getHeaders()).then((res) => res.data),

  getByRoom: (roomId: number | string) =>
    api.get(`/objectsRa/room/${roomId}`, getHeaders()).then((res) => res.data),

  getById: (objectId: number | string) =>
    api.get(`/objectsRa/${objectId}`, getHeaders()).then((res) => res.data),

  create: (data: any) =>
    api.post(`/objectsRa`, data, getHeaders()).then((res) => res.data),

  update: (objectId: number, data: any) =>
    api
      .put(`/objectsRa/${objectId}`, data, getHeaders())
      .then((res) => res.data),

  delete: (objectId: number) =>
    api.delete(`/objectsRa/${objectId}`, getHeaders()).then((res) => res.data),
};
