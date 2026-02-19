import { Router } from "express";
import { ViewerAuthController } from "../controller/auth.viewer.controller";
import { ViewerAuthService } from "../services/auth.viewer.service";
import { VisitorMysqlRepository } from "../repositories/visitor/VisitorModelRespository";
import { UserMysqlRepository } from "../repositories/user/UserModelRepository";
import { RoomMySQLRepository } from "../repositories/room/RoomModelRepository";
import { ObjectRaController } from "../controller/object.controller";
import { ObjectRaMysqlRepository } from "../repositories/objectRa/ObjectRaModelRepository";
import { R2UploadService } from "../services/r2UploadService";
import { authVisitorMiddleware } from "../middlewares/auth.visitor.middleware";

const router = Router();

const repository = new VisitorMysqlRepository();
const service = new ViewerAuthService(repository);
const r2UploadService = new R2UploadService();
const userRepo = new UserMysqlRepository();
const roomRepo = new RoomMySQLRepository();
const objectRaRepo = new ObjectRaMysqlRepository();
const objectRaController = new ObjectRaController(objectRaRepo, roomRepo, r2UploadService);
const controller = new ViewerAuthController(service, userRepo, roomRepo);

router.post("/viewer/auth/login", (req, res) => controller.login(req, res));
router.get(
  "/viewer/rooms/:roomId/objects/:objectId", authVisitorMiddleware,
  objectRaController.showByRoom,
);

export default router;
