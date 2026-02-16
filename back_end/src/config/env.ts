
// config/env.ts
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  // Dados internos do back-end
  port: process.env.PORT || 3000,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  jwtSecret: process.env.JWT_SECRET || "chave_super_secreta",

  // URL do front-end para CORS
  urlApiFront: process.env.URL_API_FRONT || "http://localhost:3000",

  // Configurações do banco de dados
  dbRootUser: process.env.DB_ROOT_USER || "root",
  dbRootPassword: process.env.DB_ROOT_PASSWORD || "",

  // Configurações do banco de dados para o usuário da aplicação
  dbHost: process.env.DB_HOST || "localhost",
  dbUser: process.env.DB_APP_USER || "educa_app",
  dbPassword: process.env.DB_APP_PASSWORD || "app123",
  database: process.env.DB_NAME || "educa_ar",

  waitForConnections: true,
  connectionLimit: 10,

  // Configurações do Cloudflare R2
  bucketName: process.env.BUCKET_NAME!,
  accountId: process.env.ACCOUNT_ID!,
  accessKey: process.env.ACCESS_KEY!,
  secretKey: process.env.SECRET_KEY!,
};
