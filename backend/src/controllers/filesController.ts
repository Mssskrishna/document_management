import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import { clearCacheKey, getCacheData, setCacheData } from "../config/redis";
import fs from "fs";
import Attachment from "../models/Attachment";
import Document from "../models/Document";
import Application from "../models/Application";
import DocumentType from "../models/DocumentType";
import { generateOTAToken } from "../utils/pdfGenerator";

export const initiateDownload = async (req: Request, res: Response) => {
  try {
    let { documentId, attachmentId } = req.body;

    let fileId;
    if (!documentId && !attachmentId) {
      throw "Missing Parameters";
    }
    if (attachmentId) {
      let attachment = await Attachment.findOne({
        where: {
          id: attachmentId,
        },
      });

      if (!attachment) {
        throw "Invalid Attachment Id";
      }
      //check for permissions to user for attachment
      if (req.appUser!.id != attachment.dataValues.userId) {
        //attachment requested by other user than creator
        if (!attachment.dataValues.applicationId) {
          //i.e application hasn't been created yet
          throw "Attachment not attached to application";
        }
        let application = await Application.findOne({
          attributes: ["documentTypeId"],
          where: {
            id: attachment.dataValues.applicationId!,
          },
        });
        let documentType = (await DocumentType.findOne({
          where: {
            id: application?.dataValues.documentTypeId,
          },
        }))!;
        if (
          documentType.dataValues.departmentId != req.appUser!.role.departmentId
        ) {
          throw "UnAuthroized";
        }
      }

      fileId = attachment.dataValues.fileId;
    }

    if (documentId) {
      let document = await Document.findOne({
        where: {
          id: documentId,
        },
      });
      if (!document) {
        throw "Invlaid Document Id";
      }
      //check access for file
      if (req.appUser!.id != document!.dataValues.userId) {
        let documentType = (await DocumentType.findOne({
          where: {
            id: document.dataValues.documentTypeId,
          },
        }))!;
        if (
          documentType.dataValues.departmentId != req.appUser!.role.departmentId
        ) {
          throw "UnAuthroized";
        }
      }
      fileId = document.dataValues.fileId;
    }

    let accessToken = await generateOTAToken(fileId!);
    responseHandler.success(res, "Token Created", { accessToken });
  } catch (error) {
    responseHandler.error(res, error);
  }
};

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
