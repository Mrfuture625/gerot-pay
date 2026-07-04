import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token || !process.env.ADMIN_JWT_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized admin request",
    });
  }

  try {
    jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
}