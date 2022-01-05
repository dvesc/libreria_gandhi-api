import { Router } from "express";
import * as account_controllers from "../controllers/accounts-controllers";
import { validations_middleware } from "../middlewares/validator_middleware";
import {
  create_validator,
  forgot_validator,
  login_validator,
  password_validator,
} from "../validators/accounts-validators";

const account_routes = Router();

account_routes.post(
  "/",
  create_validator,
  validations_middleware,
  account_controllers.create_account
);

account_routes.post(
  "/login",
  login_validator,
  validations_middleware,
  account_controllers.login //return JWT
);

account_routes.patch(
  "/forgotpassword",
  forgot_validator,
  validations_middleware,
  account_controllers.forgot_password //return JWT
);

account_routes.patch(
  "/newpassword",
  password_validator,
  validations_middleware,
  account_controllers.create_password
);

export default account_routes;

//restore_password
