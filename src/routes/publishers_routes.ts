import { Router } from "express";
import * as publishers_controllers from "../controllers/publishers_controllers"
const publishers_routes = Router()

publishers_routes.post(
  "/new",
  //vaidators
  publishers_controllers.create_publisher
);

publishers_routes.get(
  "",
  publishers_controllers.get_publishers
);



export default publishers_routes;