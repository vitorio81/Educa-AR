"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomMySQLRepository = void 0;
const connection_1 = require("../../config/database/connection");
const Room_1 = require("../../model/Room");
class RoomMySQLRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM rooms");
            return rows.map((row) => new Room_1.Room({
                roomId: row.room_id,
                userId: row.user_id,
                roomName: row.room_name,
                roomDescription: row.room_description,
                roomStatus: row.room_status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
        });
    }
    findById(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM rooms WHERE room_id = ?", [roomId]);
            if (!rows.length)
                return null;
            const row = rows[0];
            return new Room_1.Room({
                roomId: row.room_id,
                userId: row.user_id,
                roomName: row.room_name,
                roomDescription: row.room_description,
                roomStatus: row.room_status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            });
        });
    }
    findByName(roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM rooms WHERE room_name = ?", [roomName]);
            if (!rows.length)
                return null;
            const row = rows[0];
            return new Room_1.Room({
                roomId: row.room_id,
                userId: row.user_id,
                roomName: row.room_name,
                roomDescription: row.room_description,
                roomStatus: row.room_status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM rooms WHERE user_id = ?", [userId]);
            return rows.map((row) => new Room_1.Room({
                roomId: row.room_id,
                userId: row.user_id,
                roomName: row.room_name,
                roomDescription: row.room_description,
                roomStatus: row.room_status,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.pool.query(`INSERT INTO rooms 
       (user_id, room_name, room_description, room_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`, [data.userId, data.roomName, data.roomDescription, "ativa"]);
            return new Room_1.Room({
                roomId: result.insertId,
                userId: data.userId,
                roomName: data.roomName,
                roomDescription: data.roomDescription,
                roomStatus: "ativa",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });
    }
    update(roomId, data) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (!fields.length)
                return this.findById(roomId);
            values.push(roomId);
            yield connection_1.pool.query(`UPDATE rooms SET ${fields.join(", ")}, updated_at = NOW() WHERE room_id = ?`, values);
            return this.findById(roomId);
        });
    }
    delete(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.pool.query("DELETE FROM rooms WHERE room_id = ?", [roomId]);
            return result.affectedRows > 0;
        });
    }
}
exports.RoomMySQLRepository = RoomMySQLRepository;
