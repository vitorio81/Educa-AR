import { Handler } from "express";
import { VisitorRepository } from "../repositories/visitor/VisitorRepository";
import { RoomRepository } from "../repositories/room/RoomRepository";
import { HttpError } from "../errors/HttpErrors";
import { VisitorSchema, VisitorUpdateSchema } from "../schemas/visitor.schema";

export class VisitorController {
  constructor(
    private visitorRepo: VisitorRepository,
    private roomRepo: RoomRepository,
  ) {}

  // 🔹 Buscar todos os visitantes
  indexAll: Handler = async (req, res) => {
    const visitors = await this.visitorRepo.findAll();

    const safeVisitors = visitors.map((v) => {
      const { visitorPassword, ...safe } = v.data;
      return safe;
    });

    res.json(safeVisitors);
  };

  // 🔹 Buscar visitantes por sala
  indexByRoom: Handler = async (req, res) => {
    const { roomId } = req.params;

    const roomExists = await this.roomRepo.findById(+roomId);
    if (!roomExists) {
      throw new HttpError(404, "Room not found");
    }

    const visitors = await this.visitorRepo.findByRoomId(+roomId);

    const safeVisitors = visitors.map((v) => {
      const { visitorPassword, ...safe } = v.data;
      return safe;
    });

    res.json(safeVisitors);
  };

  // 🔹 Buscar visitantes por usuário
  indexByUser: Handler = async (req, res) => {
    const { userId } = req.params;

    const rooms = await this.roomRepo.findByUserId(+userId);

    if (!rooms.length) {
      return res.json([]);
    }

    const roomIds = rooms.map((room) => room.data.roomId);

    const visitors = await this.visitorRepo.findByRoomIds(roomIds);

    const safeVisitors = visitors.map((v) => {
      const { visitorPassword, ...safe } = v.data;
      return safe;
    });

    res.json(safeVisitors);
  };

  // 🔹 Buscar visitante por ID
  show: Handler = async (req, res) => {
    const { visitorId } = req.params;

    const visitor = await this.visitorRepo.findById(+visitorId);
    if (!visitor) {
      throw new HttpError(404, "Visitor not found");
    }

    const { visitorPassword, ...safeVisitor } = visitor.data;

    res.json(safeVisitor);
  };

  // 🔹 Criar visitante
  store: Handler = async (req, res) => {
    const parsed = VisitorSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid visitor data");
    }

    const { roomIds, visitorEmail, visitorPassword } = parsed.data;

    // valida salas
    for (const roomId of roomIds) {
      const roomExists = await this.roomRepo.findById(roomId);
      if (!roomExists) {
        throw new HttpError(404, `Room ${roomId} not found`);
      }
    }

    // valida duplicidade
    const visitorExists = await this.visitorRepo.findByEmailAndRooms(
      roomIds,
      visitorEmail,
    );

    if (visitorExists) {
      throw new HttpError(409, "Visitor already exists in one of these rooms");
    }

    const newVisitor = await this.visitorRepo.create({
      roomIds,
      visitorEmail,
      visitorPassword,
    });

    const { visitorPassword: _, ...safeVisitor } = newVisitor.data;

    res.status(201).json(safeVisitor);
  };

  // 🔹 Atualizar visitante
  update: Handler = async (req, res) => {
    const parsed = VisitorUpdateSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      throw new HttpError(400, "Invalid visitor data");
    }

    const { visitorId } = req.params;

    const visitorExists = await this.visitorRepo.findById(+visitorId);
    if (!visitorExists) {
      throw new HttpError(404, "Visitor not found");
    }

    // valida salas se enviadas
    if (parsed.data.roomIds) {
      for (const roomId of parsed.data.roomIds) {
        const roomExists = await this.roomRepo.findById(roomId);
        if (!roomExists) {
          throw new HttpError(404, `Room ${roomId} not found`);
        }
      }
    }

    const updatedVisitor = await this.visitorRepo.update(
      +visitorId,
      parsed.data,
    );

    if (!updatedVisitor) {
      throw new HttpError(400, "Visitor not updated");
    }

    const { visitorPassword, ...safeVisitor } = updatedVisitor.data;

    res.json(safeVisitor);
  };

  // 🔹 Deletar visitante
  delete: Handler = async (req, res) => {
    const { visitorId } = req.params;

    const visitorExists = await this.visitorRepo.findById(+visitorId);
    if (!visitorExists) {
      throw new HttpError(404, "Visitor not found");
    }

    const deleted = await this.visitorRepo.delete(+visitorId);

    if (!deleted) {
      throw new HttpError(400, "Visitor not deleted");
    }

    res.json({ success: true });
  };
}
