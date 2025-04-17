import { Router } from "express";
import * as executiveController from "../controllers/executiveController";
const executiveRouter = Router();

executiveRouter.get("/notifications", executiveController.notifications);
executiveRouter.get("/stats", executiveController.stats);
executiveRouter.post("/applications", executiveController.listApplications);
executiveRouter.post(
  "/update-application",
  executiveController.updateApplication
);
executiveRouter.post("/updaterole", executiveController.updateRole);
export default executiveRouter;
