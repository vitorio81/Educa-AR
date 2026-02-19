import express from "express";
import cors from "cors";
import { config } from "./config/env";
import "./config/database/connection";

import userRouter from "./routes/user.routes";
import roomRouter from "./routes/room.routes";
import visitorRouter from "./routes/visitor.routes";
import objectRouter from "./routes/object.routes";
import authRoutes from "./routes/auth.routes";
import viewerAuthRoutes from "./routes/auth.viewer.routes";

import { errorHandler } from "./errors/errorHandler";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();

const frontUrl = config.urlApiFront;
const allowedOrigins = [
  frontUrl,
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("Bloqueado pelo CORS: Esta origem não tem permissão."),
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // 🔥 ISSO AQUI RESOLVE
  }),
);

app.use(express.json());

// ================= ROUTES =================

app.use("/auth", authRoutes);
app.use("/api", viewerAuthRoutes);


app.use("/api", userRouter);
app.use("/api", authMiddleware, roomRouter);
app.use("/api", authMiddleware, objectRouter);
app.use("/api", authMiddleware, visitorRouter);

app.use(errorHandler);

// ================= START SERVER =================

async function startServer() {
  try {
    console.log("📦 Verificando banco...");

    const PORT = config.port || 3000;

    app.listen(PORT, () => {
      console.log(`🔥 Server rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();
