import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { userBaseUrl } from "../utils/constants";
const authRouter = Router();

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    res.redirect(`${userBaseUrl}token=${token}`);
  }
);
