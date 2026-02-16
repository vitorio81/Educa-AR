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
exports.AuthService = void 0;
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield this.userRepo.findByEmail(email);
            if (!user) {
                throw new Error("Usuário ou senha inválidos");
            }
            const passwordMatch = yield (0, password_1.comparePassword)(password, user.data.userSecret);
            if (!passwordMatch) {
                throw new Error("Usuário ou senha inválidos");
            }
            const token = (0, jwt_1.generateToken)({
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
        });
    }
}
exports.AuthService = AuthService;
