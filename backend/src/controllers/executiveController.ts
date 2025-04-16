import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import Application from "../models/Application";
import DocumentType from "../models/DocumentType";
import { ApplicationStatus } from "../enums/ApplicationStatus";
import User from "../models/User";
import { generateAndSavePDF } from "../utils/pdfGenerator";
import Document from "../models/Document";
import Attachment from "../models/Attachment";
import { Op } from "sequelize";

export const stats = async (req: Request, res: Response) => {
  try {
    let pending = await Application.count({
      where: {
        applicationStatus: ApplicationStatus.PENDING,
      },
    });
    let rejected = await Application.count({
      where: {
        applicationStatus: ApplicationStatus.REJECTED,
      },
    });
    let approved = await Application.count({
      where: {
        applicationStatus: ApplicationStatus.APPROVED,
      },
    });
    responseHandler.success(res, "Fetched", {
      stats: {
        pending,
        rejected,
        approved,
      },
    });
  } catch (error) {
    responseHandler.error(res, error);
  }
};
export const listApplications = async (req: Request, res: Response) => {
  try {
    let { status = [ApplicationStatus.PENDING] } = req.body;

    let applications = await Application.findAll({
      where: {
        applicationStatus: {
          [Op.in]: status,
        },
      },
      include: [
        {
          model: DocumentType,
          as: "documentType",
          where: {
            departmentId: req.appUser!.role!.departmentId!,
          },
          required: true,
        },
        {
          model: User,
          as: "user",
        },
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
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { userEmail, role } = req.body;
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });
    if (!user) throw "User not found";
    const roleUpdate = await User.update(
      { role: role },
      {
        where: {
          id: user.dataValues.id,
        },
      }
    );
    if (!roleUpdate) throw "Role not updated";
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { id, status, remarks } = req.body;

    let application = await Application.findOne({
      where: {
        id,
      },
      include: [
        {
          model: DocumentType,
          as: "documentType",
          where: {
            departmentId: req.appUser!.role!.departmentId!,
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

    let generatedDocumentId = null;
    if (status === ApplicationStatus.APPROVED) {
      let documentType = (await DocumentType.findOne({
        where: {
          id: application.dataValues.documentTypeId,
        },
      }))!;

      //TODO : pass application data for pdf creation
      let generatedFileId = await generateAndSavePDF(
        documentType.dataValues.templateName + ".html",
        {}
      );

      if (!generatedFileId) {
        throw "Failed to generated document";
      }

      let document = await Document.create({
        fileId: generatedFileId,
        documentTypeId: documentType.dataValues.id,
        issuedAt: new Date(),
        issuedById: req.appUser!.id,
        title: "", //todo check if this is required
        userId: application.dataValues.userId,
      });

      generatedDocumentId = document.dataValues.id;
    }

    //generate document and update application status
    //TODO : generate a document
    await application.update({
      applicationStatus: status,
      issuedDocumentId: generatedDocumentId,
      remarks: remarks,
      arpprovedBy: req.appUser!.id,
    });
    responseHandler.success(res, "Application Updtated");
  } catch (error) {
    responseHandler.error(res, error);
  }
};
