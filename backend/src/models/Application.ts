import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface ApplicationAttributes {
  id: number;
  userId: number;
  documentTypeId: number;
  applicationStatus: number;
  issuedDocumentId: number | null ;
  arpprovedBy: number | null;
  coverLetter: string | null ;
  remarks: string | null;
}

interface ApplicationCreationAttributes
  extends Optional<ApplicationAttributes, "id"> {}

const Application = sequelize.define<
  Model<ApplicationAttributes, ApplicationCreationAttributes>
>(
  "Application",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    applicationStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issuedDocumentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    arpprovedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    coverLetter: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "application",
  }
);

export default Application;
