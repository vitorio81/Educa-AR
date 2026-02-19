import { Router } from "express";
import { ObjectRaController } from "../controller/object.controller";
import { ObjectRaMysqlRepository } from "../repositories/objectRa/ObjectRaModelRepository";
import { RoomMySQLRepository } from "../repositories/room/RoomModelRepository";
import { R2UploadService } from "../services/r2UploadService";
import { upload } from "../middlewares/upload.middleware";

const objectRouter = Router();

const objectRaRepo = new ObjectRaMysqlRepository();
const roomRepo = new RoomMySQLRepository();
const r2UploadService = new R2UploadService();

const objectRaController = new ObjectRaController(
  objectRaRepo,
  roomRepo,
  r2UploadService,
);

objectRouter.get("/objectsRa", objectRaController.indexAll);
objectRouter.get("/objectsRa/user/:userId", objectRaController.indexByUser);
objectRouter.get("/objectsRa/room/:roomId", objectRaController.index);
objectRouter.post(
  "/objectsRa",
  upload.single("file"),
  objectRaController.store,
);

objectRouter.get("/objectsRa/:objectId", objectRaController.show);
objectRouter.get("/rooms/:roomId/objects/:objectId", objectRaController.showByRoom);

objectRouter.put(
  "/objectsRa/:objectId",
  upload.single("file"),
  objectRaController.update
);
objectRouter.put(
  "/objectsRa/:objectId",
  upload.single("file"),
  objectRaController.update,
);

objectRouter.delete("/objectsRa/:objectId", objectRaController.delete);

export default objectRouter;
