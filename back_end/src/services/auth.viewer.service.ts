import bcrypt from "bcrypt";
import { VisitorRepository } from "../repositories/visitor/VisitorRepository";
import { generateToken } from "../utils/jwtVisitor";

export class ViewerAuthService {
  constructor(private repository: VisitorRepository) {}

  async login(
    email: string,
    password: string,
    roomId: number,
  ) {
    console.log("ViewerAuthService.login called with:", { email, roomId });
    const visitor = await this.repository.findByEmailAndRoom(roomId, email);

    console.log("Visitor found:", visitor);

    if (!visitor) {
      throw new Error("Credenciais inválidas");
    }

    const data = visitor.data;

    if (data.visitorStatus !== "ativo") {
      throw new Error("Usuário inativo");
    }

    const passwordMatch = await bcrypt.compare(password, data.visitorPassword);

    if (!passwordMatch) {
      throw new Error("Credenciais inválidas");
    }

    const token = generateToken({
      
      visitorId: data.visitorId,
      visitorEmail: data.visitorEmail,
    });

    return {
      token,
      visitorId: data.visitorId,
      visitorEmail: data.visitorEmail,
    };
  }
}
