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
exports.ViewerAuthController = void 0;
const viewer_schema_1 = require("../schemas/viewer.schema");
const HttpErrors_1 = require("../errors/HttpErrors");
class ViewerAuthController {
    constructor(service, user, room) {
        this.service = service;
        this.user = user;
        this.room = room;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, roomId, userId } = viewer_schema_1.ViewerLoginSchema.parse(req.body);
                console.log("Login attempt:", { email, roomId, userId });
                const user = yield this.user.findById(userId);
                const room = yield this.room.findById(roomId);
                if (!user || !room) {
                    throw new HttpErrors_1.HttpError(404, "Usuário ou sala não encontrados");
                }
                const result = yield this.service.login(email, password, roomId);
                return res.status(200).json({
                    success: true,
                    message: "Login realizado com sucesso",
                    data: result,
                });
            }
            catch (error) {
                if (error.name === "ZodError") {
                    return res.status(400).json({
                        success: false,
                        message: "Erro de validação",
                        errors: error.errors,
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: error.message || "Erro ao autenticar",
                });
            }
        });
    }
}
exports.ViewerAuthController = ViewerAuthController;
