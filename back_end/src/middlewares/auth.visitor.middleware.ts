import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtVisitor";
import { Console } from "console";

export interface AuthRequest extends Request {
  user?: {
    visitorId: number;
    visitorEmail: string;
  };
}

export function authVisitorMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({
      message: "Token não fornecido",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido ou expirado",
    });
  }
}
