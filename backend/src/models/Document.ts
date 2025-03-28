import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface DocumentAttributes {
  id: number;
  title: string;
  documentTypeId: number;
  userId: number;
  issuedById: number;
  issuedAt: Date;
  fileId: string;
}

interface DocumentCreationAttributes
  extends Optional<DocumentAttributes, "id"> {}

const Document = sequelize.define<
  Model<DocumentAttributes, DocumentCreationAttributes>
>(
  "Document",
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false, // a online user is mandatory for certificate generation for now
    },
    documentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issuedById: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fileId: {
      type: DataTypes.STRING, // file identifier for the document
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "document",
  }
);

export default Document;
