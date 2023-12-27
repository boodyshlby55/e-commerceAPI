import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';

import categoriesRouter from './routes/categoriesRoute.js'
import SubcategoriesRouter from './routes/subCategoriesRoute.js'
import productsRouter from './routes/productsRoute.js'
import usersRouter from './routes/usersRoute.js'
import authRouter from './routes/authRoute.js'
import { DBConnection } from "./config/DB.js";
import { APIerrors } from "./utils/Errors.js";
import { globalError } from "./middlewares/errorsMiddleware.js";

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static('uploads'))
dotenv.config();
DBConnection();
const server = app.listen(process.env.port, () => { console.log(`app is listen on port ${process.env.port}`); });

// Routes
app.use('/api/categories', categoriesRouter);
app.use('/api/subCategories', SubcategoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);

// Errors middleware
app.all('*', (req, res, next) => { next(new APIerrors(`The route ${req.originalUrl} is not found`, 400)) });
app.use(globalError);

// Handle unhandled rejection
process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection ${err.name} | ${err.message}`);
  server.close(() => {
    // Shutdown application on error
    console.error('shutting the application down');
    process.exit(1);
  })
})

/*
Frontend

login (username / password / forget password)
in forget password (write the email to send reset password code and check before sending if the email true)
Home page (side menu [categories, products, catalog, customers, user])
in categories (show all categories and choose category to show his products)
in products (show all products)
in catalog (write customer name or select from my stared customers and product [name, price of one, quantity, price of all] / update catalog / delete catalog)
in customers (show my stared customers / add stared customer / delete customer / update customer data / and show all catalogs of specific customer)
in user (show user info and update [username, password, email]) to open user page you should write the password

Backend
1 -
init project
error handler
db connection
routes
  5 routs [categories, products, customers, catalogs, user]
  api/categories (get all categories / create category)
  api/categories/:_id (get category and all products of this category / update category / delete category and products)
    api/categories/:_id/products (create product belong to this category)
  api/products (get all products / create product)
  api/products/:_id (get specific product / update product / delete product)
  api/customers (get all customers / add customer)
  api/customers/:_id (get specific customer data / update customer data / delete customer)
    api/customers/:_id/catalogs (get all catalogs of specific customer)
  api/catalogs (get all catalogs / create new catalog)
  api/catalogs/:_id (get specific catalog / update catalog / delete catalog)
  api/user/:_id (get user info / update user info)

2 -
schema
  category
    name : String
    image : String
  product
    name : String
    image : String
    price : number
    quantity (default 0) : number
    category : objectID
  catalog
    customerName : String
    products : []
  customers
    name : String
    phoneNumber
    catalog : []
  user
    username : String
    password : String
    email : String

validator
  check while get / create / update / delete
3 -
controllers
  features
    filter data
    sort (new / old)
    search (name)
    fields
*/