import { Room } from "../../model/Room";
import { RoomAttributes } from "../../model/Room";

export interface RoomRepository {
  findAll(): Promise<Room[]>;

  findById(roomId: number): Promise<Room | null>;

  findByName(roomName: string): Promise<Room | null>;

  findByUserId(userId: number): Promise<Room[]>;

  create(
    data: Omit<
      RoomAttributes,
      "roomId" | "roomStatus" | "createdAt" | "updatedAt"
    >,
  ): Promise<Room>;

  update(
    roomId: number,
    data: Partial<Omit<RoomAttributes, "roomId" | "createdAt">>,
  ): Promise<Room | null>;

  delete(roomId: number): Promise<boolean>;
}
