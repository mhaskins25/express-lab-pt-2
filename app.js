const express = require('express');
const cart = require('./cart-items');
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use('/cart-items', cart);
app.listen(port, () => console.log(`Listening on port: ${port}.`));