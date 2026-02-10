import api from "./api";

const getHeaders = () => {
  const token = localStorage.getItem("@EducaAR:token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const convidadoService = {
  getByUser: (userId: number | string) =>
    api.get(`/visitors/user/${userId}`, getHeaders()).then((res) => res.data),

  getByRoom: (roomId: number | string) =>
    api.get(`/visitors/room/${roomId}`, getHeaders()).then((res) => res.data),

  getById: (visitorId: number) =>
    api.get(`/visitor/${visitorId}`, getHeaders()).then((res) => res.data),

  create: (data: any) =>
    api.post(`/visitor`, data, getHeaders()).then((res) => res.data),

  update: (visitorId: number, data: any) =>
    api
      .put(`/visitor/${visitorId}`, data, getHeaders())
      .then((res) => res.data),

  delete: (visitorId: number) =>
    api.delete(`/visitor/${visitorId}`, getHeaders()).then((res) => res.data),
};
