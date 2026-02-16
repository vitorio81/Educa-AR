export interface VisitorAttributes {
  visitorId: number;
  roomIds: number[];
  visitorEmail: string;
  visitorPassword: string;
  visitorStatus: string;
  visitedAt: Date;
}

export class Visitor {
  constructor(private attributes: VisitorAttributes) {}

  get data(): VisitorAttributes {
    return this.attributes;
  }

  toPublic() {
    const { visitorPassword, ...publicVisitor } = this.attributes;
    return publicVisitor;
  }
}
