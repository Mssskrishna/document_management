import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
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
  next();
};
