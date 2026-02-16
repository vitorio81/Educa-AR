"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
const UserModelRepository_1 = require("../repositories/user/UserModelRepository");
const auth_middleware_1 = require("../middlewares/auth.middleware"); // Importe aqui
const userRouter = (0, express_1.Router)();
const userRepo = new UserModelRepository_1.UserMysqlRepository();
const userController = new user_controller_1.UserController(userRepo);
// ROTA PÚBLICA (Cadastro)
userRouter.post("/user", userController.store);
// ROTAS PROTEGIDAS (Precisa de Token)
userRouter.get("/users", auth_middleware_1.authMiddleware, userController.index);
userRouter.get("/user/:userId", auth_middleware_1.authMiddleware, userController.show);
userRouter.put("/user/:userId", auth_middleware_1.authMiddleware, userController.update);
userRouter.delete("/user/:userId", auth_middleware_1.authMiddleware, userController.delete);
exports.default = userRouter;
