import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";
import { responseHandler } from "../utils/responseHandler";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionID =
      req.cookies.sessionID || req.headers.authorization?.split(" ")[1];

    if (!sessionID) {
      return responseHandler.error(res, "Unauthorized: No token provided");
    }

    const decoded = jwt.verify(sessionID, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    //TODO : check user exists in database
    let user = await User.findOne({
      where: {
        id: decoded.userId,
      },
    });
    if (!user) throw "Unauthorized";

    let role = (await Role.findOne({
      where: {
        id: user.dataValues.role,
      },
    }))!;

    req.user = decoded; // Attach user data to request
    req.email = decoded.email;
    req.appUser = {
      id: user.dataValues.id,
      role: {
        id: user.dataValues.role,
        departmentId: role.dataValues.departmentId,
      },
    };
    next();
  } catch (error) {
    return responseHandler.error(res, "Unauthorized: Invalid token");
  }
};
