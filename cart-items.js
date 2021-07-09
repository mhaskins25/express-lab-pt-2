const express = require("express");
const pool = require("./pg-connection-pool");
const cart = express.Router();

async function getTable(req, res){
    const results = await pool.query('select * from shopping_cart;')
    res.json(results.rows);
  }

cart.get("/cart-items", (req, res)=>{
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
    getTable(req, res);
    
});

//Chris' extended challenge (lines 36-40)
cart.get("/cart-items-total", async (req, res)=>{
    let subTotal = await pool.query("SELECT product, SUM(price * quantity) FROM shopping_cart GROUP BY product");
    let grandTotal = await pool.query("SELECT SUM(price * quantity) FROM shopping_cart");
    res.json({"Sub Totals": subTotal.rows, "Grand Total": grandTotal.rows});   
});
//End of extended challenge code

cart.get("/cart-items/:id", async (req, res) =>{
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

cart.post("/cart-items", async (req, res) =>{
    const {product, price, quantity} = req.body;
    await pool.query('INSERT INTO shopping_cart(product, price, quantity) VALUES($1, $2, $3)', [product, price, quantity])
    let newItem = await pool.query('SELECT * FROM shopping_cart WHERE product=$1 ORDER BY id DESC LIMIT 1', [product])
    res.status(201).json(newItem.rows);
});

cart.put("/cart-items/:id", async (req, res) =>{
    let updatedCart = req.body;
    await pool.query('UPDATE shopping_cart SET "product"=$1, "price"=$2, "quantity"=$3 WHERE id=$4', [req.body.product, req.body.price, req.body.quantity, req.params.id])
    let newProduct = await pool.query('SELECT * FROM shopping_cart WHERE id=$1', [req.params.id])
    res.json(newProduct.rows)
});
  
cart.delete("/cart-items/:id", async (req, res) => {
    let id = req.params.id;
    let remove = await pool.query('DELETE FROM shopping_cart WHERE id=$1', [id]);
    res.status(204).json(remove);
});

  module.exports = cart;
