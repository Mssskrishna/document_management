import Application from "../models/Application";
import DocumentType from "../models/DocumentType";

export const performAssociations = () => {
  // One DocumentType can be linked to multiple Applications
  DocumentType.hasMany(Application, {
    foreignKey: "documentTypeId",
    as: "applications",
  });

  // Each Application belongs to one DocumentType
  Application.belongsTo(DocumentType, {
    foreignKey: "documentTypeId",
    as: "documentType",
  });
};
