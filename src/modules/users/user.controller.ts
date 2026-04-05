import type { Request, Response, NextFunction } from "express";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.validation";
import { createUser, listUsers, updateUser, UserError } from "./user.service";
import type { ApiResponse } from "../../types";

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createUserSchema.safeParse(req.body);

    if (!parsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const user = await createUser(parsed.data);

    const response: ApiResponse = {
      success: true,
      message: "User created successfully",
      data: user,
    };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof UserError) {
      const response: ApiResponse = {
        success: false,
        message: error.message,
      };
      res.status(error.statusCode).json(response);
      return;
    }
    next(error);
  }
};

export const listUsersHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await listUsers();

    const response: ApiResponse = {
      success: true,
      message: "Users retrieved successfully",
      data: users,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramParsed = userIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: paramParsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const bodyParsed = updateUserSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: bodyParsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const user = await updateUser(
      paramParsed.data.id,
      bodyParsed.data,
      req.user!.userId
    );

    const response: ApiResponse = {
      success: true,
      message: "User updated successfully",
      data: user,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof UserError) {
      const response: ApiResponse = {
        success: false,
        message: error.message,
      };
      res.status(error.statusCode).json(response);
      return;
    }
    next(error);
  }
};
