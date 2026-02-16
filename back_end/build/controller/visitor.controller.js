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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
const visitor_schema_1 = require("../schemas/visitor.schema");
class VisitorController {
    constructor(visitorRepo, roomRepo) {
        this.visitorRepo = visitorRepo;
        this.roomRepo = roomRepo;
        // 🔹 Buscar todos os visitantes
        this.indexAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const visitors = yield this.visitorRepo.findAll();
            const safeVisitors = visitors.map((v) => {
                const _a = v.data, { visitorPassword } = _a, safe = __rest(_a, ["visitorPassword"]);
                return safe;
            });
            res.json(safeVisitors);
        });
        // 🔹 Buscar visitantes por sala
        this.indexByRoom = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { roomId } = req.params;
            const roomExists = yield this.roomRepo.findById(+roomId);
            if (!roomExists) {
                throw new HttpErrors_1.HttpError(404, "Room not found");
            }
            const visitors = yield this.visitorRepo.findByRoomId(+roomId);
            const safeVisitors = visitors.map((v) => {
                const _a = v.data, { visitorPassword } = _a, safe = __rest(_a, ["visitorPassword"]);
                return safe;
            });
            res.json(safeVisitors);
        });
        // 🔹 Buscar visitantes por usuário
        this.indexByUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const rooms = yield this.roomRepo.findByUserId(+userId);
            if (!rooms.length) {
                return res.json([]);
            }
            const roomIds = rooms.map((room) => room.data.roomId);
            const visitors = yield this.visitorRepo.findByRoomIds(roomIds);
            const safeVisitors = visitors.map((v) => {
                const _a = v.data, { visitorPassword } = _a, safe = __rest(_a, ["visitorPassword"]);
                return safe;
            });
            res.json(safeVisitors);
        });
        // 🔹 Buscar visitante por ID
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { visitorId } = req.params;
            const visitor = yield this.visitorRepo.findById(+visitorId);
            if (!visitor) {
                throw new HttpErrors_1.HttpError(404, "Visitor not found");
            }
            const _a = visitor.data, { visitorPassword } = _a, safeVisitor = __rest(_a, ["visitorPassword"]);
            res.json(safeVisitor);
        });
        // 🔹 Criar visitante
        this.store = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = visitor_schema_1.VisitorSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid visitor data");
            }
            const { roomIds, visitorEmail, visitorPassword } = parsed.data;
            // valida salas
            for (const roomId of roomIds) {
                const roomExists = yield this.roomRepo.findById(roomId);
                if (!roomExists) {
                    throw new HttpErrors_1.HttpError(404, `Room ${roomId} not found`);
                }
            }
            // valida duplicidade
            const visitorExists = yield this.visitorRepo.findByEmailAndRooms(roomIds, visitorEmail);
            if (visitorExists) {
                throw new HttpErrors_1.HttpError(409, "Visitor already exists in one of these rooms");
            }
            const newVisitor = yield this.visitorRepo.create({
                roomIds,
                visitorEmail,
                visitorPassword,
            });
            const _a = newVisitor.data, { visitorPassword: _ } = _a, safeVisitor = __rest(_a, ["visitorPassword"]);
            res.status(201).json(safeVisitor);
        });
        // 🔹 Atualizar visitante
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = visitor_schema_1.VisitorUpdateSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid visitor data");
            }
            const { visitorId } = req.params;
            const visitorExists = yield this.visitorRepo.findById(+visitorId);
            if (!visitorExists) {
                throw new HttpErrors_1.HttpError(404, "Visitor not found");
            }
            // valida salas se enviadas
            if (parsed.data.roomIds) {
                for (const roomId of parsed.data.roomIds) {
                    const roomExists = yield this.roomRepo.findById(roomId);
                    if (!roomExists) {
                        throw new HttpErrors_1.HttpError(404, `Room ${roomId} not found`);
                    }
                }
            }
            const updatedVisitor = yield this.visitorRepo.update(+visitorId, parsed.data);
            if (!updatedVisitor) {
                throw new HttpErrors_1.HttpError(400, "Visitor not updated");
            }
            const _a = updatedVisitor.data, { visitorPassword } = _a, safeVisitor = __rest(_a, ["visitorPassword"]);
            res.json(safeVisitor);
        });
        // 🔹 Deletar visitante
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { visitorId } = req.params;
            const visitorExists = yield this.visitorRepo.findById(+visitorId);
            if (!visitorExists) {
                throw new HttpErrors_1.HttpError(404, "Visitor not found");
            }
            const deleted = yield this.visitorRepo.delete(+visitorId);
            if (!deleted) {
                throw new HttpErrors_1.HttpError(400, "Visitor not deleted");
            }
            res.json({ success: true });
        });
    }
}
exports.VisitorController = VisitorController;
