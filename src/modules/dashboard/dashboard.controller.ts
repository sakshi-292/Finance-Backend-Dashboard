import type { Request, Response, NextFunction } from "express";
import { dateRangeSchema } from "./dashboard.validation";
import {
  getSummary,
  getCategoryBreakdown,
  getTypeBreakdown,
  getRecentActivity,
} from "./dashboard.service";
import type { ApiResponse } from "../../types";

const parseDateRange = (query: unknown, res: Response) => {
  const parsed = dateRangeSchema.safeParse(query);

  if (!parsed.success) {
    const response: ApiResponse = {
      success: false,
      message: "Validation failed",
      data: parsed.error.flatten().fieldErrors,
    };
    res.status(400).json(response);
    return null;
  }

  const { startDate, endDate } = parsed.data;
  if (startDate && endDate && startDate > endDate) {
    const response: ApiResponse = {
      success: false,
      message: "startDate must be before or equal to endDate",
    };
    res.status(400).json(response);
    return null;
  }

  return parsed.data;
};

export const getSummaryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const range = parseDateRange(req.query, res);
    if (!range) return;

    const data = await getSummary(range);

    const response: ApiResponse = {
      success: true,
      message: "Summary retrieved successfully",
      data,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCategoryBreakdownHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const range = parseDateRange(req.query, res);
    if (!range) return;

    const data = await getCategoryBreakdown(range);

    const response: ApiResponse = {
      success: true,
      message: "Category breakdown retrieved successfully",
      data,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getTypeBreakdownHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const range = parseDateRange(req.query, res);
    if (!range) return;

    const data = await getTypeBreakdown(range);

    const response: ApiResponse = {
      success: true,
      message: "Type breakdown retrieved successfully",
      data,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRecentActivityHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getRecentActivity();

    const response: ApiResponse = {
      success: true,
      message: "Recent activity retrieved successfully",
      data,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
