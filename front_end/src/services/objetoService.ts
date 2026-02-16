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

  create: (data: FormData, onProgress?: (percent: number) => void) =>
    api
      .post(`/objectsRa`, data, {
        ...getHeaders(),
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!onProgress) return;

          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );

          onProgress(percent);
        },
      })
      .then((res) => res.data),

  update: (objectId: number, data: FormData) =>
    api
      .put(`/objectsRa/${objectId}`, data, {
        ...getHeaders(),
        headers: {
          ...getHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => res.data),

  delete: (objectId: number) =>
    api.delete(`/objectsRa/${objectId}`, getHeaders()).then((res) => res.data),
};
