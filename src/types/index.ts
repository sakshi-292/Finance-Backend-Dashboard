export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export type Role = "VIEWER" | "ANALYST" | "ADMIN";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
  status: UserStatus;
}
