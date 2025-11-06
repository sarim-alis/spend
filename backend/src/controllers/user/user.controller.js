// Imports.
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "dattebayo"

// Signup user.
export const signupUser = async (req, res) => {
  try {
    const { name, email, password, wallet_address, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        wallet_address: wallet_address || null,
        role: role || "user",
      },
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return response
    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        wallet_address: user.wallet_address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "signupUser failed" });
  }
};

// Create user.
export const createUser = async (req, res) => {
  try {
    const { name, email, password, wallet_address, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "name, email, password required" });

    const hashed = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        wallet_address: wallet_address || null,
        role: role || "user",
      },
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "createUser failed" });
  }
};

// Get users.
export const getUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, wallet_address: true, role: true, created_at: true, updated_at: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "getUsers failed" });
  }
};

// Login user.
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });

    // 🔍 Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    // 🔑 Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // 🎟️ Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🧾 Return response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        wallet_address: user.wallet_address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "loginUser failed" });
  }
};

// Get user by id.
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, wallet_address: true, role: true, created_at: true, updated_at: true },
    });
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "getUserById failed" });
  }
};

// Update user.
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, wallet_address, role } = req.body;

    const data = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, saltRounds);
    if (wallet_address !== undefined) data.wallet_address = wallet_address;
    if (role !== undefined) data.role = role;

    if (Object.keys(data).length === 0) return res.status(400).json({ error: "No fields to update" });

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { ...data },
      select: { id: true, name: true, email: true, wallet_address: true, role: true, created_at: true, updated_at: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "updateUser failed" });
  }
};

// Delete user.
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({ where: { id: Number(id) }, select: { id: true } });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "deleteUser failed" });
  }
};
