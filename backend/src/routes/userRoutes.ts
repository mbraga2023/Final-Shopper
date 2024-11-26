import { Router } from "express";
import { createUser, listUsers } from "../controller/userController";

const router = Router();

router.post("/users", createUser);

router.get("/users", listUsers);

export default router;