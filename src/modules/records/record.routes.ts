import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import {
  createRecordHandler,
  listRecordsHandler,
  getRecordByIdHandler,
  updateRecordHandler,
  deleteRecordHandler,
} from "./record.controller";

const recordRouter = Router();

recordRouter.use(authenticate);

recordRouter.post("/", authorize("ADMIN"), createRecordHandler);
recordRouter.get("/", authorize("ADMIN", "ANALYST"), listRecordsHandler);
recordRouter.get("/:id", authorize("ADMIN", "ANALYST"), getRecordByIdHandler);
recordRouter.patch("/:id", authorize("ADMIN"), updateRecordHandler);
recordRouter.delete("/:id", authorize("ADMIN"), deleteRecordHandler);

export default recordRouter;
