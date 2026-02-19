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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewerAuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtVisitor_1 = require("../utils/jwtVisitor");
class ViewerAuthService {
    constructor(repository) {
        this.repository = repository;
    }
    login(email, password, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("ViewerAuthService.login called with:", { email, roomId });
            const visitor = yield this.repository.findByEmailAndRoom(roomId, email);
            console.log("Visitor found:", visitor);
            if (!visitor) {
                throw new Error("Credenciais inválidas");
            }
            const data = visitor.data;
            if (data.visitorStatus !== "ativo") {
                throw new Error("Usuário inativo");
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, data.visitorPassword);
            if (!passwordMatch) {
                throw new Error("Credenciais inválidas");
            }
            const token = (0, jwtVisitor_1.generateToken)({
                visitorId: data.visitorId,
                visitorEmail: data.visitorEmail,
            });
            return {
                token,
                visitorId: data.visitorId,
                visitorEmail: data.visitorEmail,
            };
        });
    }
}
exports.ViewerAuthService = ViewerAuthService;
