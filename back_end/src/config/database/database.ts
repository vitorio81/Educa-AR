import mysql from "mysql2/promise";
import { config } from "../env";

export const createRootConnection = async () => {
  return mysql.createConnection({
    host: config.dbHost,
    user: config.dbRootUser,
    password: config.dbRootPassword,
  });
};

export const createAppConnection = async () => {
  return mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
  });
};
