export interface UserAttributes {
  userId: number;
  userName: string;
  userEmail: string;
  userSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  constructor(private attributes: UserAttributes) {}

  get data(): UserAttributes {
    return this.attributes;
  }

  toPublic() {
    const { userSecret, ...publicUser } = this.attributes;
    return publicUser;
  }
}
