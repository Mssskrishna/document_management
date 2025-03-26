import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface RoleAttributes {
  id: number;
  title: string;
  departmentId: number;
  allowMultiple: boolean;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

const Role = sequelize.define<Model<RoleAttributes, RoleCreationAttributes>>(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      //title can be changed user viewable format
      type: DataTypes.STRING,
      allowNull: false,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false, //each role associated with a department id
    },
    allowMultiple: {
      //allow multiple users with same role within a department to exist
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: "role",
  }
);

export default Role;
