import { z } from "zod";

export const UserStoreSchema = z.object({
  userName: z.string().min(1),
  userEmail: z.string().min(1).email(),
  userSecret: z.string().min(1),
});

export const UserUpdateSchema = z.object({
  userName: z.string().min(1).optional(),
  userEmail: z.string().min(1).email().optional(),
  userSecret: z.string().min(1).optional(),
});

export type UserStoreSchemaType = z.infer<typeof UserStoreSchema>;
export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>;
