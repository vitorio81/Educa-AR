import api from "./api";

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  createdAt: string; 
  updatedAt: string;
}

export type CreateUserData = Pick<User, "userName" | "userEmail"> & {
  userSecret: string;
};

export const userService = {
  create: async (data: CreateUserData): Promise<User> => {
    const response = await api.post("/user", data);
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
};
