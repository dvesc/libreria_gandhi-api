import { Router } from "express";
import * as address_controllers from "../controllers/addresses-controllers";
import { login_middleware } from "../middlewares/login_middleware";
import { validations_middleware } from "../middlewares/validator_middleware";
import { address_validator } from "../validators/addresses_validators";

const address_routes = Router();

address_routes.post(
  "/",
  login_middleware, //required JWT
  address_validator,
  validations_middleware,
  address_controllers.create_address
);

address_routes.get("/myaddresses", 
  login_middleware, //requiret JWT
  address_controllers.get_address);

address_routes.patch(
  "/:address_id",
  login_middleware, //requiret JWT
  address_validator,
  validations_middleware,
  address_controllers.edit_address
);

address_routes.delete(
  "/:address_id",
  login_middleware, // requiret  JWT
  address_controllers.delete_address
)

export default address_routes;
