import { Router } from "express";
import * as executiveController from "../controllers/executiveController";
const executiveRouter = Router();

executiveRouter.post("/applications", executiveController.listApplications);
executiveRouter.post(
  "/update-application",
  executiveController.updateApplication
);

export default executiveRouter;
