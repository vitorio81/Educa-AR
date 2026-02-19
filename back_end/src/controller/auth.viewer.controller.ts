import { Request, Response } from "express";
import { ViewerAuthService } from "../services/auth.viewer.service";
import { ViewerLoginSchema } from "../schemas/viewer.schema";
import { HttpError } from "../errors/HttpErrors";
import { UserMysqlRepository } from "../repositories/user/UserModelRepository";
import { RoomMySQLRepository } from "../repositories/room/RoomModelRepository";

export class ViewerAuthController {
  constructor(
    private service: ViewerAuthService,
    private user: UserMysqlRepository,
    private room: RoomMySQLRepository,
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password, roomId, userId } = ViewerLoginSchema.parse(
        req.body,
      );

      console.log("Login attempt:", { email, roomId, userId });

      const user = await this.user.findById(userId);
      const room = await this.room.findById(roomId);

      if (!user || !room) {
        throw new HttpError(404, "Usuário ou sala não encontrados");
      }

      const result = await this.service.login(email, password, roomId);

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso",
        data: result,
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({
          success: false,
          message: "Erro de validação",
          errors: error.errors,
        });
      }

      return res.status(401).json({
        success: false,
        message: error.message || "Erro ao autenticar",
      });
    }
  }
}
