import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

export interface DocumentTypeAttributes {
  id: number;
  title: string;
  canGenerateDigitally: boolean;
  canGeneratePhysically: boolean;
  preRequiredTypes ?: string; //array of document type ids that are necessary for requesting document
  templateName: string;
  multipleAllowed: boolean;
  departmentId: number;
}

export interface DocumentTypeCreationAttributes
  extends Optional<DocumentTypeAttributes, "id"> {}

const DocumentType = sequelize.define<
  Model<DocumentTypeAttributes, DocumentTypeCreationAttributes>
>(
  "DocumentType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    templateName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    canGenerateDigitally: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    canGeneratePhysically: {
      //if set to true , offiline uploads are allowed
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    preRequiredTypes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: true,
    },
    multipleAllowed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    //temporary use of department id for accesssibility
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "document_type",
  }
);

export default DocumentType;
