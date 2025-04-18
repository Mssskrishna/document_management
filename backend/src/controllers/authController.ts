import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/responseHandler";
import { authClient } from "../config/oauthClient";
import User from "../models/User";
import Role from "../models/Role";
import { adminEmail } from "../utils/constants";

//role
export const verifyLogin = async (req: Request, res: Response) => {
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

    let role = await Role.findOne({
      where: {
        id: user.dataValues.role ?? 0, //0 finds empty row
      },
    });

    responseHandler.success(res, "User authenticated", {
      data: {
        role: user.dataValues.role,
        email: user.dataValues.email,
        name: user.dataValues.name,
        imageUrl: user.dataValues.imageUrl,
        hasExecutorAccess: user.dataValues.role !== null,
        roleName: role ? role.dataValues.title : "",
        isAdmin: user.dataValues.email === adminEmail,
      },
    });
  } catch (error) {
    responseHandler.error(res, error);
  }
};
export const validateCredential = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    const ticket = await authClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw "Unauthorized";
    }
    const { email, name, picture } = payload!;
    if (!email) {
      throw "Unauthorized";
    }

    let user = await User.findOne({
      where: {
        email,
      },
    });
    console.log(picture);
    if (!user) {
      //create user
      user = await User.create({
        email,
        role: null, // null student ,
        name: name ?? "kviqw9023",
        imageUrl: picture ?? null,
      });
    }

    let role = await Role.findOne({
      where: {
        id: user.dataValues.role ?? 0, //0 finds empty row
      },
    });

    const sessionID = jwt.sign(
      { userId: user.dataValues.id, email: user.dataValues.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d", // Adjust expiration time as needed
      }
    );
    res.cookie("sessionID", sessionID, {
      httpOnly: true,
      secure: false, // Change to `true` in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    responseHandler.success(res, "Logged in", {
      data: {
        role: user.dataValues.role,
        email: user.dataValues.email,
        name: user.dataValues.name,
        imageUrl: user.dataValues.imageUrl,
        hasExecutorAccess: user.dataValues.role !== null,
        roleName: role ? role.dataValues.title : "",
        isAdmin: user.dataValues.email === adminEmail,
      },
    });
  } catch (error) {
    responseHandler.error(res, error);
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.clearCookie("sessionID", {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
    });
    responseHandler.success(res, "Logged out successfully", {});
  } catch (error) {
    responseHandler.error(res, error);
  }
};
