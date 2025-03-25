import * as dotenv from "dotenv";
import server from "./config/server";
import { redisConnect } from "./config/redis";
import { makeConnection } from "./config/connection";
dotenv.config();
const port = 8080;

server.listen(port, () => {
  console.log(`server listening at ${port}`);
});

makeConnection().then(async (res) => {
  redisConnect().then(() => {});
});
