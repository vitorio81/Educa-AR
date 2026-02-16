import { Router } from "express";
import { UserController } from "../controller/user.controller";
import { UserMysqlRepository } from "../repositories/user/UserModelRepository";
import { authMiddleware } from "../middlewares/auth.middleware"; // Importe aqui

const userRouter = Router();
const userRepo = new UserMysqlRepository();
const userController = new UserController(userRepo);

// ROTA PÚBLICA (Cadastro)
userRouter.post("/user", userController.store);

// ROTAS PROTEGIDAS (Precisa de Token)
userRouter.get("/users", authMiddleware, userController.index);
userRouter.get("/user/:userId", authMiddleware, userController.show);
userRouter.put("/user/:userId", authMiddleware, userController.update);
userRouter.delete("/user/:userId", authMiddleware, userController.delete);

export default userRouter;
