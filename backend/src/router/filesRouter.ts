import { Router } from "express";
import * as filesController from "../controllers/filesController";
import { multerUpload } from "../config/multer";
import { isAuthenticated } from "../middleware/authMiddleware";

const filesRouter = Router();

//any user can perform download , having valid token
filesRouter.get("/download/:token", filesController.downloadFile);
filesRouter.post(
  "/upload",
  isAuthenticated,
  multerUpload.single("file"),
  filesController.processUpload
);
export default filesRouter;
