import { Application } from "express"
import account_routes from "./accounts_routes"
import address_routes from "./addresses_routes";
import authors_routes from "./authors_routes";
import books_routes from "./books_routes";
import cards_routes from "./cards_routes";
import publishers_routes from "./publishers_routes";



export const create_routes = (app:Application):void=>{
  app.use('/ghandi/catalogue/books', books_routes);
  app.use('/ghandi/customer/account', account_routes);
  app.use('/ghandi/customer/address', address_routes );
  app.use('/ghandi/customer/cards', cards_routes);
  app.use('/ghandi/employee/authors', authors_routes);
  app.use('/ghandi/employee/publishers', publishers_routes)
  
}
