import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { HttpError } from "../errors/HttpErrors";

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const { userEmail, userSecret } = req.body;

      if (!userEmail || !userSecret) {
        throw new HttpError(400, "Email e senha são obrigatórios");
      }

      const result = await this.authService.login({
        email: userEmail,
        password: userSecret,
      });

      return res.status(200).json({
        message: "Login realizado com sucesso",
        ...result,
      });
    } catch (error: any) {
      if (error instanceof HttpError) {
        return res.status(error.status).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Erro interno no servidor",
      });
    }
  };
}
