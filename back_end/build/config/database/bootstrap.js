"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapDatabase = bootstrapDatabase;
const database_1 = require("./database");
function bootstrapDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, database_1.createRootConnection)();
        console.log("🚀 Inicializando banco...");
        /* ===============================
           CRIA BANCO
        =============================== */
        yield connection.query(`CREATE DATABASE IF NOT EXISTS educa_ar;`);
        /* ===============================
           CRIA USUÁRIOS DO BANCO
        =============================== */
        yield connection.query(`
    CREATE USER IF NOT EXISTS 'educa_admin'@'%' IDENTIFIED BY 'admin123';
  `);
        yield connection.query(`
    GRANT ALL PRIVILEGES ON educa_ar.* TO 'educa_admin'@'%';
  `);
        yield connection.query(`
    CREATE USER IF NOT EXISTS 'educa_app'@'%' IDENTIFIED BY 'app123';
  `);
        yield connection.query(`
    GRANT SELECT, INSERT, UPDATE, DELETE ON educa_ar.* TO 'educa_app'@'%';
  `);
        yield connection.query(`FLUSH PRIVILEGES;`);
        /* ===============================
           USA BANCO
        =============================== */
        yield connection.query(`USE educa_ar;`);
        /* ===============================
           USERS
        =============================== */
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      user_name VARCHAR(120) NOT NULL,
      user_email VARCHAR(120) UNIQUE NOT NULL,
      user_secret VARCHAR(255) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `);
        /* ===============================
           ROOMS
        =============================== */
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      room_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      room_name VARCHAR(120) NOT NULL,
      room_description TEXT,
      room_status VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      ON DELETE CASCADE
    );
  `);
        /* ===============================
           OBJECTS
        =============================== */
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS objects (
      object_id INT AUTO_INCREMENT PRIMARY KEY,
      room_id INT NOT NULL,
      object_name VARCHAR(120) NOT NULL,
      object_description TEXT,
      object_url TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(room_id)
      ON DELETE CASCADE
    );
  `);
        /* ===============================
           VISITORS
        =============================== */
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS visitors (
      visitor_id INT AUTO_INCREMENT PRIMARY KEY,
      visitor_email VARCHAR(120) NOT NULL,
      visitor_password VARCHAR(255) NOT NULL,
      visitor_status VARCHAR(50) NOT NULL,
      visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
        /* ===============================
           RELAÇÃO MANY TO MANY
        =============================== */
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS visitor_rooms (
      visitor_id INT NOT NULL,
      room_id INT NOT NULL,
      PRIMARY KEY(visitor_id, room_id),
      FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
      ON DELETE CASCADE,
      FOREIGN KEY (room_id) REFERENCES rooms(room_id)
      ON DELETE CASCADE
    );
  `);
        console.log("✅ Banco pronto!");
        yield connection.end();
    });
}
/* ===============================
   EXECUÇÃO
=============================== */
bootstrapDatabase()
    .then(() => {
    console.log("🏁 Bootstrap finalizado");
    process.exit(0);
})
    .catch((error) => {
    console.error("❌ Erro no bootstrap:", error);
    process.exit(1);
});
