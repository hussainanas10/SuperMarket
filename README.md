
# Gambo Supermarket
E-commerce website
## Screenshots
![image](https://user-images.githubusercontent.com/60548718/98374384-972d1800-2066-11eb-84c8-497446156752.png)

![image](https://user-images.githubusercontent.com/60548718/98374742-21757c00-2067-11eb-9b6b-f014994f127c.png)

- cart and payment section:
![image](https://user-images.githubusercontent.com/60548718/98374855-4c5fd000-2067-11eb-8606-88d3cbfbf3ba.png)

- admin section
![image](https://user-images.githubusercontent.com/60548718/98374951-71ecd980-2067-11eb-93f0-721183dd4f96.png)


## Topics Covered
- NodeJS
- Shopping Cart
- Ejs
- Bootstrap
- MongoDb
- ExpressJS
- Passport Auth
- API testing using postman
- payment gateway
## Development and Installation
### Install Backend Dependencies

 - `npm install`


### Setup up dev_keys for database
- Either run local MongoServer or,
- Setup Mongo Server at online platform like mlab and Create a db.js file in models folder and set up:-

```module.exports = {
  mongoURI: YOUR_LOCAL_MONGO_SERVER_URI,
	secretOrKey: YOUR_SECRET
}; 
```
### Run the application
- `npm start`

## Note
- You can set up the database on your local server  and create multiple ids to access that data. 
