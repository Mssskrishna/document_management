import express from "express";
import { createServer } from "http";
import cors from "cors";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import * as dotenv from "dotenv";
dotenv.config();
// import publicRouter from "../router/publicRouter";
const app = express();

app.use(bodyParser.json());
const corsOptions = {
  origin: (_origin: any, callback: (arg0: any, arg1: boolean) => void) => {
    // Check if the origin is in the list of allowed origins
    callback(null, true);
  },
  //   origin: "http://localhost:3000", // Change this to the specific domain you want to allow
  methods: "GET,PUT,POST,OPTIONS", // Specify allowed methods
  credentials: true,
  allowedHeaders: "*",
};
app.use(cors(corsOptions));
app.use(passport.initialize());

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // You can store user info in the database here
      return done(null, profile);
    }
  )
);

// app.use("/public", publicRouter);
// app.use("/admin", adminMiddleware, adminRouter);

const server = createServer(app);
export { app };
export default server;
