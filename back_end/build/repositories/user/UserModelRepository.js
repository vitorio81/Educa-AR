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
exports.UserMysqlRepository = void 0;
const connection_1 = require("../../config/database/connection");
const User_1 = require("../../model/User");
const password_1 = require("../../utils/password");
class UserMysqlRepository {
    map(row) {
        return new User_1.User({
            userId: row.user_id,
            userName: row.user_name,
            userEmail: row.user_email,
            userSecret: row.user_secret,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM users");
            return rows.map((row) => this.map(row));
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM users WHERE user_id = ?", [userId]);
            if (!rows.length)
                return null;
            return this.map(rows[0]);
        });
    }
    findByName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM users WHERE user_name = ?", [userName]);
            if (!rows.length)
                return null;
            return this.map(rows[0]);
        });
    }
    findByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield connection_1.pool.query("SELECT * FROM users WHERE user_email = ?", [userEmail]);
            if (!rows.length)
                return null;
            return this.map(rows[0]);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield (0, password_1.hashPassword)(data.userSecret);
            const [result] = yield connection_1.pool.query(`INSERT INTO users
       (user_name, user_email, user_secret, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`, [data.userName, data.userEmail, hashedPassword]);
            return new User_1.User({
                userId: result.insertId,
                userName: data.userName,
                userEmail: data.userEmail,
                userSecret: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const hashed = yield (0, password_1.hashPassword)(data.userSecret);
                fields.push("user_secret = ?");
                values.push(hashed);
            }
            if (!fields.length)
                return null;
            values.push(userId);
            yield connection_1.pool.query(`UPDATE users SET ${fields.join(", ")}, updated_at = NOW()
       WHERE user_id = ?`, values);
            return this.findById(userId);
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield connection_1.pool.query("DELETE FROM users WHERE user_id = ?", [userId]);
            return result.affectedRows > 0;
        });
    }
}
exports.UserMysqlRepository = UserMysqlRepository;
