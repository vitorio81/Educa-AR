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
exports.UserController = void 0;
const HttpErrors_1 = require("../errors/HttpErrors");
const user_schema_1 = require("../schemas/user.schema");
class UserController {
    constructor(userRepo) {
        this.userRepo = userRepo;
        this.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepo.findAll();
            res.json(users);
        });
        this.store = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const parsed = user_schema_1.UserStoreSchema.safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid user data");
            }
            const { userEmail, userName, userSecret } = parsed.data;
            const userExists = yield this.userRepo.findByEmail(userEmail);
            if (userExists) {
                throw new HttpErrors_1.HttpError(409, "User already exists");
            }
            const newUser = yield this.userRepo.create({
                userEmail,
                userName,
                userSecret,
            });
            res.status(201).json(newUser);
        });
        this.show = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const user = yield this.userRepo.findById(+userId);
            if (!user) {
                throw new HttpErrors_1.HttpError(404, "User not found");
            }
            res.json(user.toPublic());
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const parsed = user_schema_1.UserUpdateSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                throw new HttpErrors_1.HttpError(400, "Invalid user data");
            }
            const user = yield this.userRepo.findById(+userId);
            if (!user) {
                throw new HttpErrors_1.HttpError(404, "User not found");
            }
            const updatedUser = yield this.userRepo.update(+userId, parsed.data);
            res.json(updatedUser);
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const user = yield this.userRepo.findById(+userId);
            if (!user) {
                throw new HttpErrors_1.HttpError(404, "User not found");
            }
            const deletedUser = yield this.userRepo.delete(+userId);
            res.json(deletedUser);
        });
    }
}
exports.UserController = UserController;
