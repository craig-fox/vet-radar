const express = require('express');
const router = express.Router();
const CartItem = require('../models/cart')
const fetch = require('node-fetch');

const twoDecimals = (amount) => {
    return parseFloat(Math.round(amount * 100) / 100).toFixed(2);
}

/*View cart items*/
router.get('/items', function(req, res) {
    CartItem.find((err, items) => {
        if(err){
            res.send(err);
        } else if (items.length > 0){
            res.json(items);
        } else {
            res.send({"messaage":"No items in cart"})
        }
    })
});

/*Get cart item by name*/
router.get('/items/:name', function(req, res) {
    const query = {'name': req.params.name};
    CartItem.find(query, (err, items) => {
        if(err){
            res.send(err);
        } else if(items.length > 0){
            res.json(items[0]);
        } else {
            res.send({"message":"This item is not in the cart"})
        }
    })
});

/*Get total cart price*/
router.get('/total', function(req, res) {
    CartItem.find((err, items) => {
        if(err){
            res.send(err);
        } else if (items.length > 0){
            let priceTotal = 0.0;
            for(let i=0; i < items.length; i++){
                const item = items[i]
                const itemPrice = item.total;
                priceTotal = priceTotal + itemPrice;
            }
            priceTotal = twoDecimals(priceTotal);
            res.json({"total": priceTotal})
        } else {
            res.send({"message":"No items in cart"})
        }
    })
});

/*Add item to cart*/
router.post('/add', (req,res)=> {
    const itemName = req.body.name;
    const itemQuantity = req.body.quantity;
    let url = `http://localhost:8080/catalog/${itemName}`;
    let message = "Added item to cart";

    fetch(url)
        .then(response=> {
            return response.json();
        })
        .then(json => {
            console.log("JSON", json);
            if (json.length > 0) {
                const price = json[0].price;
                const name = json[0].name;
                let quantity = parseInt(itemQuantity, 10);

                CartItem.countDocuments({name}, (err, count) => {
                    if(count > 0){
                        const existingItemUrl = `http://localhost:8080/cart/items/${name}`;
                        fetch(existingItemUrl)
                            .then(response => {
                                return response.json()
                            })
                            .then(json => {
                                console.log("Spray", json)
                                const existingItemQuantity = parseInt(json.quantity, 10);
                                message = `Quantity for ${name} updated by ${quantity}`;
                                quantity = quantity + existingItemQuantity;
                                const query = {'name': name} ;
                                CartItem.findOneAndUpdate(query, { quantity, total: quantity * price }, err => {
                                    console.log("Exists in cart");
                                    if(err) {
                                        res.send(err)}
                                    else {
                                        res.json({"message":message});
                                    }
                                })
                            })
                            .catch(err => {
                                res.send(err);
                            })
                    } else {
                        let total = price * quantity;
                        let item = new CartItem()

                        item.set({"name":name, "price":twoDecimals(price), "quantity": quantity, "total": twoDecimals(total)});
                        console.log("Item", item);
                        item.save(err=>{
                            if(err) {
                                res.send(err)
                            } else {
                                res.json({"message":message});
                            }
                        })
                    }
                })

            } else {
                message = "Item not found in catalog";
                res.json({"message": message});
            }
        })
        .catch(err => {
            res.send(err);
        })
})

/*Remove item from cart*/
router.post('/remove', function(req,res){
    let name = req.body.name;
    CartItem.remove({ name: name }, err => {
        const message = `Removed product ${name}`;
        res.json({"message":message});
    });
})

module.exports = router;