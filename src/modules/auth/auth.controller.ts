import type { Request, Response, NextFunction } from "express";
import { loginSchema } from "./auth.validation";
import { login, getMe, AuthError } from "./auth.service";
import type { ApiResponse } from "../../types";

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getMe(req.user!.userId);

    const response: ApiResponse = {
      success: true,
      message: "User profile retrieved successfully",
      data: user,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      const response: ApiResponse = {
        success: false,
        message: error.message,
      };
      res.status(404).json(response);
      return;
    }
    next(error);
  }
};

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const result = await login(parsed.data);

    const response: ApiResponse = {
      success: true,
      message: "Login successful",
      data: result,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof AuthError) {
      const response: ApiResponse = {
        success: false,
        message: error.message,
      };
      res.status(401).json(response);
      return;
    }
    next(error);
  }
};
