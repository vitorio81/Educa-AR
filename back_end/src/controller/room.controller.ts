import type { Handler } from "express";
import { RoomRepository } from "../repositories/room/RoomRepository";
import { UserRepository } from "../repositories/user/UserRepository";
import { HttpError } from "../errors/HttpErrors";
import { RoomStoreSchema, RoomUpdateSchema } from "../schemas/room.schema";

export class RoomController {
  constructor(
    private roomRepo: RoomRepository,
    private userRepo: UserRepository,
  ) {}

  indexAll: Handler = async (req, res) => {
    const rooms = await this.roomRepo.findAll();
    res.json(rooms);
  };

  index: Handler = async (req, res) => {
    const { userId } = req.params;

    const userExists = await this.userRepo.findById(Number(userId));
    if (!userExists) {
      throw new HttpError(404, "User not found");
    }

    const rooms = await this.roomRepo.findByUserId(Number(userId));
    res.json(rooms);
  };

  store: Handler = async (req, res) => {
    const parsed = RoomStoreSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new HttpError(400, "Invalid room data");
    }

    const { userId, roomName, roomDescription } = parsed.data;

    const userExists = await this.userRepo.findById(userId);
    if (!userExists) {
      throw new HttpError(404, "User not found");
    }

    const roomExists = await this.roomRepo.findByName(roomName);
    if (roomExists) {
      throw new HttpError(409, "Room already exists");
    }

    const newRoom = await this.roomRepo.create({
      userId,
      roomName,
      roomDescription,
    });

    res.status(201).json(newRoom);
  };

  show: Handler = async (req, res) => {
    const { roomId } = req.params;

    const room = await this.roomRepo.findById(Number(roomId));

    if (!room) {
      throw new HttpError(404, "Room not found");
    }

    res.json(room);
  };

  update: Handler = async (req, res) => {
    const { roomId } = req.params;

    const parsed = RoomUpdateSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      throw new HttpError(400, "Invalid room data");
    }

    const room = await this.roomRepo.findById(Number(roomId));

    if (!room) {
      throw new HttpError(404, "Room not found");
    }

    const updatedRoom = await this.roomRepo.update(Number(roomId), parsed.data);

    res.json(updatedRoom);
  };

  delete: Handler = async (req, res) => {
    const { roomId } = req.params;

    const room = await this.roomRepo.findById(Number(roomId));

    if (!room) {
      throw new HttpError(404, "Room not found");
    }

    const deletedRoom = await this.roomRepo.delete(Number(roomId));

    res.json(deletedRoom);
  };
}
