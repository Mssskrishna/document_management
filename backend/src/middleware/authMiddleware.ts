import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Role from "../models/Role";
import { adminEmail } from "../utils/constants";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionID =
      req.cookies.sessionID || req.headers.authorization?.split(" ")[1];
    if (!sessionID) {
      throw "Unauthorized: No token provided";
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

    req.user = decoded; // Attach user data to request
    req.email = decoded.email;
    req.appUser = {
      id: user.dataValues.id,
      role: null,
    };

    if (user.dataValues.role) {
      let role = (await Role.findOne({
        where: {
          id: user.dataValues.role,
        },
      }))!;

      req.appUser.role = user.dataValues.role
        ? {
            id: user.dataValues.role,
            departmentId: role.dataValues.departmentId,
          }
        : null;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const isExecutor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.appUser && req.appUser.role !== null) {
      next();
    } else {
      throw "UnAuthorized";
    }
  } catch (error) {
    next(error);
  }
};
export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.email === adminEmail) {
      next();
    } else {
      throw "Unauthorized";
    }
  } catch (error) {
    next(error);
  }
};
export const isStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.appUser && req.appUser.role === null) {
      next();
    } else {
      throw "UnAuthorized";
    }
  } catch (error) {
    next(error);
  }
};
