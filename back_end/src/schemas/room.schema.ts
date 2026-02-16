import { z } from "zod";

export const RoomStoreSchema = z.object({
  userId: z.number().int().positive(),
  roomName: z.string().min(1),
  roomDescription: z.string().min(1),
});

export const RoomUpdateSchema = z.object({
  roomName: z.string().min(1).optional(),
  roomDescription: z.string().min(1).optional(),
  roomStatus: z.enum(["ativa", "inativa"]).optional(),
});

export type RoomStoreSchemaType = z.infer<typeof RoomStoreSchema>;
export type RoomUpdateSchemaType = z.infer<typeof RoomUpdateSchema>;
