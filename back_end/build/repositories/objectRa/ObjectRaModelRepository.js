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
exports.ObjectRaMysqlRepository = void 0;
const connection_1 = require("../../config/database/connection");
const ObjectRa_1 = require("../../model/ObjectRa");
class ObjectRaMysqlRepository {
    map(row) {
        return new ObjectRa_1.ObjectRa({
            objectId: row.object_id,
            roomId: row.room_id,
            objectName: row.object_name,
            objectDescription: row.object_description,
            objectUrl: row.object_url,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM objects");
            return rows.map((row) => this.map(row));
        });
    }
    findByRoomIds(roomIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!roomIds.length)
                return [];
            const [rows] = yield connection_1.pool.query(`SELECT * FROM objects WHERE room_id IN (?)`, [roomIds]);
            return rows.map((row) => this.map(row));
        });
    }
    findByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query(`SELECT * FROM objects WHERE room_id = ?`, [roomId]);
            return rows.map((row) => this.map(row));
        });
    }
    findByRoomObjectId(roomId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query(`
    SELECT *
    FROM objects
    WHERE room_id = ?
      AND object_id = ?
    LIMIT 1
    `, [roomId, objectId]);
            if (rows.length === 0) {
                return null;
            }
            return this.map(rows[0]);
        });
    }
    findById(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query(`SELECT * FROM objects WHERE object_id = ?`, [objectId]);
            if (!rows.length)
                return null;
            return this.map(rows[0]);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.pool.query(`INSERT INTO objects
       (room_id, object_name, object_description, object_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`, [data.roomId, data.objectName, data.objectDescription, data.objectUrl]);
            return new ObjectRa_1.ObjectRa(Object.assign(Object.assign({ objectId: result.insertId }, data), { createdAt: new Date(), updatedAt: new Date() }));
        });
    }
    update(objectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
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
            if (!fields.length)
                return null;
            values.push(objectId);
            yield connection_1.pool.query(`UPDATE objects
       SET ${fields.join(", ")}, updated_at = NOW()
       WHERE object_id = ?`, values);
            return this.findById(objectId);
        });
    }
    delete(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.pool.query(`DELETE FROM objects WHERE object_id = ?`, [objectId]);
            return result.affectedRows > 0;
        });
    }
}
exports.ObjectRaMysqlRepository = ObjectRaMysqlRepository;
