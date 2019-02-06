const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    name: String,
    price: Number,
    quantity: Number,
    total: Number
})

module.exports = mongoose.model('CartItem', CartItemSchema)