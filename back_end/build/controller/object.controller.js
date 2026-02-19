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
exports.ObjectRaController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
const object_schema_1 = require("../schemas/object.schema");
class ObjectRaController {
    constructor(objectRaRepo, roomRepo, r2UploadService) {
        this.objectRaRepo = objectRaRepo;
        this.roomRepo = roomRepo;
        this.r2UploadService = r2UploadService;
        this.indexAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const objectsRa = yield this.objectRaRepo.findAll();
            res.json(objectsRa);
        });
        this.indexByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const rooms = yield this.roomRepo.findByUserId(Number(userId));
            if (!rooms.length) {
                return res.json([]);
            }
            const roomIds = rooms.map((room) => room.data.roomId);
            const objects = yield this.objectRaRepo.findByRoomIds(roomIds);
            res.json(objects);
        });
        this.showByRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId, objectId } = req.params;
            console.log("ShowByRoom called with:", { roomId, objectId });
            const roomExists = yield this.roomRepo.findById(Number(roomId));
            console.log("Room:", roomExists);
            if (!roomExists) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            const objectRa = yield this.objectRaRepo.findByRoomObjectId(Number(roomId), Number(objectId));
            console.log("Object:", objectRa);
            if (!objectRa) {
                throw new HttpErrors_1.HttpError(404, "Object RA not found in this room");
            }
            res.json(objectRa);
        });
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId } = req.params;
            const roomExists = yield this.roomRepo.findById(Number(roomId));
            if (!roomExists) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            const objectsRa = yield this.objectRaRepo.findByRoomId(Number(roomId));
            res.json(objectsRa);
        });
        this.store = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = object_schema_1.ObjectStoreSchema.safeParse(Object.assign(Object.assign({}, req.body), { roomId: Number(req.body.roomId) }));
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid object RA data");
            }
            if (!req.file) {
                throw new HttpErrors_1.HttpError(400, "File is required");
            }
            const { roomId, objectName, objectDescription } = parsed.data;
            const roomExists = yield this.roomRepo.findById(roomId);
            if (!roomExists) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            // Upload arquivo para R2
            const upload = yield this.r2UploadService.uploadFile(req.file);
            const newObjectRa = yield this.objectRaRepo.create({
                roomId,
                objectName,
                objectDescription,
                objectUrl: upload,
            });
            res.status(201).json(newObjectRa);
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { objectId } = req.params;
            const objectRa = yield this.objectRaRepo.findById(Number(objectId));
            if (!objectRa) {
                throw new HttpErrors_1.HttpError(404, "Object RA not found");
            }
            res.json(objectRa);
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { objectId } = req.params;
            const parsed = object_schema_1.ObjectUpdateSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid object RA data");
            }
            const objectRa = yield this.objectRaRepo.findById(Number(objectId));
            if (!objectRa) {
                throw new HttpErrors_1.HttpError(404, "Object RA not found");
            }
            let objectUrl = objectRa.data.objectUrl;
            // ✅ Se enviou novo arquivo
            if (req.file) {
                // Upload novo arquivo
                const upload = yield this.r2UploadService.uploadFile(req.file);
                // Deleta arquivo antigo
                if (objectUrl) {
                    const oldKey = this.extractKeyFromUrl(objectUrl);
                    yield this.r2UploadService.deleteFile(oldKey);
                }
                objectUrl = upload;
            }
            const updatedObjectRa = yield this.objectRaRepo.update(Number(objectId), Object.assign(Object.assign({}, parsed.data), { objectUrl }));
            res.json(updatedObjectRa);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { objectId } = req.params;
            const objectRa = yield this.objectRaRepo.findById(Number(objectId));
            if (!objectRa) {
                throw new HttpErrors_1.HttpError(404, "Object RA not found");
            }
            // ✅ Remove arquivo do R2
            if (objectRa.data.objectUrl) {
                const key = this.extractKeyFromUrl(objectRa.data.objectUrl);
                yield this.r2UploadService.deleteFile(key);
            }
            // ✅ Remove do banco
            const deletedObjectRa = yield this.objectRaRepo.delete(Number(objectId));
            res.json(deletedObjectRa);
        });
    }
    extractKeyFromUrl(url) {
        return url.split("/").pop();
    }
}
exports.ObjectRaController = ObjectRaController;
