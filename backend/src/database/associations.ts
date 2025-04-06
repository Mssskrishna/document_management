import Application from "../models/Application";
import DocumentType from "../models/DocumentType";
import User from "../models/User";

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

  // User has many Applications
  User.hasMany(Application, {
    foreignKey: "userId",
    as: "applications", // optional alias
  });

  // Application belongs to one User
  Application.belongsTo(User, {
    foreignKey: "userId",
    as: "user", // optional alias
  });
};
