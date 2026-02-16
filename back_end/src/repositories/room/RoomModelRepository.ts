import { pool } from "../../config/database/connection";
import { Room, RoomAttributes } from "../../model/Room";
import { RoomRepository } from "./RoomRepository";

export class RoomMySQLRepository implements RoomRepository {
  async findAll(): Promise<Room[]> {
    const [rows] = await pool.query<any[]>("SELECT * FROM rooms");

    return rows.map(
      (row) =>
        new Room({
          roomId: row.room_id,
          userId: row.user_id,
          roomName: row.room_name,
          roomDescription: row.room_description,
          roomStatus: row.room_status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
    );
  }

  async findById(roomId: number): Promise<Room | null> {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM rooms WHERE room_id = ?",
      [roomId],
    );

    if (!rows.length) return null;

    const row = rows[0];

    return new Room({
      roomId: row.room_id,
      userId: row.user_id,
      roomName: row.room_name,
      roomDescription: row.room_description,
      roomStatus: row.room_status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findByName(roomName: string): Promise<Room | null> {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM rooms WHERE room_name = ?",
      [roomName],
    );

    if (!rows.length) return null;

    const row = rows[0];

    return new Room({
      roomId: row.room_id,
      userId: row.user_id,
      roomName: row.room_name,
      roomDescription: row.room_description,
      roomStatus: row.room_status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  async findByUserId(userId: number): Promise<Room[]> {
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM rooms WHERE user_id = ?",
      [userId],
    );

    return rows.map(
      (row) =>
        new Room({
          roomId: row.room_id,
          userId: row.user_id,
          roomName: row.room_name,
          roomDescription: row.room_description,
          roomStatus: row.room_status,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }),
    );
  }

  async create(
    data: Omit<
      RoomAttributes,
      "roomId" | "roomStatus" | "createdAt" | "updatedAt"
    >,
  ): Promise<Room> {
    const [result]: any = await pool.query(
      `INSERT INTO rooms 
       (user_id, room_name, room_description, room_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [data.userId, data.roomName, data.roomDescription, "ativa"],
    );

    return new Room({
      roomId: result.insertId,
      userId: data.userId,
      roomName: data.roomName,
      roomDescription: data.roomDescription,
      roomStatus: "ativa",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(
    roomId: number,
    data: Partial<Omit<RoomAttributes, "roomId" | "createdAt">>,
  ): Promise<Room | null> {
    const fields = [];
    const values = [];

    if (data.roomName !== undefined) {
      fields.push("room_name = ?");
      values.push(data.roomName);
    }

    if (data.roomDescription !== undefined) {
      fields.push("room_description = ?");
      values.push(data.roomDescription);
    }

    if (data.roomStatus !== undefined) {
      fields.push("room_status = ?");
      values.push(data.roomStatus);
    }

    if (!fields.length) return this.findById(roomId);

    values.push(roomId);

    await pool.query(
      `UPDATE rooms SET ${fields.join(", ")}, updated_at = NOW() WHERE room_id = ?`,
      values,
    );

    return this.findById(roomId);
  }

  async delete(roomId: number): Promise<boolean> {
    const [result]: any = await pool.query(
      "DELETE FROM rooms WHERE room_id = ?",
      [roomId],
    );

    return result.affectedRows > 0;
  }
}
