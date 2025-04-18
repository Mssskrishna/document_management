import { Router } from "express";
import * as adminController from "../controllers/adminController";

const adminRouter = Router();
adminRouter.post("/updateRole", adminController.updateRole);
adminRouter.get("/users", adminController.fetchAllUsers);
adminRouter.post("/createRole", adminController.createRoles);
adminRouter.get("/roles", adminController.fetchAllRoles);

export default adminRouter;
