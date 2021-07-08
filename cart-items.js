const express = require("express");
const pool = require("./pg-connection-pool");
const cart = express.Router();

async function getTable(req, res){
    const results = await pool.query('select * from shopping_cart;')
    res.json(results.rows);
  }

cart.get("/", (req, res)=>{
    // getTable(req, res);
    let maxPrice = req.query.maxPrice;
    if(maxPrice){
        pool.query("select * from shopping_cart where price<=$1", [maxPrice]).then(result =>{
            res.json(result.rows);
        })
    }

    let prefix = req.query.prefix;
    if(prefix){
        pool.query("select * from shopping_cart where product ilike $1", [prefix + "%"]).then(result =>{
            res.json(result.rows);
        })
    }

    let pageSize = req.query.pageSize;
    if(pageSize){
        pool.query("select * from shopping_cart limit $1", [pageSize]).then(result =>{
            res.json(result.rows);
        })
    }
    
});

cart.get("/:id", async (req, res) =>{
    let id = req.params.id;
    try{
        let result = await pool.query("SELECT * FROM shopping_cart WHERE id=$1", [id]);
        if(result.rows.length == 0){
            res.status(404).json('ID Not Found');
        }else{
            res.json(result.rows);
        }
    }catch (error){
        res.status(404).json('ID Not Found');
    }
});

cart.post("/", (req, res) =>{

});

//   cart.post("/", (req, res) => {
//       let test = req.body.test
//       console.log("Test results:", test )
//       let x = cartItems.length + 1;
//       let newItem = req.body;
//       newItem.id = x;
//       cartItems.push(newItem);
//       res.status(201).json(cartItems);
//       res.json("Adding new item..");
//   });

cart.put("/:id", (req, res) =>{

});
  

//   cart.put("/:id", (req, res) => {
//     let id = req.params.id;
//     let updatedCart = req.body;
//     let found = cartItems.findIndex((item) => item.id == id);
//     if(found){
//       cartItems[found] = {...cartItems[found], ...updatedCart};
//       res.json(cartItems[found]);
//     }else{
//       res.json("No item updates");
//     }
//   });

cart.delete("/:id", (req, res) => {
    pool.query("DELETE FROM shopping_cart WHERE id=$1", [req.params.id].then(() => {
        res.sendStatus(204)
    }))
});

//   cart.delete("/:id", (req, res) => {
//       //logic to delete a student
//       let id = req.params.id;
//       let index = cartItems.findIndex(item => item.id == id);
//       cartItems.splice(index, 1);
//       console.log(cartItems)
//       res.status(204).json(cartItems);
//   });

  module.exports = cart;
