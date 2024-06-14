# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

     <report the here the dependency graph of EzElectronics>

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| Test case name | Object(s) tested | Test level | Technique used |
| :------------: | :--------------: | :--------: | :------------: |
|should delete all carts|CartController deleteAllCarts|Unit|WB|
|should throw an error if deletion fails|CartController deleteAllCarts|Unit|WB|
|should clear the cart if it exists|CartController clearCart|Unit|WB|
|should throw CartNotFoundError if the cart does not exist|CartController clearCart|Unit|WB|
|should retrieve all carts|CartController getCartsAll|Unit|WB|
|should throw an error if retrieval fails|CartController getCartsAll|Unit|WB|
|should retrieve all paid carts for a specific customer|CartController getAllCarts|Unit|WB|
|should throw an error if retrieval fails|CartController getAllCarts|Unit|WB|
|should checkout the cart if it exists and has products|CartController checkoutCart|Unit|WB|
|should throw CartNotFoundError if the cart does not exist|CartController checkoutCart|Unit|WB|
|should throw EmptyCartError if the cart is empty|CartController checkoutCart|Unit|WB|
|Should return a cart if it exists|CartController getCart|Unit|WB|
|should return an empty Cart if the cart does not exist|CartController getCart|Unit|WB|
|should add a product to the cart if the cart exists|CartController addToCart|Unit|WB|
|should remove one product unit from the cart|CartController getAllCarts|Unit|WB|
|should throw CartNotFoundError if the cart does not exist|CartController getAllCarts|Unit|WB|
|should throw ProductNotInCartError if the product is not in the cart|CartController getAllCarts|Unit|WB|
|should throw an error if removal fails|CartController getAllCarts|Unit|WB|
|should return true|registerProducts|Unit|WB|
|should replace arrivalDate if null|registerProducts|Unit|WB|
|should return true|deleteAllProducts|Unit|WB|
|should return new quantity|changeProductQuantity|Unit|WB|
|should throw ProductNotFoundError|changeProductQuantity|Unit|WB|
|should throw ChangeDateAfterCurrentDateError|changeProductQuantity|Unit|WB|
|should throw ChangeDateBeforeArrivalDateError|changeProductQuantity|Unit|WB|
|should return an array of products|getProducts|Unit|WB|
|should filter by category|getProducts|Unit|WB|
|should filter by model|getProducts|Unit|WB|
|should return an empty array|getProducts|Unit|WB|
|should throw ProductNotFoundError|getProducts|Unit|WB|
|should return an array of products|getAvailableProducts|Unit|WB|
|should filter by category|getAvailableProducts|Unit|WB|
|should filter by model|getAvailableProducts|Unit|WB|
|should return an empty array|getAvailableProducts|Unit|WB|
|should throw ProductNotFoundError|getAvailableProducts|Unit|WB|
|should return true|deleteProduct|Unit|WB|
|should throw ProductNotFoundError|deleteProduct|Unit|WB|
|should return the new quantity of the product|sellProduct|Unit|WB|
|should throw ProductNotFoundError|sellProduct|Unit|WB|
|should throw DateError|sellProduct|Unit|WB|
|should throw EmptyProductStockError|sellProduct|Unit|WB|
|should throw LowProductStockError|sellProduct|Unit|WB|
|should throw ProductNotFoundError|getProductReviews|Unit|WB|
|should return a list of reviews|getProductReviews|Unit|WB|
|should throw ProductNotFoundError|deleteReview|Unit|WB|
|should throw NoReviewProductError|deleteReview|Unit|WB|
|should return a promise that resolve nothing|deleteReview|Unit|WB|
|should return a promise that resolve nothing|deleteAllReviews|Unit|WB|
|should throw ExistingReviewError|addReview|Unit|WB|
|should throw ProductNotFoundError|addReview|Unit|WB|
|should throw ProductNotFoundError|deleteReviewsOfProduct|Unit|WB|
|should return a promise that resolve nothing|deleteReviewsOfProduct|Unit|WB|
|It should return an array of users|getUsers|Unit|WB|
|Should return the user with the given username|getUserByUsername|Unit|WB|
|Should return the user with the given username|getUserByUsername|Unit|WB|
|Should return UnauthorizedUserError|getUserByUsername|Unit|WB|
|Should return UnauthorizedUserError|getUserByUsername|Unit|WB|
|It should return an array of users|getUsersByRole|Unit|WB|
|Should return the user updated|UpdateUser|Unit|WB|
|Should return the user updated | Admin change other NonAdmin|UpdateUser|Unit|WB|
|Should return UserNotFoundError|UpdateUser|Unit|WB|
|Should return BirthDateAfterCurrentDate Error|UpdateUser|Unit|WB|
|Should return UnauthorizedUserError|UpdateUser|Unit|WB|
|Should return UnauthorizedUserError | Admin try to update other Admin|UpdateUser|Unit|WB|
|It should resolve true|Delete All users (Non Admin)|Unit|WB|
|It should reject|Delete All users (Non Admin)|Unit|WB|
|It should resolve true | Customer delete itself|Delete User|Unit|WB|
|It should resolve true | Admin delete NonAdminUser|Delete User|Unit|WB|
|It should reject with UnauthorizedUserError | Admin delete another Admin|Delete User|Unit|WB|
|It should reject with UnauthorizedUserError | NonAdminUser delete another User|Delete User|Unit|WB|
|It should reject with UserNotFoundError|Delete User|Unit|WB|
|Should delete all carts and products in cart|CartDAO deleteAllCarts|Unit|WB|
|should clear the cart if it exists|CartDAO clearCart|Unit|WB|
|should retrieve all carts|CartDAO getCartsAll|Unit|WB|
|should throw an error if retrieval fails|CartDAO getCartsAll|Unit|WB|
|should throw an error if retrieval fails|CartDAO getAllCarts|Unit|WB|
|should checkout the cart if it exists and has products|CartDAO checkoutCart|Unit|WB|
|should throw EmptyCartError if the cart is empty|CartDAO checkoutCart|Unit|WB|
|Should return a cart if it exists|CartDAO getCart|Unit|WB|
|Should return empty cart object if the cart does not exist|CartDAO getCart|Unit|WB|
|should add a product to an existing cart|CartDAO addProductToCart|Unit|WB|
|should create a new cart and add the product if the cart does not exist|CartDAO addProductToCart|Unit|WB|
|should remove one product unit from the cart|CartDAO getAllCarts|Unit|WB|
|should throw CartNotFoundError if the cart does not exist|CartDAO getAllCarts|Unit|WB|
|should throw ProductNotInCartError if the product is not in the cart|CartDAO getAllCarts|Unit|WB|
|resolves true if product is inserted|createProduct|Unit|WB|
|throws ProductAlreadyExistsError if product is already present in DB|createProduct|Unit|WB|
|resolves true if product is updated|updateProduct|Unit|WB|
|throws exception if DB error|updateProduct|Unit|WB|
|resolves true if all products are deleted|deleteAllProducts|Unit|WB|
|resolves an array of Product objects|getProducts|Unit|WB|
|resolves an array of Product objects filtered by category|getProducts|Unit|WB|
|resolves an array of Product objects filtered by model|getProducts|Unit|WB|
|resolves an array of Product objects|getAvailableProducts|Unit|WB|
|resolves an array of Product objects filtered by category|getAvailableProducts|Unit|WB|
|resolves an array of Product objects filtered by model|getAvailableProducts|Unit|WB|
|resolves true if product is deleted|deleteProduct|Unit|WB|
|resolves true if product is sold|sellProduct|Unit|WB|
|resolve a list of reviews if model matches with present models in the db|getAllByModel|Unit|WB|
|should resolve the number of deleted rows|deleteByUser|Unit|WB|
|should resolve the number of deleted rows|deleteAll|Unit|WB|
|resolve true if review is inserted|create review|Unit|WB|
|should resolve the number of deleted rows|deleteAllByModel|Unit|WB|
|It should return an array of users with the userList|getUsers|Unit|WB|
|It should return the user with the specified username|getUserByUsername|Unit|WB|
|It should return UserNotFoundError if the user does not exist|getUserByUsername|Unit|WB|
|It should return an array of users with the specified role|getUsersByRole|Unit|WB|
|It should resolve with a user|updateUser|Unit|WB|
|It should resolve true|Delete All users (Non Admin)|Unit|WB|
|It should reject an error|Delete All users (Non Admin)|Unit|WB|
|It should resolve true|Delete specific user by username|Unit|WB|
|It should reject an error|Delete specific user by username|Unit|WB|
|should return 401 for unauthorized access|CartRoutes DELETE /carts|Unit|WB|
|should clear the current cart|CartRoutes DELETE /carts/current|Unit|WB|
|should return 404 if the cart does not exist|CartRoutes DELETE /carts/current|Unit|WB|
|should return 401 for unauthorized access|CartRoutes DELETE /carts/current|Unit|WB|
|should retrieve all carts|CartRoutes GET /carts|Unit|WB|
|should return 503 if retrieval fails|CartRoutes GET /carts|Unit|WB|
|should return 401 for unauthorized access|CartRoutes GET /carts|Unit|WB|
|should retrieve the history of the logged in customers carts|CartRoutes GET /carts|Unit|WB|
|should return 500 if retrieval fails|CartRoutes GET /carts|Unit|WB|
|should return 401 for unauthorized access|CartRoutes GET /carts|Unit|WB|
|should checkout the cart|CartRoutes PATCH /carts|Unit|WB|
|should return 404 if the cart does not exist|CartRoutes PATCH /carts|Unit|WB|
|should return 400 if the cart is empty|CartRoutes PATCH /carts|Unit|WB|
|should return 401 for unauthorized access|CartRoutes PATCH /carts|Unit|WB|
|should return a cart if it exists|CartRoutes GET /carts|Unit|WB|
|should return any empty cart if the cart does not exist|CartRoutes GET /carts|Unit|WB|
|should return 404 if none of cart does not exist|CartRoutes GET /carts|Unit|WB|
|should return 401 for unauthorized access|CartRoutes GET /carts|Unit|WB|
|should add a product to the cart|CartRoutes POST /carts|Unit|WB|
|should return 422 if product model is not provided|CartRoutes POST /carts|Unit|WB|
|should return 401 for unauthorized access|CartRoutes POST /carts|Unit|WB|
|should remove one product unit from the cart|CartRoutes POST /carts|Unit|WB|
|should return 404 if the cart does not exist|CartRoutes POST /carts|Unit|WB|
|should return 404 if the product is not in the cart|CartRoutes POST /carts|Unit|WB|
|should return 500 if removal fails|CartRoutes POST /carts|Unit|WB|
|should return 401 for unauthorized access|CartRoutes POST /carts|Unit|WB|
|should return a 200 success code|POST /ezelectronics/products|Unit|WB|
|should return a 200 success code with null arrivalDate|POST /ezelectronics/products|Unit|WB|
|should return a 401 response code if user is not a manager|POST /ezelectronics/products|Unit|WB|
|should return a 409 response code if the product already exists|POST /ezelectronics/products|Unit|WB|
|should return a 422 response code if the arrivalDate is after today|POST /ezelectronics/products|Unit|WB|
|should return a 401 status code|DELETE /products|Unit|WB|
|should return a 200 success code|DELETE /products|Unit|WB|
|should return a 200 success code with changeDate|PATCH /ezelectronics/products/:model|Unit|WB|
|should return a 200 success code without changeDate|PATCH /ezelectronics/products/:model|Unit|WB|
|should return a 404 response code if the product does not exist|PATCH /ezelectronics/products/:model|Unit|WB|
|should return a 401 status code if not admin nor manager|GET /ezelectronics/products|Unit|WB|
|should return a 200 success code|GET /ezelectronics/products|Unit|WB|
|should return a 200 success code with a category filter|GET /ezelectronics/products|Unit|WB|
|should return a 200 success code with a model filter|GET /ezelectronics/products|Unit|WB|
|should return a 404 response code if ProductNotFoundError is thrown|GET /ezelectronics/products|Unit|WB|
|should return a 401 status code if not logged in|GET /ezelectronics/products/available|Unit|WB|
|should return a 200 success code|GET /ezelectronics/products/available|Unit|WB|
|should return a 200 success code with a category filter|GET /ezelectronics/products/available|Unit|WB|
|should return a 200 success code with a model filter|GET /ezelectronics/products/available|Unit|WB|
|should return a 404 response code if ProductNotFoundError is thrown|GET /ezelectronics/products/available|Unit|WB|
|should return a 200 success code|DELETE /ezelectronics/products/:model|Unit|WB|
|should return a 401 response code if user is not a manager nor an admin|DELETE /ezelectronics/products/:model|Unit|WB|
|should return a 404 response code if the product does not exist|DELETE /ezelectronics/products/:model|Unit|WB|
|should return a 200 success code|PATCH /ezelectronics/products/:model/sell|Unit|WB|
|should return a 200 success code with empty sellingDate|PATCH /ezelectronics/products/:model/sell|Unit|WB|
|should return a 401 response code if user is not a manager|PATCH /ezelectronics/products/:model/sell|Unit|WB|
|should return a 401 response code if user is not authenticated|GET /ezelectronics/reviews/:model|Unit|WB|
|should return 200 success code|GET /ezelectronics/reviews/:model|Unit|WB|
|should return a 404 error code if if model does not exists|GET /ezelectronics/reviews/:model|Unit|WB|
|should return a 401 response code if user is not customer|DELETE ezelectronics/reviews/:model|Unit|WB|
|should return 200 success code|DELETE ezelectronics/reviews/:model|Unit|WB|
|should return 404 error code if model does not exists|DELETE ezelectronics/reviews/:model|Unit|WB|
|should return 404 error code if the current user does not have a review for the product identified by model|DELETE ezelectronics/reviews/:model|Unit|WB|
|should return a 401 response code if user is not a manage nor an admin|DELETE ezelectronics/reviews|Unit|WB|
|should return 200 success code|DELETE ezelectronics/reviews|Unit|WB|
|should return a 401 response code if user is not a customer|POST /ezelectronics/:model|Unit|WB|
|A validation error should occur|POST /ezelectronics/:model|Unit|WB|
|should return 200 success code|POST /ezelectronics/:model|Unit|WB|
|should return a 404 error if model does not exists|POST /ezelectronics/:model|Unit|WB|
|should return a 409 error if there is an existing review for the product made by the customer|POST /ezelectronics/:model|Unit|WB|
|should return a 401 response code if user is not a manage nor an admin|DELETE ezelectronics/reviews/:model/all|Unit|WB|
|should return 200 success code|DELETE ezelectronics/reviews/:model/all|Unit|WB|
|should return 404 error code if model does not exist|DELETE ezelectronics/reviews/:model/all|Unit|WB|
|should return a 401 response code if user is not Admin|GET /ezelectronics/users|Unit|WB|
|should return a 200 success code|GET /ezelectronics/users|Unit|WB|
|A validation error should occur|POST /sessions|Unit|WB|
|Unauthenticated user|DELETE /sessions/current|Unit|WB|
|Unauthenticated user|GET /sessions/current|Unit|WB|
|should return a 200 success code|GET /ezelectronics/users/:username|Unit|WB|
|should return a 401 unauthorized code if not LoggedIn|GET /ezelectronics/users/:username|Unit|WB|
|should return a 404 if user does not exist|GET /ezelectronics/users/:username|Unit|WB|
|should return a 401 response code if user is not Admin|GET /ezelectronics/users/roles/:role|Unit|WB|
|should return a 200 success code|GET /ezelectronics/users/roles/:role|Unit|WB|
|should return a 422 response code if the role is not valid|GET /ezelectronics/users/roles/:role|Unit|WB|
|should return a 401 unauthorized code if not LoggedIn|PATCH /ezelectronics/users/:username|Unit|WB|
|It should return a 200 success code|DELETE /ezelectronics/users|Unit|WB|
|It should return a 401 unauthorized code|DELETE /ezelectronics/users|Unit|WB|
|should return a 200 success code|DELETE /ezelectronics/users/:username|Unit|WB|
|should return a 401 unauthorized code|DELETE /ezelectronics/users/:username|Unit|WB|
|It should return an empty cart for a new customer|GET /carts|Integration|BB|
|It should add a product to the cart|POST /carts|Integration|BB|
|It should return a 404 error if model does not represent an existing product|POST /carts|Integration|BB|
|It should return a 409 error if model represents a product whose available quantity is 0|POST /carts|Integration|BB|
|Should simulate payment for the cart|PATCH /ezelectronics/carts|Integration|BB|
|It should return a 404 error if there is no information about an unpaid cart in the database|PATCH /ezelectronics/carts|Integration|BB|
|It should return a 400 error if there is an unpaid cart but the cart contains no product|PATCH /ezelectronics/carts|Integration|BB|
|It should return a 409 error if there is at least one product in the cart whose available quantity in the stock is 0|PATCH /ezelectronics/carts|Integration|BB|
|It should return a 409 error if there is at least one product in the cart whose quantity is higher than the available quantity in the stock|PATCH /ezelectronics/carts|Integration|BB|
|It should return the history of past orders|GET /carts/history|Integration|BB|
|It should remove a product from the cart|DELETE /carts/products/:model|Integration|BB|
|It should return a 404 error if the product is not in the cart|DELETE /carts/products/:model|Integration|BB|
|It should empty the current cart|DELETE /carts/current|Integration|BB|
|It should return a 404 error if there is no information about an unpaid cart for the user|DELETE /carts/current|Integration|BB|
|It should delete all existing carts of all users|DELETE /carts|Integration|BB|
|It should return a 401 error if the user is not Admin or Manager|DELETE /carts|Integration|BB|
|It should return a 401 error if the user is not Admin or Manager|GET /carts/all|Integration|BB|
|It should return all carts of all users|GET /carts/all|Integration|BB|
|It should return a 401 status code|POST /ezelectronics/products|Integration|BB|
|It should return a 200 status code|POST /ezelectronics/products|Integration|BB|
|It should return a 200 status code with empty arrivalDate|POST /ezelectronics/products|Integration|BB|
|It should return a 409 status code|POST /ezelectronics/products|Integration|BB|
|It should return a 401 status code|PATCH /ezelectronics/products/:model|Integration|BB|
|It should return a 200 status code|PATCH /ezelectronics/products/:model|Integration|BB|
|It should return a 200 status code with empty changeDate|PATCH /ezelectronics/products/:model|Integration|BB|
|It should return a 400 status code if changeDate is after today|PATCH /ezelectronics/products/:model|Integration|BB|
|It should return a 400 status code if changeDate is before arrivalDate|PATCH /ezelectronics/products/:model|Integration|BB|
|It should return a 401 status code|PATCH /ezelectronics/products/:model/sell|Integration|BB|
|It should return a 200 status code|PATCH /ezelectronics/products/:model/sell|Integration|BB|
|It should return a 200 status code with empty sellingDate|PATCH /ezelectronics/products/:model/sell|Integration|BB|
|It should return a 404 status code|PATCH /ezelectronics/products/:model/sell|Integration|BB|
|It should return a 409 status code|PATCH /ezelectronics/products/:model/sell|Integration|BB|
|It should return a 400 status code|PATCH /ezelectronics/products/:model/sell|Integration|BB|
|It should return a 401 status code|GET /ezelectronics/products|Integration|BB|
|It should return a 200 status code|GET /ezelectronics/products|Integration|BB|
|It should return a 200 status code with model filter|GET /ezelectronics/products|Integration|BB|
|It should return a 200 status code with category filter|GET /ezelectronics/products|Integration|BB|
|It should return a 401 status code|GET /ezelectronics/products/available|Integration|BB|
|It should return a 200 status code|GET /ezelectronics/products/available|Integration|BB|
|It should return a 200 status code with model filter|GET /ezelectronics/products/available|Integration|BB|
|It should return a 200 status code with category filter|GET /ezelectronics/products/available|Integration|BB|
|It should return a 401 status code|DELETE /ezelectronics/products/:model|Integration|BB|
|It should return a 200 status code|DELETE /ezelectronics/products/:model|Integration|BB|
|It should return a 404 status code|DELETE /ezelectronics/products/:model|Integration|BB|
|It should return a 200 success code and add a new review|POST /reviews/:model|Integration|BB|
|It should return a 404 error code if model does not represent an existing product in the database|POST /reviews/:model|Integration|BB|
|It should return a 409 error code if there is an existing review for the product made by the customer|POST /reviews/:model|Integration|BB|
|It should return a 422 error code if at least one request body parameter is empty/incorrect|POST /reviews/:model|Integration|BB|
|It should return a 200 success code|GET /reviews/:model|Integration|BB|
|It should return a 404 error code if model does not represent an existing product in the database|GET /reviews/:model|Integration|BB|
|It should return a 401 error code if the user is unauthenticated|GET /reviews/:model|Integration|BB|
|It should return a 200 success code|DELETE /reviews/:model|Integration|BB|
|It should return a 404 error code if model does not represent an existing product in the database|DELETE /reviews/:model|Integration|BB|
|It should return a 404 error code if the current user does not have a review for the product identified by model|DELETE /reviews/:model|Integration|BB|
|It should return a 401 error code if the user is unauthenticated|DELETE /reviews/:model|Integration|BB|
|It should return a 401 error code if the current user is not authorized|DELETE /reviews/:model|Integration|BB|
|It should return a 200 success code|DELETE /reviews/:model/all|Integration|BB|
|It should return a 404 error code if model does not represent an existing product in the database|DELETE /reviews/:model/all|Integration|BB|
|It should return a 401 error code if the current user is not authorized|DELETE /reviews/:model/all|Integration|BB|
|It should return a 200 success code|DELETE /reviews|Integration|BB|
|It should return a 401 error code if the current user is not authorized|DELETE /reviews|Integration|BB|
|It should return a 200 status code|POST /ezelectronics/sessions|Integration|BB|
|It should return a 401 status code if the username does not exist|POST /ezelectronics/sessions|Integration|BB|
|It should return a 401 status code if the password provided does not match the one in the database|POST /ezelectronics/sessions|Integration|BB|
|It should return a 200 status code|DELETE /ezelectronics/sessions/current|Integration|BB|
|It should return a 200 status code|GET /ezelectronics/sessions/current|Integration|BB|
|POST /users|POST /users|Integration|BB|
|POST /users - User already exists|POST /users|Integration|BB|
|GET /users|GET /users|Integration|BB|
|GET /users - Not Admin|GET /users|Integration|BB|
|GET /users/:username|GET /users/:username|Integration|BB|
|GET /users/:username - Not Admin|GET /users/:username|Integration|BB|
|DEL /users/:username - Not Authorized|DEL /users/:username|Integration|BB|
|DEL /users/:username - User does not exist|DEL /users/:username|Integration|BB|
|DEL /users/:username|DEL /users/:username|Integration|BB|
|DEL /users - Not Admin|DEL /users|Integration|BB|
|DEL /users|DEL /users|Integration|BB|
|PATCH /users/:username - Empty body|PATCH /users/:username|Integration|BB|
|PATCH /users/:username|PATCH /users/:username|Integration|BB|
|PATCH /users/:username - Not Authorized|PATCH /users/:username|Integration|BB|

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
