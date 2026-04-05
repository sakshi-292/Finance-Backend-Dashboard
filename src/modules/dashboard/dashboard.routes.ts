import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  getSummaryHandler,
  getCategoryBreakdownHandler,
  getTypeBreakdownHandler,
  getRecentActivityHandler,
} from "./dashboard.controller";

const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize("VIEWER", "ANALYST", "ADMIN"));

dashboardRouter.get("/summary", getSummaryHandler);
dashboardRouter.get("/category-breakdown", getCategoryBreakdownHandler);
dashboardRouter.get("/type-breakdown", getTypeBreakdownHandler);
dashboardRouter.get("/recent-activity", getRecentActivityHandler);

export default dashboardRouter;
