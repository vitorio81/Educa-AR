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
exports.AuthController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userEmail, userSecret } = req.body;
                if (!userEmail || !userSecret) {
                    throw new HttpErrors_1.HttpError(400, "Email e senha são obrigatórios");
                }
                const result = yield this.authService.login({
                    email: userEmail,
                    password: userSecret,
                });
                return res.status(200).json(Object.assign({ message: "Login realizado com sucesso" }, result));
            }
            catch (error) {
                if (error instanceof HttpErrors_1.HttpError) {
                    return res.status(error.status).json({
                        message: error.message,
                    });
                }
                return res.status(500).json({
                    message: "Erro interno no servidor",
                });
            }
        });
    }
}
exports.AuthController = AuthController;
