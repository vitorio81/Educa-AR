"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewerLoginSchema = void 0;
const zod_1 = require("zod");
exports.ViewerLoginSchema = zod_1.z.object({
    email: zod_1.z.string().min(3, "Login obrigatório"),
    password: zod_1.z.string().min(3, "Senha obrigatória"),
    userId: zod_1.z.number().int().positive(),
    roomId: zod_1.z.number().int().positive(),
});
