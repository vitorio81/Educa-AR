import { ObjectRa, ObjectRaAttributes } from "../../model/ObjectRa";

export interface ObjectRaRepository {
  findAll(): Promise<ObjectRa[]>;

  findByRoomIds(roomIds: number[]): Promise<ObjectRa[]>;

  findByRoomId(roomId: number): Promise<ObjectRa[]>;

  findById(objectId: number): Promise<ObjectRa | null>;

  create(
    data: Omit<ObjectRaAttributes, "objectId" | "createdAt" | "updatedAt">,
  ): Promise<ObjectRa>;

  update(
    objectId: number,
    data: Partial<
      Omit<ObjectRaAttributes, "objectId" | "createdAt" | "updatedAt">
    >,
  ): Promise<ObjectRa | null>;

  delete(objectId: number): Promise<boolean>;
}
