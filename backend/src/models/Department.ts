import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface DepartmentAttributes {
  id: number;
  title: string;
}

interface DepartmentCreationAttributes
  extends Optional<DepartmentAttributes, "id"> {}

const Department = sequelize.define<
  Model<DepartmentAttributes, DepartmentCreationAttributes>
>(
  "Department",
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
  },
  {
    timestamps: true,
    tableName: "department",
  }
);

export default Department;
