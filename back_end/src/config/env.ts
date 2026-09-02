import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

export const config = {
  port: process.env.PORT || 3000,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  jwtSecret: process.env.JWT_SECRET || "chave_super_secreta",

  urlApiFront: process.env.URL_API_FRONT || "http://localhost:3000",

  dbRootUser: process.env.DB_ROOT_USER || "root",

  dbRootPassword: process.env.DB_ROOT_PASSWORD || "",

  dbHost: process.env.DB_HOST || "localhost",

  dbUser: process.env.DB_APP_USER || "educa_app",

  dbPassword: process.env.DB_APP_PASSWORD || "app123",

  database: process.env.DB_NAME || "educa_ar",

  waitForConnections: true,

  connectionLimit: 10,

  bucketName: process.env.BUCKET_NAME!,

  accountId: process.env.ACCOUNT_ID!,

  accessKey: process.env.ACCESS_KEY!,

  secretKey: process.env.SECRET_KEY!,

  r2PublicUrl: process.env.R2_PUBLIC_URL!,
};
