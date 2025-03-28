import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Role from "../models/Role";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user as any;
  const email = user?.emails?.[0]?.value;

  if (!email) {
    return res
      .status(401)
      .json({ message: "Email is required for authentication" });
  }

  req.email = email;
  let appUser  = await User.findOne({
    where : {
      email : email
    }
  })
  let role = await Role.findOne({
    where : {
      id : appUser?.dataValues.role
    }
  })
  //TODO : throw unauthenticated if user not found
  req.appUser = {
    id: appUser!.dataValues.id,
    role: {
      id: role!.dataValues.id,
      departmentId: role!.dataValues.departmentId,
    },  
  }
  next();
};
