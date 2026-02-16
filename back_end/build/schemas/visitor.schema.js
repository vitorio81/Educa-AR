"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorUpdateSchema = exports.VisitorSchema = void 0;
const zod_1 = require("zod");
exports.VisitorSchema = zod_1.z.object({
    roomIds: zod_1.z.array(zod_1.z.number()).min(1),
    visitorEmail: zod_1.z.string().email(),
    visitorPassword: zod_1.z.string().min(6),
});
exports.VisitorUpdateSchema = zod_1.z.object({
    roomIds: zod_1.z.array(zod_1.z.number()).min(1),
    visitorEmail: zod_1.z.string().email().optional(),
    visitorPassword: zod_1.z.string().min(6).optional(),
    visitorStatus: zod_1.z.enum(["ativo", "inativo"]).optional(),
});
