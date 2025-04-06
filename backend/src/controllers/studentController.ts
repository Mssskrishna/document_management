import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import Document from "../models/Document";
import Application from "../models/Application";
import DocumentType from "../models/DocumentType";
import { ApplicationStatus } from "../enums/ApplicationStatus";
import Attachment from "../models/Attachment";
import { Op } from "sequelize";

//TODO : Middleware to allow only students
export const listDocuments = async (req: Request, res: Response) => {
  try {
    let documents = await Document.findAll({
      where: {
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
        userId: req.appUser!.id,
        applicationStatus: status,
      },
      include: [
        {
          model: Attachment,
          attributes: ["id", "name"],
          as: "attachment",
        },
      ],
    });
    responseHandler.success(res, "Fetched", applications);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const applyForDocument = async (req: Request, res: Response) => {
  try {
    let { documentTypeId, coverLetter, attachmentIds } = req.body;

    if (!Array.isArray(attachmentIds)) {
      throw "attachmentIds must be an array";
    }

    let parsedAttachmentIds: number[] = [];
    for (let i = 0; i < attachmentIds.length; i++) {
      let exists = await Attachment.findOne({
        where: {
          id: attachmentIds[i],
        },
      });

      if (!exists) {
        throw "Invalid attachment id provided";
      }

      parsedAttachmentIds.push(attachmentIds[i]);
    }

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
        userId: req.appUser!.id,
        documentTypeId: documentTypeId,
      },
    });

    if (documentExists && !documentType.dataValues.multipleAllowed) {
      throw "Document already exists for user";
    }

    let application = await Application.create({
      applicationStatus: ApplicationStatus.PENDING,
      documentTypeId: documentTypeId,
      coverLetter: coverLetter,
      userId: req.appUser!.id,
    });

    if (parsedAttachmentIds.length > 0)
      await Attachment.update(
        {
          applicationId: application.dataValues.id,
        },
        {
          where: {
            id: {
              [Op.in]: parsedAttachmentIds,
            },
          },
        }
      );

    responseHandler.success(res, "Application submitted");
  } catch (error) {
    responseHandler.error(res, error);
  }
};
