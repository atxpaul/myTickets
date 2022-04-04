# myTickets

Final Project for coderhouse about an ecommerce of ticket selling.

This is my final project for Coderhouse Backend Program.

The goal of this app is provide an APIRestful for selling tickets for events like live shows and football games.

## Starting server:

The way to start server as pure node is with the following examples:

Starting with npm script

```sh
npm start
```


## Testing requeriments

First you need a .env file like this:

```
ADMIN_MAIL = user@user.com
MONGO_URL = 'mongodb+srv://localhost/ecommerce?retryWrites=true&w=majority'
SESSION_SECRET = 'secret'
JWT_SECRET = 'secret'

```

In case you need to run the server in production, you will need this environment variables:

```
GMAIL_USER=yourmail@gmail.com
GMAIL_PASSWORD=yourpasswordforautomaticauthentication
```