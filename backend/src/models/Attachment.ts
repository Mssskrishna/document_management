import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface AttachmentAttributes {
  id: number;
  userId: number;
  applicationId: number | null;
  name: string;
  fileId: string;
}

interface AttachmentCreationAttributes
  extends Optional<AttachmentAttributes, "id"> {}

const Attachment = sequelize.define<
  Model<AttachmentAttributes, AttachmentCreationAttributes>
>(
  "Attachment",
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
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "attachment",
  }
);

export default Attachment;
