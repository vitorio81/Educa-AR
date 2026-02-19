import { z } from "zod";

export const ViewerLoginSchema = z.object({
  email: z.string().min(3, "Login obrigatório"),
  password: z.string().min(3, "Senha obrigatória"),
  userId: z.number().int().positive(),
  roomId: z.number().int().positive(),
});

export type ViewerLoginSchemaType = z.infer<typeof ViewerLoginSchema>;
