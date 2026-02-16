"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.decodeToken = decodeToken;
exports.isTokenExpired = isTokenExpired;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
/*
|--------------------------------------------------------------------------
| Validação obrigatória das configurações
|--------------------------------------------------------------------------
*/
if (!env_1.config.jwtSecret) {
    throw new Error("JWT_SECRET não configurado");
}
if (!env_1.config.jwtExpiresIn) {
    throw new Error("JWT_EXPIRES_IN não configurado");
}
const JWT_SECRET = env_1.config.jwtSecret;
const JWT_EXPIRES_IN = env_1.config.jwtExpiresIn;
/*
|--------------------------------------------------------------------------
| Gera Token JWT
|--------------------------------------------------------------------------
*/
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
/*
|--------------------------------------------------------------------------
| Verifica Token (assinatura + expiração)
|--------------------------------------------------------------------------
*/
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Garantia de tipagem segura
        if (typeof decoded === "object" &&
            "userId" in decoded &&
            "userEmail" in decoded) {
            return decoded;
        }
        throw new Error("Payload inválido");
    }
    catch (_a) {
        throw new Error("Token inválido ou expirado");
    }
}
/*
|--------------------------------------------------------------------------
| Apenas decodifica token (sem validar assinatura)
|--------------------------------------------------------------------------
*/
function decodeToken(token) {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch (_a) {
        return null;
    }
}
/*
|--------------------------------------------------------------------------
| Verifica manualmente se expirou
|--------------------------------------------------------------------------
*/
function isTokenExpired(token) {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp)
        return true;
    return decoded.exp * 1000 < Date.now();
}
