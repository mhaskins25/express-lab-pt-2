const express = require("express");
const pool = require("./pg-connection-pool");
const cart = express.Router();

async function getTable(req, res){
    
  }

cart.get("/", (req, res) => {
    let cart = req.query["cartItems"]
    console.log("");
    let maxPrice = req.query.maxPrice;
    let returnCart = cartItems;
    if (maxPrice){
      returnCart = cartItems.filter((item)=> item.price <= maxPrice)
    }
    let prefix = req.query.prefix;
    if(prefix){
      returnCart = returnCart.filter((item)=> item.product.startsWith(prefix))
    }
    let pageSize = req.query.pageSize;
    if(pageSize){
      returnCart = returnCart.slice(0, pageSize);
    }

    res.json(returnCart);
  });

  cart.get("/:id", (req, res) => {
    let id = req.params.id;
    console.log("Getting ", id);
    let found = cartItems.find((item) => {
        return item.id == id
    })
    if(found){

    }else{
      return res.status(404).send('ID Not Found');
    }
    res.json(found);
  });

  cart.post("/", (req, res) => {
      let test = req.body.test
      console.log("Test results:", test )
      let x = cartItems.length + 1;
      let newItem = req.body;
      newItem.id = x;
      cartItems.push(newItem);
      res.status(201).json(cartItems);
      res.json("Adding new item..");
  });
  

  cart.put("/:id", (req, res) => {
    let id = req.params.id;
    let updatedCart = req.body;
    let found = cartItems.findIndex((item) => item.id == id);
    if(found){
      cartItems[found] = {...cartItems[found], ...updatedCart};
      res.json(cartItems[found]);
    }else{
      res.json("No item updates");

    }

  });

  cart.delete("/:id", (req, res) => {
      //logic to delete a student
      let id = req.params.id;
      let index = cartItems.findIndex(item => item.id == id);
      cartItems.splice(index, 1);
      console.log(cartItems)
      res.status(204).json(cartItems);
  });

  module.exports = cart;
