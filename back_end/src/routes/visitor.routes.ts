import { Router } from "express";
import { VisitorController } from "../controller/visitor.controller";
import { VisitorMysqlRepository } from "../repositories/visitor/VisitorModelRespository";
import { RoomMySQLRepository } from "../repositories/room/RoomModelRepository";

const visitorRouter = Router();

const visitorRepo = new VisitorMysqlRepository();
const roomRepo = new RoomMySQLRepository();

const visitorController = new VisitorController(visitorRepo, roomRepo);
visitorRouter.get("/visitors", visitorController.indexAll);
visitorRouter.get("/visitors/user/:userId", visitorController.indexByUser);
visitorRouter.get("/visitors/room/:roomId", visitorController.indexByRoom);
visitorRouter.post("/visitor", visitorController.store);
visitorRouter.get("/visitor/:visitorId", visitorController.show);
visitorRouter.put("/visitor/:visitorId", visitorController.update);
visitorRouter.delete("/visitor/:visitorId", visitorController.delete);

export default visitorRouter;
