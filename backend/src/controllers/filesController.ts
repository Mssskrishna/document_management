import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import { clearCacheKey, getCacheData, setCacheData } from "../config/redis";
import fs from "fs";
import Attachment from "../models/Attachment";

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const key = `download-token:${token}`;

    const filePath = await getCacheData(key);

    if (!filePath || !fs.existsSync(filePath)) {
      throw "Link expired or file not found";
    }

    // Delete the token immediately to make it one-time
    await clearCacheKey(key);
    res.download(filePath); // triggers download
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const processUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw "No file uploaded";
    }

    let attachment = await Attachment.create({
      fileId: req.file.filename,
      name: req.file.originalname,
      userId: req.appUser!.id,
      applicationId: null,
    });

    responseHandler.success(res, "Upload complete", {
      attachmentId: attachment.dataValues.id,
    });
  } catch (error) {
    responseHandler.error(res, error);
  }
};
