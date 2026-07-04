import { Router } from "express";
import jwt from "jsonwebtoken";

export const adminAuthRouter = Router();

adminAuthRouter.post("/login", async (req, res) => {
  const { adminKey } = req.body;

  if (!process.env.ADMIN_API_KEY || adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin key",
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.ADMIN_JWT_SECRET!,
    { expiresIn: "12h" },
  );

  return res.json({
    success: true,
    token,
  });
});