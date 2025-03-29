import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { responseHandler } from "../utils/responseHandler";
import { authClient } from "../config/oauthClient";
import User from "../models/User";

export const getToken = async (req: Request, res: Response) => {
  try {
    const { cookies } = req;
    if (!cookies.sessionID) {
      throw "Unauthorized";
    }
    //try chesanu change chey
    const decoded = jwt.verify(cookies.sessionID, process.env.JWT_SECRET!);
    responseHandler.success(res, "Logged in", decoded);
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
    const { email } = payload!;
    if (!email) {
      throw "Unauthorized";
    }

    let user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      //create user
      user = await User.create({
        email,
        role: 0, // 0 student ,
      });
    }

    const sessionID = jwt.sign(
      { userId: user.dataValues.id, email: user.dataValues.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d", // Adjust expiration time as needed
      }
    );
    res.cookie("sessionID", sessionID, {
      httpOnly: true,
      secure: false, // Set to true in production when using HTTPS
      maxAge: 24 * 3600000, // 1 hour in milliseconds
    });
    responseHandler.success(res, "Logged in", {});
  } catch (error) {
    responseHandler.error(res, error);
  }
};
