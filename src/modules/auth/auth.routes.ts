import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { loginHandler, getMeHandler } from "./auth.controller";

const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.get("/me", authenticate, getMeHandler);

export default authRouter;
