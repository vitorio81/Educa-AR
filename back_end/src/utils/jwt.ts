import jwt, {
  SignOptions,
  JwtPayload as DefaultJwtPayload,
} from "jsonwebtoken";
import { config } from "../config/env";

/*
|--------------------------------------------------------------------------
| Validação obrigatória das configurações
|--------------------------------------------------------------------------
*/
if (!config.jwtSecret) {
  throw new Error("JWT_SECRET não configurado");
}

if (!config.jwtExpiresIn) {
  throw new Error("JWT_EXPIRES_IN não configurado");
}

const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRES_IN = config.jwtExpiresIn as SignOptions["expiresIn"];

/*
|--------------------------------------------------------------------------
| Payload da aplicação
|--------------------------------------------------------------------------
*/
export interface JwtPayload {
  userId: number;
  userEmail: string;
}

/*
|--------------------------------------------------------------------------
| Gera Token JWT
|--------------------------------------------------------------------------
*/
export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/*
|--------------------------------------------------------------------------
| Verifica Token (assinatura + expiração)
|--------------------------------------------------------------------------
*/
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Garantia de tipagem segura
    if (
      typeof decoded === "object" &&
      "userId" in decoded &&
      "userEmail" in decoded
    ) {
      return decoded as JwtPayload;
    }

    throw new Error("Payload inválido");
  } catch {
    throw new Error("Token inválido ou expirado");
  }
}

/*
|--------------------------------------------------------------------------
| Apenas decodifica token (sem validar assinatura)
|--------------------------------------------------------------------------
*/
export function decodeToken(token: string): DefaultJwtPayload | null {
  try {
    return jwt.decode(token) as DefaultJwtPayload;
  } catch {
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Verifica manualmente se expirou
|--------------------------------------------------------------------------
*/
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !decoded.exp) return true;

  return decoded.exp * 1000 < Date.now();
}
