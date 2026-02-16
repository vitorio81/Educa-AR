"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// config/env.ts
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
exports.config = {
    // Dados internos do back-end
    port: process.env.PORT || 3000,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    jwtSecret: process.env.JWT_SECRET || "chave_super_secreta",
    // URL do front-end para CORS
    urlApiFront: process.env.URL_API_FRONT || "http://localhost:3000",
    // Configurações do banco de dados
    dbRootUser: process.env.DB_ROOT_USER || "root",
    dbRootPassword: process.env.DB_ROOT_PASSWORD || "",
    // Configurações do banco de dados para o usuário da aplicação
    dbHost: process.env.DB_HOST || "localhost",
    dbUser: process.env.DB_APP_USER || "educa_app",
    dbPassword: process.env.DB_APP_PASSWORD || "app123",
    database: process.env.DB_NAME || "educa_ar",
    waitForConnections: true,
    connectionLimit: 10,
    // Configurações do Cloudflare R2
    bucketName: process.env.BUCKET_NAME,
    accountId: process.env.ACCOUNT_ID,
    accessKey: process.env.ACCESS_KEY,
    secretKey: process.env.SECRET_KEY,
};
