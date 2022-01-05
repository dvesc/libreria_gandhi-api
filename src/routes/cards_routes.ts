import { Router } from "express";
import  * as cards_controllers from "../controllers/cards_controllers";
import { login_middleware } from "../middlewares/login_middleware";
import { validations_middleware } from "../middlewares/validator_middleware";
import { cards_body_validator } from "../validators/cards_body_validators";
import { cards_data_middleware } from "../validators/cards_data_validators";

const cards_routes = Router()

cards_routes.post(
  "/",
  login_middleware,
  cards_body_validator,
  validations_middleware,
  cards_data_middleware,
  cards_controllers.create_card
)
cards_routes.get(
  "/mycards",
  login_middleware,
  cards_controllers.get_cards
)

cards_routes.patch(
  "/:card_id",
  login_middleware, //requiret JWT
  cards_body_validator,
  validations_middleware,
  cards_data_middleware,
  cards_controllers.edit_cards
);

cards_routes.delete(
  "/:card_id",
  login_middleware,
  cards_controllers.delete_card
)




export default cards_routes;