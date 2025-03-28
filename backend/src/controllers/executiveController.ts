import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import Application from "../models/Application";
import DocumentType from "../models/DocumentType";
import { ApplicationStatus } from "../enums/ApplicationStatus";

export const listApplications = async (req: Request, res: Response) => {
  try {
    let { status = ApplicationStatus.PENDING } = req.body;
    let applications = await Application.findAll({
      where: {
        applicationStatus: status,
      },
      include: [
        {
          model: DocumentType,
          as: "documentType",
          where: {
            //@ts-expect-error this
            departmentId: req.appUser!.role.departmentId!,
          },
          required: true,
        },
      ],
    });

    responseHandler.success(res, "Fetched", applications);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body;

    let application = await Application.findOne({
      where: {
        id,
      },
      include: [
        {
          model: DocumentType,
          as: "documentType",
          where: {
            //@ts-expect-error this
            departmentId: req.appUser!.role.departmentId!,
          },
          required: true,
        },
      ],
    });

    if (!application) {
      throw "Invalid Application Id or UnAuthroized";
    }

    if (
      application.dataValues.applicationStatus !== ApplicationStatus.PENDING
    ) {
      throw "Application already processed";
    }

    if (
      status !== ApplicationStatus.APPROVED &&
      status !== ApplicationStatus.REJECTED
    ) {
      throw "Invalid Status";
    }
    //generate document and update application status
    //TODO : generate a document
    await application.update({
      applicationStatus: status,
    });
    responseHandler.success(res, "Application Updtated");
  } catch (error) {
    responseHandler.error(res, error);
  }
};


