import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import prisma from "../config/prisma";
import type { ApiResponse } from "../types";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const response: ApiResponse = {
      success: false,
      message: "No authentication token provided",
    };
    res.status(401).json(response);
    return;
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User no longer exists",
      };
      res.status(401).json(response);
      return;
    }

    if (user.status === "INACTIVE") {
      const response: ApiResponse = {
        success: false,
        message: "Account is deactivated",
      };
      res.status(401).json(response);
      return;
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch {
    const response: ApiResponse = {
      success: false,
      message: "Invalid or expired token",
    };
    res.status(401).json(response);
  }
};
