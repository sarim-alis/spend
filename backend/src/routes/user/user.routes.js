// Imports.
import express from "express";
import { signupUser, createUser, getUsers, loginUser, getUserById, updateUser, deleteUser } from "../../controllers/auth/user.controller.js";

const router = express.Router();
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
