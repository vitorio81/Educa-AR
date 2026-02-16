import { pool } from "../../config/database/connection";
import { ObjectRa, ObjectRaAttributes } from "../../model/ObjectRa";
import { ObjectRaRepository } from "./ObjectRaRepository";
import { RowDataPacket } from "mysql2";

interface ObjectRow extends RowDataPacket {
  object_id: number;
  room_id: number;
  object_name: string;
  object_description: string;
  object_url: string;
  created_at: Date;
  updated_at: Date;
}

export class ObjectRaMysqlRepository implements ObjectRaRepository {
  private map(row: ObjectRow): ObjectRa {
    return new ObjectRa({
      objectId: row.object_id,
      roomId: row.room_id,
      objectName: row.object_name,
      objectDescription: row.object_description,
      objectUrl: row.object_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findAll(): Promise<ObjectRa[]> {
    const [rows] = await pool.query<ObjectRow[]>("SELECT * FROM objects");

    return rows.map((row) => this.map(row));
  }

  async findByRoomIds(roomIds: number[]): Promise<ObjectRa[]> {
    if (!roomIds.length) return [];

    const [rows] = await pool.query<ObjectRow[]>(
      `SELECT * FROM objects WHERE room_id IN (?)`,
      [roomIds],
    );

    return rows.map((row) => this.map(row));
  }

  async findByRoomId(roomId: number): Promise<ObjectRa[]> {
    const [rows] = await pool.query<ObjectRow[]>(
      `SELECT * FROM objects WHERE room_id = ?`,
      [roomId],
    );

    return rows.map((row) => this.map(row));
  }

  async findById(objectId: number): Promise<ObjectRa | null> {
    const [rows] = await pool.query<ObjectRow[]>(
      `SELECT * FROM objects WHERE object_id = ?`,
      [objectId],
    );

    if (!rows.length) return null;

    return this.map(rows[0]);
  }

  async create(
    data: Omit<ObjectRaAttributes, "objectId" | "createdAt" | "updatedAt">,
  ): Promise<ObjectRa> {
    const [result]: any = await pool.query(
      `INSERT INTO objects
       (room_id, object_name, object_description, object_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [data.roomId, data.objectName, data.objectDescription, data.objectUrl],
    );

    return new ObjectRa({
      objectId: result.insertId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(
    objectId: number,
    data: Partial<
      Omit<ObjectRaAttributes, "objectId" | "createdAt" | "updatedAt">
    >,
  ): Promise<ObjectRa | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.objectName !== undefined) {
      fields.push("object_name = ?");
      values.push(data.objectName);
    }

    if (data.objectDescription !== undefined) {
      fields.push("object_description = ?");
      values.push(data.objectDescription);
    }

    if (data.objectUrl !== undefined) {
      fields.push("object_url = ?");
      values.push(data.objectUrl);
    }

    if (data.roomId !== undefined) {
      fields.push("room_id = ?");
      values.push(data.roomId);
    }

    if (!fields.length) return null;

    values.push(objectId);

    await pool.query(
      `UPDATE objects
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE object_id = ?`,
      values,
    );

    return this.findById(objectId);
  }

  async delete(objectId: number): Promise<boolean> {
    const [result]: any = await pool.query(
      `DELETE FROM objects WHERE object_id = ?`,
      [objectId],
    );

    return result.affectedRows > 0;
  }
}
