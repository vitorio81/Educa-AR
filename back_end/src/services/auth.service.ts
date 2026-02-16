import { UserRepository } from "../repositories/user/UserRepository";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async login({ email, password }: LoginDTO) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new Error("Usuário ou senha inválidos");
    }

    const passwordMatch = await comparePassword(password, user.data.userSecret);

    if (!passwordMatch) {
      throw new Error("Usuário ou senha inválidos");
    }

    const token = generateToken({
      userId: user.data.userId,
      userEmail: user.data.userEmail,
    });

    return {
      token,
      user: {
        userId: user.data.userId,
        userName: user.data.userName,
        userEmail: user.data.userEmail,
      },
    };
  }
}
