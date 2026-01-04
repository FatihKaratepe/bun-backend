import type { Request, Response } from "express";
import { UserService } from "@services";

export const UserController = {
    getAllUsers: (req: Request, res: Response) => {
        try {
            const users = UserService.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    },
    getUserById: (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id || "");
            const user = UserService.findById(id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching user" });
        }
    },
    createUser: (req: Request, res: Response) => {
        try {
            const newUser = req.body;
            const createdUser = UserService.create(newUser);
            res.status(201).json(createdUser);
        } catch (error) {
            res.status(500).json({ message: "Error creating user" });
        }
    },
};
