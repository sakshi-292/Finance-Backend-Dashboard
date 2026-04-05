import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  createUserHandler,
  listUsersHandler,
  updateUserHandler,
} from "./user.controller";

const userRouter = Router();

userRouter.use(authenticate, authorize("ADMIN"));

userRouter.post("/", createUserHandler);
userRouter.get("/", listUsersHandler);
userRouter.patch("/:id", updateUserHandler);

export default userRouter;
