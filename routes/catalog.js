const express = require('express');
const router = express.Router();
const Product = require('../models/product')

router.get('/list', (req, res) => {
  Product.find(function(err, products){
    if(err){
      res.send(err);
    }
    res.json(products);
  })
})

router.get('/:name', (req,res) => {
  const query = {'name': req.params.name};
  Product.find(query, (err, item) =>  {
    if(err){
      res.send(err);
    }
    res.json(item);
  })
})

module.exports = router;
