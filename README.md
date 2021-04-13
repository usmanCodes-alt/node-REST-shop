# node-REST-shop
A RESTful API that manages Users, Products and Orders.

This API allows users to manipulate Products and Orders.

## Routes available for Users.

* ```/users/signup```
  * This is a ```POST``` request.
  * Allows a new user to be created and hashes their password while storing them into the database.
    This route also ensures that no user with a duplicate email is created.
* ```/users/login```
  * This is also a ```POST``` request.
  * Allows a user to be logged in only if the credentials passed are correct. The credentials required for ```/users/login``` to be successfull are:
    * Email
    * Password
  * Upon input of correct credentials, a ```jsonwebtoken``` is created and sent to the client,
  which is after that required to be sent by the client to the server for every protected route.
* ```/users/delete```
  * This is a ```DELETE``` request.
  * Deletes a user from the database of the given id.
  * Requires a ```userId``` to be passed.

## Routes available for Products.

* ```/products/```
  * This is a ```GET``` request.
  * Allows user to view all the products in the database.
  * The user does not need to be logged in to access this endpoint.
* ```/products/:productId```
  * This is a ```GET``` request.
  * This endpoint allows user to view a specific product of the given id in the request parameters.
* ```/product```
  * A protected ```POST``` request.
  * This route creates a new product in the database, following information is required to add a new product:
    * Name of the product
    * Price of the product
    * Product Image (OPTIONAL)
  * This routes saves the image (if provided) using ```multer``` package in the ```uploads``` folder created on the server.
  * An ```authentication``` middleware is run before the request handler is run to ensure that the user is logged in.
* ```/products/:productId```
  * A protected ```PATCH``` request.
  * This route updates the product which's Id was passed in the request parameters (i.e ```productId```).
  * The updates that user is allowed to do are as follows
    * Name
    * Price
  * This is a protected route, so user need to be logged in to access this route.
* ```/products/:productId```
  * A protected ```DELETE``` request.
  * This route deletes a product from the database of the provided Id in the request parameters.
  * This is also a protected route, so the user has to be logged in to access this route.
