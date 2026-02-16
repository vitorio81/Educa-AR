"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const zod_1 = require("zod");
const HttpErrors_1 = require("../errors/HttpErrors");
const StoreSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1),
    userEmail: zod_1.z.string().min(1),
    userSecret: zod_1.z.string().min(1),
});
const UpdateSchema = zod_1.z.object({
    userName: zod_1.z.string().min(1).optional(),
    userEmail: zod_1.z.string().min(1).optional(),
    userSecret: zod_1.z.string().min(1).optional(),
});
class UserController {
    constructor(UserRepo) {
        this.UserRepo = UserRepo;
        this.index = (req, res) => {
            const users = this.UserRepo.findAll();
            res.json(users);
        };
        this.store = (req, res) => {
            const parseBody = StoreSchema.parse(req.body);
            const userExists = this.UserRepo.findByEmail(parseBody.userEmail);
            if (userExists)
                throw new HttpErrors_1.HttpError(409, "User already exists");
            const newUser = this.UserRepo.create(parseBody);
            res.status(201).json(newUser);
        };
        this.show = (req, res) => {
            const { userId } = req.params;
            const user = this.UserRepo.findByid(+userId);
            if (!user)
                throw new HttpErrors_1.HttpError(404, "User not found");
            return res.status(200).json(user);
        };
        this.update = (req, res) => {
            const { userId } = req.params;
            const parseBody = UpdateSchema.parse(req.body);
            const user = this.UserRepo.findByid(+userId);
            if (!user)
                throw new HttpErrors_1.HttpError(404, "User not found");
            const updatedUser = this.UserRepo.update(+userId, parseBody);
            return res.status(200).json(updatedUser);
        };
        this.delete = (req, res) => {
            const { userId } = req.params;
            const user = this.UserRepo.findByid(+userId);
            if (!user)
                throw new HttpErrors_1.HttpError(404, "User not found");
            ;
            const UserDeleted = this.UserRepo.delete(+userId);
            return res.status(200).json(UserDeleted);
        };
    }
}
exports.UserController = UserController;
