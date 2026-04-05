import type { Request, Response } from "express";
import type { ApiResponse } from "../types";

export const notFoundHandler = (_req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: "Route not found",
  };
  res.status(404).json(response);
};
