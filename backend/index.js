// Imports.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./src/database/db.js";
import userRoutes from "./src/routes/user/user.routes.js";

// App.
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", async (req, res) => {try {const result = await pool.query("SELECT NOW()");res.json({message: "🚀 AI + Blockchain Data Marketplace API is running!",time: result.rows[0].now});} catch (error) {console.error("❌ Database query error:", error);res.status(500).json({ error: "Database connection failed" });}});

// Mount user routes
app.use("/api/users", userRoutes);

// Server.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ⭐🍓👑`));
