import { pool } from "../../config/database/connection";
import { Visitor, VisitorAttributes } from "../../model/Visitor";
import { VisitorRepository } from "./VisitorRepository";
import { hashPassword } from "../../utils/password";

export class VisitorMysqlRepository implements VisitorRepository {
  private async map(row: any): Promise<Visitor> {
    const [rooms]: any = await pool.query(
      "SELECT room_id FROM visitor_rooms WHERE visitor_id = ?",
      [row.visitor_id],
    );

    return new Visitor({
      visitorId: row.visitor_id,
      roomIds: rooms.map((r: any) => r.room_id),
      visitorEmail: row.visitor_email,
      visitorPassword: row.visitor_password,
      visitorStatus: row.visitor_status,
      visitedAt: row.visited_at,
    });
  }

  async findAll(): Promise<Visitor[]> {
    const [rows]: any = await pool.query("SELECT * FROM visitors");

    return Promise.all(rows.map((row: any) => this.map(row)));
  }

  async findByRoomIds(roomIds: number[]): Promise<Visitor[]> {
    const [rows]: any = await pool.query("SELECT * FROM visitors");

    const visitors = await Promise.all(rows.map((row: any) => this.map(row)));

    return visitors.filter((v: Visitor) =>
      v.data.roomIds.some((id: number) => roomIds.includes(id)),
    );
  }

  async findByRoomId(roomId: number): Promise<Visitor[]> {
    const visitors = await this.findAll();
    return visitors.filter((v) => v.data.roomIds.includes(roomId));
  }

  async findById(visitorId: number): Promise<Visitor | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM visitors WHERE visitor_id = ?",
      [visitorId],
    );

    if (!rows.length) return null;

    return this.map(rows[0]);
  }

  async findByEmail(visitorEmail: string): Promise<Visitor | null> {
    const [rows]: any = await pool.query(
      "SELECT * FROM visitors WHERE visitor_email = ?",
      [visitorEmail],
    );

    if (!rows.length) return null;
    return this.map(rows[0]);
  }

  async findByEmailAndRooms(
    roomIds: number[],
    visitorEmail: string,
  ): Promise<Visitor | null> {
    const visitor = await this.findByEmail(visitorEmail);
    if (!visitor) return null;

    const hasRoom = visitor.data.roomIds.some((id) => roomIds.includes(id));

    return hasRoom ? visitor : null;
  }

  async create(
    attributes: Omit<
      VisitorAttributes,
      "visitorId" | "visitorStatus" | "visitedAt"
    >,
  ): Promise<Visitor> {
    const hashedPassword = await hashPassword(attributes.visitorPassword);

    // cria visitante
    const [result]: any = await pool.query(
      `INSERT INTO visitors
     (visitor_email, visitor_password, visitor_status, visited_at)
     VALUES (?, ?, 'ativo', NOW())`,
      [attributes.visitorEmail, hashedPassword],
    );

    const visitorId = result.insertId;

    // cria vínculos com salas
    if (attributes.roomIds.length) {
      const values = attributes.roomIds.map((roomId) => [visitorId, roomId]);

      await pool.query(
        `INSERT INTO visitor_rooms (visitor_id, room_id) VALUES ?`,
        [values],
      );
    }

    return this.findById(visitorId) as Promise<Visitor>;
  }

  async update(
    visitorId: number,
    attributes: Partial<Omit<VisitorAttributes, "visitorId" | "visitedAt">>,
  ): Promise<Visitor | null> {
    const fields = [];
    const values = [];

    if (attributes.roomIds) {
      await pool.query("DELETE FROM visitor_rooms WHERE visitor_id = ?", [
        visitorId,
      ]);

      const values = attributes.roomIds.map((roomId) => [visitorId, roomId]);

      await pool.query(
        "INSERT INTO visitor_rooms (visitor_id, room_id) VALUES ?",
        [values],
      );
    }

    if (attributes.visitorEmail) {
      fields.push("visitor_email = ?");
      values.push(attributes.visitorEmail);
    }

    if (attributes.visitorPassword) {
      const hashed = await hashPassword(attributes.visitorPassword);
      fields.push("visitor_password = ?");
      values.push(hashed);
    }

    if (attributes.visitorStatus) {
      fields.push("visitor_status = ?");
      values.push(attributes.visitorStatus);
    }

    if (!fields.length) return null;

    values.push(visitorId);

    await pool.query(
      `UPDATE visitors
       SET ${fields.join(", ")}, visited_at = NOW()
       WHERE visitor_id = ?`,
      values,
    );

    return this.findById(visitorId);
  }

  async delete(visitorId: number): Promise<boolean> {
    const [result]: any = await pool.query(
      "DELETE FROM visitors WHERE visitor_id = ?",
      [visitorId],
    );

    return result.affectedRows > 0;
  }
}
