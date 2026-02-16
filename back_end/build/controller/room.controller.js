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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
const room_schema_1 = require("../schemas/room.schema");
class RoomController {
    constructor(roomRepo, userRepo) {
        this.roomRepo = roomRepo;
        this.userRepo = userRepo;
        this.indexAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rooms = yield this.roomRepo.findAll();
            res.json(rooms);
        });
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const userExists = yield this.userRepo.findById(Number(userId));
            if (!userExists) {
                throw new HttpErrors_1.HttpError(404, "User not found");
            }
            const rooms = yield this.roomRepo.findByUserId(Number(userId));
            res.json(rooms);
        });
        this.store = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = room_schema_1.RoomStoreSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid room data");
            }
            const { userId, roomName, roomDescription } = parsed.data;
            const userExists = yield this.userRepo.findById(userId);
            if (!userExists) {
                throw new HttpErrors_1.HttpError(404, "User not found");
            }
            const roomExists = yield this.roomRepo.findByName(roomName);
            if (roomExists) {
                throw new HttpErrors_1.HttpError(409, "Room already exists");
            }
            const newRoom = yield this.roomRepo.create({
                userId,
                roomName,
                roomDescription,
            });
            res.status(201).json(newRoom);
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId } = req.params;
            const room = yield this.roomRepo.findById(Number(roomId));
            if (!room) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            res.json(room);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId } = req.params;
            const parsed = room_schema_1.RoomUpdateSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid room data");
            }
            const room = yield this.roomRepo.findById(Number(roomId));
            if (!room) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            const updatedRoom = yield this.roomRepo.update(Number(roomId), parsed.data);
            res.json(updatedRoom);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId } = req.params;
            const room = yield this.roomRepo.findById(Number(roomId));
            if (!room) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            const deletedRoom = yield this.roomRepo.delete(Number(roomId));
            res.json(deletedRoom);
        });
    }
}
exports.RoomController = RoomController;
