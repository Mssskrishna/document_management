import { Router } from "express";
import * as authController from "../controllers/authController";

const authRouter = Router();
authRouter.post("/login", authController.validateCredential);
authRouter.get("/check", authController.getToken);
export default authRouter;
