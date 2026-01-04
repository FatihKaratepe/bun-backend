import { Router } from "express";
import { UserController } from "@controllers";

const router = Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);

export const UserRoutes = router;
