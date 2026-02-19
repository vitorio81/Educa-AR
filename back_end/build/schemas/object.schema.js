"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUpdateSchema = exports.ObjectStoreSchema = void 0;
const zod_1 = require("zod");
exports.ObjectStoreSchema = zod_1.z.object({
    roomId: zod_1.z.coerce.number().int().positive(),
    objectName: zod_1.z.string().min(1),
    objectDescription: zod_1.z.string().min(1),
});
exports.ObjectUpdateSchema = zod_1.z.object({
    objectName: zod_1.z.string().min(1).optional(),
    objectDescription: zod_1.z.string().min(1).optional(),
});
