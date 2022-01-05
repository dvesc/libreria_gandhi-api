import { Router } from "express";
import * as searches_controllers from "../controllers/searches_controllers";
import { login_middleware } from "../middlewares/login_middleware";

const search_routes = Router();

search_routes.get(
  "",
  login_middleware,
  searches_controllers.get_books
);

export default search_routes;