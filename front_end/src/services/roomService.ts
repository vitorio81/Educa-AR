import api from "./api";
import { type Room, type CreateRoomData } from "../types/room";

const getHeaders = () => {
  const token = localStorage.getItem("@EducaAR:token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const roomService = {
  getAll: async (userId: number): Promise<Room[]> => {
    const response = await api.get(`/rooms/${userId}`, getHeaders());
    return response.data;
  },

  create: async (data: CreateRoomData): Promise<Room> => {
    const response = await api.post(`/room`, data, getHeaders());
    return response.data;
  },

  update: async (
    roomId: number,
    data: Partial<CreateRoomData>,
  ): Promise<Room> => {
    const response = await api.put(`/room/${roomId}`, data, getHeaders());
    return response.data;
  },

  delete: async (roomId: number): Promise<void> => {
    await api.delete(`/room/${roomId}`, getHeaders());
  },
};
