import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import type { ApiResponse } from "../types";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`[Error] ${err.message}`);

  const response: ApiResponse = {
    success: false,
    message: "Internal server error",
    ...(env.NODE_ENV === "development" && { data: { stack: err.stack } }),
  };
  res.status(500).json(response);
};
