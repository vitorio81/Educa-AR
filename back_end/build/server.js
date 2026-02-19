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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
require("./config/database/connection");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const room_routes_1 = __importDefault(require("./routes/room.routes"));
const visitor_routes_1 = __importDefault(require("./routes/visitor.routes"));
const object_routes_1 = __importDefault(require("./routes/object.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_viewer_routes_1 = __importDefault(require("./routes/auth.viewer.routes"));
const errorHandler_1 = require("./errors/errorHandler");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const app = (0, express_1.default)();
const frontUrl = env_1.config.urlApiFront;
const allowedOrigins = [
    frontUrl,
    "http://localhost:5173",
    "http://localhost:5174",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Bloqueado pelo CORS: Esta origem não tem permissão."));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 🔥 ISSO AQUI RESOLVE
}));
app.use(express_1.default.json());
// ================= ROUTES =================
app.use("/auth", auth_routes_1.default);
app.use("/api", auth_viewer_routes_1.default);
app.use("/api", user_routes_1.default);
app.use("/api", auth_middleware_1.authMiddleware, room_routes_1.default);
app.use("/api", auth_middleware_1.authMiddleware, object_routes_1.default);
app.use("/api", auth_middleware_1.authMiddleware, visitor_routes_1.default);
app.use(errorHandler_1.errorHandler);
// ================= START SERVER =================
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("📦 Verificando banco...");
            const PORT = env_1.config.port || 3000;
            app.listen(PORT, () => {
                console.log(`🔥 Server rodando em http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error("❌ Erro ao iniciar servidor:", error);
            process.exit(1);
        }
    });
}
startServer();
