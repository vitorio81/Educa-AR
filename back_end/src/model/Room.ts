export interface RoomAttributes {
  roomId: number;
  userId: number;
  roomName: string;
  roomDescription: string;
  roomStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Room {
  constructor(private attributes: RoomAttributes) {}

  get data(): RoomAttributes {
    return this.attributes;
  }

  update(data: Partial<Omit<RoomAttributes, "roomId" | "createdAt">>) {
    this.attributes = {
      ...this.attributes,
      ...data,
      updatedAt: new Date(),
    };
  }

  toJSON(): RoomAttributes {
    return this.attributes;
  }
}

