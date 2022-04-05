# myTickets

Final Project for coderhouse about an ecommerce of ticket selling.

This is my final project for Coderhouse Backend Program.

The goal of this app is provide an APIRestful for selling tickets for events like live shows and football games.


## Live API deployed

This API is already deployed on Heroku.

[myTickets](https://mytickets-api.herokuapp.com)

## API Documentation

The API is documented using Swagger.

[Documentation](https://mytickets-api.herokuapp.com/api-docs)

## Starting server:

The way to start server as pure node is with the following examples:

Starting with npm script

```sh
npm start
```


## Testing requeriments

First you need a .env.test file like this:

```
ADMIN_MAIL = user@user.com
MONGO_URL = 'mongodb+srv://localhost/ecommerce?retryWrites=true&w=majority'
SESSION_SECRET = 'secret'
JWT_SECRET = 'secret'
JWT_TIME = '1h'
```
    
Then you need to install the dependencies:
    

    npm install


And finally you can run the tests:
    

    npm test



In case you need to run the server in production, you will need this environment variables:

```
ADMIN_MAIL = user@user.com
MONGO_URL = 'mongodb+srv://localhost/ecommerce?retryWrites=true&w=majority'
SESSION_SECRET = 'secret'
JWT_SECRET = 'secret'
JWT_TIME = '1h'
GMAIL_USER=yourmail@gmail.com
GMAIL_PASSWORD=yourpasswordforautomaticauthentication
```
