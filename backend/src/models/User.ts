import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface UserAttributes {
  id: number;
  email: string;
  role: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "user",
  }
);

export default User;
