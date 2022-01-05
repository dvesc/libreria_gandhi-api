import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";

import { dbConnect } from "./db/conection";
import { create_routes }  from "./routes";


dotenv.config();
const app = express();

dbConnect()
  .then((res: boolean) => {
    if (res == true){ 
      app.use(bodyParser.json())
      create_routes(app);
      app.listen(process.env.PORT, () => console.log("Running in port 9000"));
    }
     
  })
  .catch((e) => console.error("ERROR:"+e));
