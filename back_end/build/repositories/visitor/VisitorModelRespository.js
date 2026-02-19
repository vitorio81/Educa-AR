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
exports.VisitorMysqlRepository = void 0;
const connection_1 = require("../../config/database/connection");
const Visitor_1 = require("../../model/Visitor");
const password_1 = require("../../utils/password");
class VisitorMysqlRepository {
    map(row) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rooms] = yield connection_1.pool.query("SELECT room_id FROM visitor_rooms WHERE visitor_id = ?", [row.visitor_id]);
            return new Visitor_1.Visitor({
                visitorId: row.visitor_id,
                roomIds: rooms.map((r) => r.room_id),
                visitorEmail: row.visitor_email,
                visitorPassword: row.visitor_password,
                visitorStatus: row.visitor_status,
                visitedAt: row.visited_at,
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM visitors");
            return Promise.all(rows.map((row) => this.map(row)));
        });
    }
    findByRoomIds(roomIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM visitors");
            const visitors = yield Promise.all(rows.map((row) => this.map(row)));
            return visitors.filter((v) => v.data.roomIds.some((id) => roomIds.includes(id)));
        });
    }
    findByRoomId(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const visitors = yield this.findAll();
            return visitors.filter((v) => v.data.roomIds.includes(roomId));
        });
    }
    findById(visitorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM visitors WHERE visitor_id = ?", [visitorId]);
            if (!rows.length)
                return null;
            return this.map(rows[0]);
        });
    }
    findByEmail(visitorEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM visitors WHERE visitor_email = ?", [visitorEmail]);
            if (!rows.length)
                return null;
            return this.map(rows[0]);
        });
    }
    findByEmailAndRoom(roomId, visitorEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const visitor = yield this.findByEmail(visitorEmail);
            if (!visitor)
                return null;
            const hasRoom = visitor.data.roomIds.includes(roomId);
            return hasRoom ? visitor : null;
        });
    }
    findByEmailAndRooms(roomIds, visitorEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const visitor = yield this.findByEmail(visitorEmail);
            if (!visitor)
                return null;
            const hasRoom = visitor.data.roomIds.some((id) => roomIds.includes(id));
            return hasRoom ? visitor : null;
        });
    }
    create(attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, password_1.hashPassword)(attributes.visitorPassword);
            // cria visitante
            const [result] = yield connection_1.pool.query(`INSERT INTO visitors
     (visitor_email, visitor_password, visitor_status, visited_at)
     VALUES (?, ?, 'ativo', NOW())`, [attributes.visitorEmail, hashedPassword]);
            const visitorId = result.insertId;
            // cria vínculos com salas
            if (attributes.roomIds.length) {
                const values = attributes.roomIds.map((roomId) => [visitorId, roomId]);
                yield connection_1.pool.query(`INSERT INTO visitor_rooms (visitor_id, room_id) VALUES ?`, [values]);
            }
            return this.findById(visitorId);
        });
    }
    update(visitorId, attributes) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
            if (attributes.roomIds) {
                yield connection_1.pool.query("DELETE FROM visitor_rooms WHERE visitor_id = ?", [
                    visitorId,
                ]);
                const values = attributes.roomIds.map((roomId) => [visitorId, roomId]);
                yield connection_1.pool.query("INSERT INTO visitor_rooms (visitor_id, room_id) VALUES ?", [values]);
            }
            if (attributes.visitorEmail) {
                fields.push("visitor_email = ?");
                values.push(attributes.visitorEmail);
            }
            if (attributes.visitorPassword) {
                const hashed = yield (0, password_1.hashPassword)(attributes.visitorPassword);
                fields.push("visitor_password = ?");
                values.push(hashed);
            }
            if (attributes.visitorStatus) {
                fields.push("visitor_status = ?");
                values.push(attributes.visitorStatus);
            }
            if (!fields.length)
                return null;
            values.push(visitorId);
            yield connection_1.pool.query(`UPDATE visitors
       SET ${fields.join(", ")}, visited_at = NOW()
       WHERE visitor_id = ?`, values);
            return this.findById(visitorId);
        });
    }
    delete(visitorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.pool.query("DELETE FROM visitors WHERE visitor_id = ?", [visitorId]);
            return result.affectedRows > 0;
        });
    }
}
exports.VisitorMysqlRepository = VisitorMysqlRepository;
