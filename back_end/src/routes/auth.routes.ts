import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserMysqlRepository } from "../repositories/user/UserModelRepository";

const router = Router();

const userRepo = new UserMysqlRepository();
const authService = new AuthService(userRepo);
const authController = new AuthController(authService);

router.post("/login", authController.login);

export default router;
