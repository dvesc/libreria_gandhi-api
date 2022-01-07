import { Router } from "express";
import { validations_middleware } from "../middlewares/validator_middleware";
import { book_validator, book_update_validator } from "../validators/books_validators";
import * as books_controllers from "../controllers/books_controllers"

const books_routes = Router();

books_routes.post(
  "/new",
  book_validator,
  validations_middleware,
  books_controllers.create_book
);
books_routes.get(
  "/search",
  books_controllers.get_books
)
books_routes.patch(
  "/:book_id",
  book_update_validator,
  validations_middleware,
  books_controllers.edit_book
)

export default books_routes;