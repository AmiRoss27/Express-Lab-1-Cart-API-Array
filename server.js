const express = require("express");
const cartItems = require('./cartItems');

const app = express();
const port = 3000;

app.use('/', cartItems);

app.listen(port, () => console.log(`Listening on port: ${port}.`));

