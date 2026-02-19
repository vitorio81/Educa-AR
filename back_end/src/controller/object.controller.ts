import type { Handler } from "express";
import { ObjectRaRepository } from "../repositories/objectRa/ObjectRaRepository";
import { RoomRepository } from "../repositories/room/RoomRepository";
import { HttpError } from "../errors/HttpErrors";
import { R2UploadService } from "../services/r2UploadService";
import {
  ObjectStoreSchema,
  ObjectUpdateSchema,
} from "../schemas/object.schema";

export class ObjectRaController {
  constructor(
    private objectRaRepo: ObjectRaRepository,
    private roomRepo: RoomRepository,
    private r2UploadService: R2UploadService,
  ) {}

  indexAll: Handler = async (req, res) => {
    const objectsRa = await this.objectRaRepo.findAll();
    res.json(objectsRa);
  };

  indexByUser: Handler = async (req, res) => {
    const { userId } = req.params;

    const rooms = await this.roomRepo.findByUserId(Number(userId));

    if (!rooms.length) {
      return res.json([]);
    }

    const roomIds = rooms.map((room) => room.data.roomId);

    const objects = await this.objectRaRepo.findByRoomIds(roomIds);

    res.json(objects);
  };

  showByRoom: Handler = async (req, res) => {
    const { roomId, objectId } = req.params;
    console.log("ShowByRoom called with:", { roomId, objectId });

    const roomExists = await this.roomRepo.findById(Number(roomId));
    console.log("Room:", roomExists);

    if (!roomExists) {
      throw new HttpError(404, "Room not found");
    }

    const objectRa = await this.objectRaRepo.findByRoomObjectId(
      Number(roomId),
      Number(objectId),
    );

    console.log("Object:", objectRa);
    
    if (!objectRa) {
      throw new HttpError(404, "Object RA not found in this room");
    }
    res.json(objectRa);
  };

  index: Handler = async (req, res) => {
    const { roomId } = req.params;

    const roomExists = await this.roomRepo.findById(Number(roomId));

    if (!roomExists) {
      throw new HttpError(404, "Room not found");
    }

    const objectsRa = await this.objectRaRepo.findByRoomId(Number(roomId));

    res.json(objectsRa);
  };

  store: Handler = async (req, res) => {
    const parsed = ObjectStoreSchema.safeParse({
      ...req.body,
      roomId: Number(req.body.roomId),
    });

    if (!parsed.success) {
      throw new HttpError(400, "Invalid object RA data");
    }

    if (!req.file) {
      throw new HttpError(400, "File is required");
    }

    const { roomId, objectName, objectDescription } = parsed.data;

    const roomExists = await this.roomRepo.findById(roomId);

    if (!roomExists) {
      throw new HttpError(404, "Room not found");
    }

    // Upload arquivo para R2
    const upload = await this.r2UploadService.uploadFile(req.file);

    const newObjectRa = await this.objectRaRepo.create({
      roomId,
      objectName,
      objectDescription,
      objectUrl: upload,
    });

    res.status(201).json(newObjectRa);
  };

  show: Handler = async (req, res) => {
    const { objectId } = req.params;

    const objectRa = await this.objectRaRepo.findById(Number(objectId));

    if (!objectRa) {
      throw new HttpError(404, "Object RA not found");
    }

    res.json(objectRa);
  };

  update: Handler = async (req, res) => {
    const { objectId } = req.params;

    const parsed = ObjectUpdateSchema.partial().safeParse(req.body);

    if (!parsed.success) {
      throw new HttpError(400, "Invalid object RA data");
    }

    const objectRa = await this.objectRaRepo.findById(Number(objectId));

    if (!objectRa) {
      throw new HttpError(404, "Object RA not found");
    }

    let objectUrl = objectRa.data.objectUrl;

    // ✅ Se enviou novo arquivo
    if (req.file) {
      // Upload novo arquivo
      const upload = await this.r2UploadService.uploadFile(req.file);

      // Deleta arquivo antigo
      if (objectUrl) {
        const oldKey = this.extractKeyFromUrl(objectUrl);
        await this.r2UploadService.deleteFile(oldKey);
      }

      objectUrl = upload;
    }

    const updatedObjectRa = await this.objectRaRepo.update(Number(objectId), {
      ...parsed.data,
      objectUrl,
    });

    res.json(updatedObjectRa);
  };

  delete: Handler = async (req, res) => {
    const { objectId } = req.params;

    const objectRa = await this.objectRaRepo.findById(Number(objectId));

    if (!objectRa) {
      throw new HttpError(404, "Object RA not found");
    }

    // ✅ Remove arquivo do R2
    if (objectRa.data.objectUrl) {
      const key = this.extractKeyFromUrl(objectRa.data.objectUrl);
      await this.r2UploadService.deleteFile(key);
    }

    // ✅ Remove do banco
    const deletedObjectRa = await this.objectRaRepo.delete(Number(objectId));

    res.json(deletedObjectRa);
  };

  private extractKeyFromUrl(url: string): string {
    return url.split("/").pop()!;
  }
}
