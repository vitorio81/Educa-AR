export interface Room {
  roomId: number;
  roomName: string;
  roomDescription: string;
  roomStatus: "ativa" | "inativa";
  userId: number;
  createdAt?: string;
}

export type CreateRoomData = Omit<Room, "roomId" | "createdAt">;
