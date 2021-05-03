const express = require("express");
const cartItems = express.Router();

//Products storage varaible
const items = [
  {
    id: 0,
    product: "Coffee",
    price: 5,
    quantity: 2,
  },
  {
    id: 1,
    product: "Soda",
    price: 2.5,
    quantity: 3,
  },
  {
    id: 2,
    product: "Beans",
    price: 1,
    quantity: 1,
  },
  {
    id: 3,
    product: "Pizza",
    price: 8,
    quantity: 2,
  },
];

cartItems.use(express.json());

// Get products
// Accepts Query Params: maxPrice, prefix, pageSize
// Returns all products and filters if params are provided
cartItems.get("/cart-items", (req, res) => {
  let maxPrice = req.query.maxPrice;
  let prefix = req.query.prefix;
  let pageSize = req.query.pageSize;
  let responseArray = items;

  if (maxPrice) {
    responseArray = responseArray.filter(
      (product) => product.price <= maxPrice
    );
  }

  if (prefix) {
    responseArray = responseArray.filter((product) =>
      product.product.toLowerCase().includes(prefix.toLowerCase())
    );
  }

  if (pageSize && responseArray.length > pageSize) {

    responseArray = responseArray.splice(
      0,
     pageSize
    );
  }
  res.status(200);
  res.json(responseArray);
});

// Get product by id
// Accepts routing param id
// Returns product that matchs id
cartItems.get("/cart-items/:id", (req, res) => {
  let requestParam = req.params;
  let responseArray = items;

  console.log(requestParam.id);
  responseArray = responseArray.filter(
    (product) => product.id == requestParam.id
  );
  if (responseArray.length > 0) {
    res.status(200);
    res.json(responseArray[0]);
  } else {
    res.status(404);
    res.json("Product not found");
  }
});

// Posts new product
// Accepts body params: product, price, quantity
// Returns new product created
cartItems.post("/cart-items", (req, res) => {
  let reqBody = req.body;
  if (reqBody.product && reqBody.price && reqBody.quantity) {
    let newId = generateUID();
    let newItem = {
      id: Number(newId),
      product: reqBody.product,
      price: reqBody.price,
      quantity: reqBody.quantity,
    };
    items.push(newItem);
    res.status(201);
    res.json(newItem);
  } else {
    res.status(400);
    res.json("Incorrect product data provided");
  }
});

// Replaces product by id
// Accepts routing param id
// Accepts body params: product, price, quantity
// Returns updated product that matchs id
cartItems.put("/cart-items/:id", (req, res) => {
    let itemId = req.params.id;
    let reqBody = req.body;

    //Check if product id exists
    let itemIndex = items.findIndex((product) => product.id == itemId);
    console.log(itemIndex);
    if(itemIndex !== -1){
        //Found item
        //Check body data
        if (reqBody.product && reqBody.price && reqBody.quantity) {
            //Request has data create updated object
            let newItem = {
              id: Number(itemId),
              product: reqBody.product,
              price: reqBody.price,
              quantity: reqBody.quantity,
            };

            items[itemIndex] = newItem;
            res.status(200);
            res.json(newItem);

          } else {
            //Item data not found in request
            res.status(400);
            res.json("Incorrect product data provided");
          }

    } else {
        //Product with id doesn't exist
        res.status(400);
        res.json("Product with ID not found");
    }
    
    
});

//removes product by id
//accepts routing param id
//returns empty repsonse

cartItems.delete("/cart-items/:id", (req, res)=>{
    let itemId = req.params.id;
    let itemIndex = items.findIndex((product) => product.id == itemId);
    if(itemIndex !== -1){
        items.splice(itemIndex, 1);
    }
    res.status(204);
    res.json()
})

function generateUID(){
    let id = Math.random().toString().slice(2,11);
    if(items.findIndex(product => product.id == id) === -1){
        return id;
    } else {
        return generateUID();
    }
}

module.exports = cartItems;