import type { Handler } from "express";
import { UserRepository } from "../repositories/user/UserRepository";
import { HttpError } from "../errors/HttpErrors";
import { UserStoreSchema, UserUpdateSchema } from "../schemas/user.schema";

export class UserController {
  constructor(private userRepo: UserRepository) {}

  index: Handler = async (req, res) => {
    const users = await this.userRepo.findAll();
    res.json(users);
  };

  store: Handler = async (req, res) => {
    const parsed = UserStoreSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid user data");
    }

    const { userEmail, userName, userSecret } = parsed.data;

    const userExists = await this.userRepo.findByEmail(userEmail);
    if (userExists) {
      throw new HttpError(409, "User already exists");
    }

    const newUser = await this.userRepo.create({
      userEmail,
      userName,
      userSecret,
    });

    res.status(201).json(newUser);
  };

  show: Handler = async (req, res) => {
    const { userId } = req.params;

    const user = await this.userRepo.findById(+userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    res.json(user.toPublic());
  };

  update: Handler = async (req, res) => {
    const { userId } = req.params;

    const parsed = UserUpdateSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid user data");
    }

    const user = await this.userRepo.findById(+userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const updatedUser = await this.userRepo.update(+userId, parsed.data);
    res.json(updatedUser);
  };

  delete: Handler = async (req, res) => {
    const { userId } = req.params;

    const user = await this.userRepo.findById(+userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const deletedUser = await this.userRepo.delete(+userId);
    res.json(deletedUser);
  };
}
