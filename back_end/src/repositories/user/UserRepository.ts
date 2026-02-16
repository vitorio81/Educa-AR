import { User } from "../../model/User";
import { UserAttributes } from "../../model/User";

export interface UserRepository {
  findAll(): Promise<User[]>;

  findById(userId: number): Promise<User | null>;

  findByName(userName: string): Promise<User | null>;

  findByEmail(userEmail: string): Promise<User | null>;

  create(
    data: Omit<UserAttributes, "userId" | "createdAt" | "updatedAt">,
  ): Promise<User>;

  update(
    userId: number,
    data: Partial<Omit<UserAttributes, "userId" | "createdAt" | "updatedAt">>,
  ): Promise<User | null>;

  delete(userId: number): Promise<boolean>;
}
