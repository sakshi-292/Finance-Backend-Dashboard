import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import type {
  CreateRecordInput,
  UpdateRecordInput,
  RecordFilter,
} from "./record.validation";

const formatRecord = (record: {
  id: string;
  amount: Prisma.Decimal;
  type: string;
  category: string;
  date: Date;
  notes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date | null;
}) => {
  const { isDeleted, deletedAt, ...rest } = record;
  return { ...rest, amount: record.amount.toNumber() };
};

export const createRecord = async (
  input: CreateRecordInput,
  createdById: string
) => {
  const record = await prisma.financialRecord.create({
    data: {
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: input.date,
      notes: input.notes,
      createdById,
    },
  });

  return formatRecord(record);
};

export const listRecords = async (filters: RecordFilter) => {
  const where: Prisma.FinancialRecordWhereInput = { isDeleted: false };

  if (filters.type) {
    where.type = filters.type;
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    where.date = {};
    if (filters.startDate) {
      where.date.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.date.lte = filters.endDate;
    }
  }

  if (filters.search) {
    where.OR = [
      { category: { contains: filters.search, mode: "insensitive" } },
      { notes: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const { page, limit } = filters;
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    prisma.financialRecord.findMany({
      where,
      orderBy: { date: "desc" },
      skip,
      take: limit,
    }),
    prisma.financialRecord.count({ where }),
  ]);

  return {
    items: records.map(formatRecord),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getRecordById = async (id: string) => {
  const record = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!record) {
    throw new RecordError(404, "Record not found");
  }

  return formatRecord(record);
};

export const updateRecord = async (id: string, input: UpdateRecordInput) => {
  if (Object.keys(input).length === 0) {
    throw new RecordError(400, "No fields provided to update");
  }

  const existing = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new RecordError(404, "Record not found");
  }

  const record = await prisma.financialRecord.update({
    where: { id },
    data: input,
  });

  return formatRecord(record);
};

export const deleteRecord = async (id: string) => {
  const existing = await prisma.financialRecord.findFirst({
    where: { id, isDeleted: false },
  });

  if (!existing) {
    throw new RecordError(404, "Record not found");
  }

  await prisma.financialRecord.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export class RecordError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "RecordError";
    this.statusCode = statusCode;
  }
}
