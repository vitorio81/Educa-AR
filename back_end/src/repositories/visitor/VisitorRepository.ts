import { Visitor, VisitorAttributes } from "../../model/Visitor";

export interface VisitorRepository {
  findAll(): Promise<Visitor[]>;

  findByRoomIds(roomIds: number[]): Promise<Visitor[]>;

  findByRoomId(roomId: number): Promise<Visitor[]>;

  findById(visitorId: number): Promise<Visitor | null>;

  findByEmail(visitorEmail: string): Promise<Visitor | null>;

  findByEmailAndRooms(
    roomIds: number[],
    visitorEmail: string,
  ): Promise<Visitor | null>;

  create(
    attributes: Omit<
      VisitorAttributes,
      "visitorId" | "visitorStatus" | "visitedAt"
    >,
  ): Promise<Visitor>;

  update(
    visitorId: number,
    attributes: Partial<Omit<VisitorAttributes, "visitorId" | "visitedAt">>,
  ): Promise<Visitor | null>;

  delete(visitorId: number): Promise<boolean>;
}
