import { Router } from "express";
import { RoomController } from "../controller/room.controller";
import { RoomMySQLRepository } from "../repositories/room/RoomModelRepository";
import { UserMysqlRepository } from "../repositories/user/UserModelRepository";

const roomRouter = Router();
const roomRepo = new RoomMySQLRepository();
const userRepo = new UserMysqlRepository();
const roomController = new RoomController(roomRepo, userRepo);

roomRouter.get("/rooms/:userId", roomController.index);
roomRouter.post("/room", roomController.store);
roomRouter.get("/room/:roomId", roomController.show);
roomRouter.put("/room/:roomId", roomController.update);
roomRouter.delete("/room/:roomId", roomController.delete);

export default roomRouter;
