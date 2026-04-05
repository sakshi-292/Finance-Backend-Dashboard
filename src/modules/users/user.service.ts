import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import type { CreateUserInput, UpdateUserInput } from "./user.validation";

const SALT_ROUNDS = 10;

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const createUser = async (input: CreateUserInput) => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new UserError(409, "A user with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      status: input.status,
    },
    select: safeUserSelect,
  });

  return user;
};

export const listUsers = async () => {
  const users = await prisma.user.findMany({
    select: safeUserSelect,
    orderBy: { createdAt: "desc" },
  });

  return users;
};

export const updateUser = async (
  id: string,
  input: UpdateUserInput,
  currentUserId: string
) => {
  if (Object.keys(input).length === 0) {
    throw new UserError(400, "No fields provided to update");
  }

  const existing = await prisma.user.findUnique({ where: { id } });

  if (!existing) {
    throw new UserError(404, "User not found");
  }

  if (id === currentUserId) {
    if (input.status === "INACTIVE") {
      throw new UserError(400, "You cannot deactivate your own account");
    }
    if (input.role && input.role !== "ADMIN") {
      throw new UserError(400, "You cannot remove your own admin role");
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: input,
    select: safeUserSelect,
  });

  return user;
};

export class UserError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "UserError";
    this.statusCode = statusCode;
  }
}
