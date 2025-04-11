import { Router } from "express";
import * as authController from "../controllers/authController";

const authRouter = Router();
authRouter.post("/login", authController.validateCredential);
authRouter.post("/logout", authController.logout);
authRouter.get("/verify-login", authController.verifyLogin);
export default authRouter;
