"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateSchema = exports.UserStoreSchema = void 0;
const zod_1 = require("zod");
exports.UserStoreSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1),
    userEmail: zod_1.z.string().min(1).email(),
    userSecret: zod_1.z.string().min(1),
});
exports.UserUpdateSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1).optional(),
    userEmail: zod_1.z.string().min(1).email().optional(),
    userSecret: zod_1.z.string().min(1).optional(),
});
