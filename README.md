Gambo Supermarket
E-commerce website

Topics Covered
MEN Stack
Shopping Cart
Bootstrap
Reactstrap
Redux
JWT Authentication
API testing using Jest
Development and Installation
Install Backend Dependencies
npm install
Install Frontend Dependencies
npm run client-install
Setup up dev_keys for database
Either run local MongoServer or,
Setup Mongo Server at online platform like mlab and Create a keys_dev.js file in config folder and set up:-
module.exports = {
  mongoURI: YOUR_LOCAL_MONGO_SERVER_URI,
	secretOrKey: YOUR_SECRET
}; 
Run the application
npm run dev
For testing
npm run test
Find API Documentation here.
