import type { Request, Response, NextFunction } from "express";
import {
  createRecordSchema,
  updateRecordSchema,
  recordIdParamSchema,
  recordFilterSchema,
} from "./record.validation";
import {
  createRecord,
  listRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  RecordError,
} from "./record.service";
import type { ApiResponse } from "../../types";

export const createRecordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createRecordSchema.safeParse(req.body);

    if (!parsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const record = await createRecord(parsed.data, req.user!.userId);

    const response: ApiResponse = {
      success: true,
      message: "Record created successfully",
      data: record,
    };
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof RecordError) {
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

export const listRecordsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = recordFilterSchema.safeParse(req.query);

    if (!parsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: parsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const { startDate, endDate } = parsed.data;
    if (startDate && endDate && startDate > endDate) {
      const response: ApiResponse = {
        success: false,
        message: "startDate must be before or equal to endDate",
      };
      res.status(400).json(response);
      return;
    }

    const result = await listRecords(parsed.data);

    const response: ApiResponse = {
      success: true,
      message: "Records retrieved successfully",
      data: result,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getRecordByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramParsed = recordIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: paramParsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const record = await getRecordById(paramParsed.data.id);

    const response: ApiResponse = {
      success: true,
      message: "Record retrieved successfully",
      data: record,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof RecordError) {
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

export const updateRecordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramParsed = recordIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: paramParsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const bodyParsed = updateRecordSchema.safeParse(req.body);

    if (!bodyParsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: bodyParsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    const record = await updateRecord(paramParsed.data.id, bodyParsed.data);

    const response: ApiResponse = {
      success: true,
      message: "Record updated successfully",
      data: record,
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof RecordError) {
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

export const deleteRecordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramParsed = recordIdParamSchema.safeParse(req.params);

    if (!paramParsed.success) {
      const response: ApiResponse = {
        success: false,
        message: "Validation failed",
        data: paramParsed.error.flatten().fieldErrors,
      };
      res.status(400).json(response);
      return;
    }

    await deleteRecord(paramParsed.data.id);

    const response: ApiResponse = {
      success: true,
      message: "Record deleted successfully",
    };
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof RecordError) {
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
