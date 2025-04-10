import * as dotenv from "dotenv";
import server from "./config/server";
import { makeConnection } from "./config/connection";
import { init } from "./database/init";
import { redisConnect } from "./config/redis";
import { generateAndSavePDF } from "./utils/pdfGenerator";

dotenv.config();
const port = 8080;

server.listen(port, () => {
  console.log(`server listening at ${port}`);
  makeConnection().then(async (res) => {
    "Connected to database";
    init();
    redisConnect();
    generateAndSavePDF('id-card.html' , {})
  });
});
