import express from "express";
import { notFoundHandler } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";
import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/users/user.routes";
import recordRouter from "./modules/records/record.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";
import type { ApiResponse } from "./types";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  const response: ApiResponse = {
    success: true,
    message: "Server is running",
  };
  res.status(200).json(response);
});

const API_V1 = "/api/v1";

app.use(`${API_V1}/auth`, authRouter);
app.use(`${API_V1}/users`, userRouter);
app.use(`${API_V1}/records`, recordRouter);
app.use(`${API_V1}/dashboard`, dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
