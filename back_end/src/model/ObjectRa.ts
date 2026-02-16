export interface ObjectRaAttributes {
  objectId: number;
  roomId: number;
  objectName: string;
  objectDescription: string;
  objectUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ObjectRa {
  constructor(private attributes: ObjectRaAttributes) {}

  get data(): ObjectRaAttributes {
    return this.attributes;
  }
}
