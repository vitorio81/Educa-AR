import { z } from "zod";

export const ObjectStoreSchema = z.object({
  roomId: z.number().int().positive(),
  objectName: z.string().min(1),
  objectDescription: z.string().min(1),
  objectUrl: z.string().url(),
});

export const ObjectUpdateSchema = z.object({
  objectName: z.string().min(1).optional(),
  objectDescription: z.string().min(1).optional(),
  objectUrl: z.string().url().optional(),
});

export type ObjectStoreSchemaType = z.infer<typeof ObjectStoreSchema>;
export type ObjectUpdateSchemaType = z.infer<typeof ObjectUpdateSchema>;
