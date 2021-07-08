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

cart.post("/", async (req, res) =>{
    let results = await pool.query('INSERT INTO shopping_cart ("product", "price", "quantity") VALUES ($1, $2, $3)', [req.body.product, req.body.price, req.body.quantity])
    res.status(201).json(results.rows);
});

cart.put("/:id", async (req, res) =>{
    let updatedCart = req.body;
    let results = await pool.query('UPDATE shopping_cart SET "product"=$1 WHERE id=$2', [req.body.product, req.params.id])
    res.json(results.rows[0])
});
  
cart.delete("/:id", (req, res) => {
    pool.query("DELETE FROM shopping_cart WHERE id=$1", [req.params.id]).then(results => {
        res.status(204).json(results);
    })
});

  module.exports = cart;
