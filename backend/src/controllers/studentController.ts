import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import Document from "../models/Document";
import Application from "../models/Application";
import DocumentType from "../models/DocumentType";
import { ApplicationStatus } from "../enums/ApplicationStatus";

//TODO : Middleware to allow only students
export const listDocuments = async (req: Request, res: Response) => {
  try {
    let documents = await Document.findAll({
      where: {
        //@ts-expect-error thisc
        userId: req.appUser!.id,
      },
    });
    responseHandler.success(res, "Fetched", documents);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const listApplications = async (req: Request, res: Response) => {
  try {
    let { status = ApplicationStatus.PENDING } = req.body;
    status = parseInt(status);
    let applications = await Application.findAll({
      where: {
        //@ts-expect-error thisc
        userId: req.appUser!.id,
        applicationStatus: status,
      },
    });
    responseHandler.success(res, "Fetched", applications);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const applyForDocument = async (req: Request, res: Response) => {
  try {
    let { documentTypeId, remarks } = req.body;

    let documentType = await DocumentType.findOne({
      where: {
        id: documentTypeId,
      },
    });
    if (!documentType) {
      throw "Invalid Document Type";
    }

    let documentExists = await Document.findOne({
      where: {
        //@ts-expect-error thisc
        userId: req.appUser!.id,
        documentTypeId: documentTypeId,
      },
    });

    if (documentExists && !documentType.dataValues.multipleAllowed) {
      throw "Document already exists for user";
    }

    await Application.create({
      applicationStatus: ApplicationStatus.PENDING,
      documentTypeId: documentTypeId,
      remarks: remarks,
      //@ts-expect-error this
      userId: req.appUser!.id,
    });

    responseHandler.success(res, "Application submitted");
  } catch (error) {
    responseHandler.error(res, error);
  }
};
