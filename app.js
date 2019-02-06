const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const db = require('./config/db')
mongoose.connect(db.url, {useNewUrlParser:true})
console.log("Connected to database vet-tools")
const catalogRouter = require('./routes/catalog');
const cartRouter = require('./routes/cart');
const app = express();

const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/catalog', catalogRouter);
app.use('/cart', cartRouter);

app.listen(port);
console.log("Listening on port", port)

module.exports = app;
