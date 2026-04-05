import type { Request, Response, NextFunction } from "express";
import type { Role, ApiResponse } from "../types";

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      const response: ApiResponse = {
        success: false,
        message: "Insufficient permissions",
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};
