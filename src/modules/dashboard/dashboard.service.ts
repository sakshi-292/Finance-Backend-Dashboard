import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import type { DateRangeFilter } from "./dashboard.validation";

const buildDateFilter = (
  range: DateRangeFilter
): Prisma.FinancialRecordWhereInput => {
  const where: Prisma.FinancialRecordWhereInput = { isDeleted: false };

  if (range.startDate || range.endDate) {
    const date: Prisma.DateTimeFilter = {};
    if (range.startDate) date.gte = range.startDate;
    if (range.endDate) date.lte = range.endDate;
    where.date = date;
  }

  return where;
};

const decimalToNumber = (value: Prisma.Decimal | null): number =>
  value ? value.toNumber() : 0;

export const getSummary = async (range: DateRangeFilter) => {
  const where = buildDateFilter(range);

  const [income, expense, total] = await Promise.all([
    prisma.financialRecord.aggregate({
      where: { ...where, type: "INCOME" },
      _sum: { amount: true },
    }),
    prisma.financialRecord.aggregate({
      where: { ...where, type: "EXPENSE" },
      _sum: { amount: true },
    }),
    prisma.financialRecord.count({ where }),
  ]);

  const totalIncome = decimalToNumber(income._sum.amount);
  const totalExpense = decimalToNumber(expense._sum.amount);

  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalRecords: total,
  };
};

export const getCategoryBreakdown = async (range: DateRangeFilter) => {
  const where = buildDateFilter(range);

  const groups = await prisma.financialRecord.groupBy({
    by: ["category", "type"],
    where,
    _sum: { amount: true },
    _count: true,
  });

  return groups
    .map((g) => ({
      category: g.category,
      type: g.type,
      total: decimalToNumber(g._sum.amount),
      count: g._count,
    }))
    .sort(
      (a: { total: number; category: string }, b: { total: number; category: string }) => {
        if (b.total !== a.total) return b.total - a.total;
        return a.category.localeCompare(b.category);
      }
    );
};

export const getTypeBreakdown = async (range: DateRangeFilter) => {
  const where = buildDateFilter(range);

  const groups = await prisma.financialRecord.groupBy({
    by: ["type"],
    where,
    _sum: { amount: true },
    _count: true,
  });

  const income = groups.find((g) => g.type === "INCOME");
  const expense = groups.find((g) => g.type === "EXPENSE");

  return {
    income: {
      total: decimalToNumber(income?._sum.amount ?? null),
      count: income?._count ?? 0,
    },
    expense: {
      total: decimalToNumber(expense?._sum.amount ?? null),
      count: expense?._count ?? 0,
    },
  };
};

export const getRecentActivity = async () => {
  // Ordered by createdAt (when the record was added to the system),
  // not by date (the business transaction date).
  const records = await prisma.financialRecord.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return records.map((r) => {
    const { isDeleted, deletedAt, ...rest } = r;
    return { ...rest, amount: r.amount.toNumber() };
  });
};
