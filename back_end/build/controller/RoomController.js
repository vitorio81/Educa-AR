"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
const zod_1 = require("zod");
const StoreSchema = zod_1.z.object({
    codeUser: zod_1.z.number().int().positive(),
    nameRoom: zod_1.z.string().min(1),
    descriptionRoom: zod_1.z.string().min(1),
    statusRoom: zod_1.z.enum(["active", "inactive"]).optional(),
});
class RoomController {
    constructor(roomRepo, userRepo) {
        this.roomRepo = roomRepo;
        this.userRepo = userRepo;
        this.index = (req, res) => {
            const rooms = this.roomRepo.findAll();
            res.json(rooms);
        };
        this.store = (req, res) => {
            const parseBody = StoreSchema.parse(req.body);
            const userExists = this.userRepo.findByid(parseBody.codeUser);
            const roomExists = this.roomRepo.findByName(parseBody.nameRoom);
            if (!userExists)
                throw new HttpErrors_1.HttpError(404, "User not found");
            if (roomExists)
                throw new HttpErrors_1.HttpError(409, "Room already exists");
            const newRoom = this.roomRepo.create(parseBody);
            res.status(201).json(newRoom);
        };
        this.show = (req, res) => {
            const { codeRoom } = req.params;
            const room = this.roomRepo.findById(+codeRoom);
            if (!room)
                throw new HttpErrors_1.HttpError(404, "room not found");
            return res.status(200).json(room);
        };
        this.update = (req, res) => {
            const { codeRoom } = req.params;
            const parseBody = StoreSchema.partial().parse(req.body);
            const room = this.roomRepo.findById(+codeRoom);
            if (!room)
                throw new HttpErrors_1.HttpError(404, "room not found");
            const updatedroom = this.roomRepo.update(+codeRoom, parseBody);
            return res.status(200).json(updatedroom);
        };
        this.delete = (req, res) => {
            const { codeRoom } = req.params;
            const room = this.roomRepo.findById(+codeRoom);
            if (!room)
                throw new HttpErrors_1.HttpError(404, "room not found");
            const roomDeleted = this.roomRepo.delete(+codeRoom);
            return res.status(200).json(roomDeleted);
        };
    }
}
exports.RoomController = RoomController;
