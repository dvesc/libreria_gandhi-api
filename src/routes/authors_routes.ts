import { Router } from "express";
import * as authors_controllers from "../controllers/authors_controllers";

import { validations_middleware } from "../middlewares/validator_middleware";
import { authors_validators } from "../validators/authors_validators";


const authors_routes = Router();


authors_routes.post(
  "/new",
  authors_validators,
  validations_middleware,
  authors_controllers.create_author
);

authors_routes.get(
  "",
  authors_controllers.get_author
)

export default authors_routes;