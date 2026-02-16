"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomUpdateSchema = exports.RoomStoreSchema = void 0;
const zod_1 = require("zod");
exports.RoomStoreSchema = zod_1.z.object({
    userId: zod_1.z.number().int().positive(),
    roomName: zod_1.z.string().min(1),
    roomDescription: zod_1.z.string().min(1),
});
exports.RoomUpdateSchema = zod_1.z.object({
    roomName: zod_1.z.string().min(1).optional(),
    roomDescription: zod_1.z.string().min(1).optional(),
    roomStatus: zod_1.z.enum(["ativa", "inativa"]).optional(),
});
