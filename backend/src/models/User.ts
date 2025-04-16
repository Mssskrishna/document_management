import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/connection";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  role: number | null;
  imageUrl: string | null;
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
      allowNull: true, //role null -> student
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "user",
  }
);

export default User;
