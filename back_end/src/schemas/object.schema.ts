import { z } from "zod";

export const ObjectStoreSchema = z.object({
  roomId: z.coerce.number().int().positive(),
  objectName: z.string().min(1),
  objectDescription: z.string().min(1),
});


export const ObjectUpdateSchema = z.object({
  objectName: z.string().min(1).optional(),
  objectDescription: z.string().min(1).optional(),
});


export type ObjectStoreSchemaType = z.infer<typeof ObjectStoreSchema>;
export type ObjectUpdateSchemaType = z.infer<typeof ObjectUpdateSchema>;
