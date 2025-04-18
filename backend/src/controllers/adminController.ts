import { Request, Response } from "express";
import { responseHandler } from "../utils/responseHandler";
import User from "../models/User";
import Role from "../models/Role";

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { userEmail, role } = req.body;
    const user = await User.findOne({
      where: {
        email: userEmail,
      },
    });
    if (!user) throw "User not found";
    const roleUpdate = await User.update(
      { role: role },
      {
        where: {
          id: user.dataValues.id,
        },
      }
    );
    responseHandler.success(res, "User updated");
    if (!roleUpdate) throw "Role not updated";
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const fetchAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      where: {},
    });
    responseHandler.success(res, "users", users);
  } catch (error) {
    responseHandler.error(res, error);
  }
};
export const fetchAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({
      where: {},
    });
    responseHandler.success(res, "users", roles);
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const createRoles = async (req: Request, res: Response) => {
  try {
    const { departmentId, title, allowMultiple } = req.body;
    // const
    const roleCreate = await Role.create({
      allowMultiple: allowMultiple,
      title: title,
      departmentId: departmentId,
    });
    if (!roleCreate) throw "Role cannot be created";
    responseHandler.success(res, "role updated");
  } catch (error) {
    responseHandler.error(res, error);
  }
};
