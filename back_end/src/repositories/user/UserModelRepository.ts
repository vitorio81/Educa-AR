import { pool } from "../../config/database/connection";
import { User, UserAttributes } from "../../model/User";
import { UserRepository } from "./UserRepository";
import { hashPassword } from "../../utils/password";

export class UserMysqlRepository implements UserRepository {
  private map(row: any): User {
    return new User({
      userId: row.user_id,
      userName: row.user_name,
      userEmail: row.user_email,
      userSecret: row.user_secret,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findAll(): Promise<User[]> {
    const [rows]: any = await pool.query("SELECT * FROM users");

    return rows.map((row: any) => this.map(row));
  }

  async findById(userId: number): Promise<User | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [userId],
    );

    if (!rows.length) return null;

    return this.map(rows[0]);
  }

  async findByName(userName: string): Promise<User | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE user_name = ?",
      [userName],
    );

    if (!rows.length) return null;

    return this.map(rows[0]);
  }

  async findByEmail(userEmail: string): Promise<User | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE user_email = ?",
      [userEmail],
    );

    if (!rows.length) return null;

    return this.map(rows[0]);
  }

  async create(
    data: Omit<UserAttributes, "userId" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const hashedPassword = await hashPassword(data.userSecret);

    const [result]: any = await pool.query(
      `INSERT INTO users
       (user_name, user_email, user_secret, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [data.userName, data.userEmail, hashedPassword],
    );

    return new User({
      userId: result.insertId,
      userName: data.userName,
      userEmail: data.userEmail,
      userSecret: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(
    userId: number,
    data: Partial<Omit<UserAttributes, "userId" | "createdAt" | "updatedAt">>,
  ): Promise<User | null> {
    const fields = [];
    const values = [];

    if (data.userName) {
      fields.push("user_name = ?");
      values.push(data.userName);
    }

    if (data.userEmail) {
      fields.push("user_email = ?");
      values.push(data.userEmail);
    }

    if (data.userSecret) {
      const hashed = await hashPassword(data.userSecret);
      fields.push("user_secret = ?");
      values.push(hashed);
    }

    if (!fields.length) return null;

    values.push(userId);

    await pool.query(
      `UPDATE users SET ${fields.join(", ")}, updated_at = NOW()
       WHERE user_id = ?`,
      values,
    );

    return this.findById(userId);
  }

  async delete(userId: number): Promise<boolean> {
    const [result]: any = await pool.query(
      "DELETE FROM users WHERE user_id = ?",
      [userId],
    );

    return result.affectedRows > 0;
  }
}
