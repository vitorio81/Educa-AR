import { z } from "zod";

export const VisitorSchema = z.object({
  roomIds: z.array(z.number()).min(1),
  visitorEmail: z.string().email(),
  visitorPassword: z.string().min(6),
});

export const VisitorUpdateSchema = z.object({
  roomIds: z.array(z.number()).min(1),
  visitorEmail: z.string().email().optional(),
  visitorPassword: z.string().min(6).optional(),
  visitorStatus: z.enum(["ativo", "inativo"]).optional(), 
});

export type VisitorSchemaType = z.infer<typeof VisitorSchema>;
export type VisitorUpdateSchemaType = z.infer<typeof VisitorUpdateSchema>;
