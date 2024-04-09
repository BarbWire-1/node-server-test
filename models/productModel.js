// handle data
let products = require("../data/products.json");
const { v4 } = require("uuid");
const { writeDataToFile } = require("../utils.js");

console.log(v4);

function findAll() {
  return new Promise((resolve, reject) => {
    resolve(products);
  });
}

function findById(id) {


  return new Promise((resolve, reject) => {
      const product = products.find((p) => p.id === id);

    resolve(product);
  });
}

function create(product) {
  return new Promise((resolve, reject) => {
    const newProduct = { id: v4(), ...product };
    products.push(newProduct);

    writeDataToFile("./data/products.json", products);
    resolve(newProduct);
  });
}

function update(id, productData) {
  return new Promise((resolve, reject) => {
    const index = products.findIndex((p) => p.id === id);
    products[index] = { id, ...productData };

    writeDataToFile("./data/products.json", products);

    resolve(products[index]);
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    products = products.filter(p => p.id !== id)

    writeDataToFile("./data/products.json", products);

    resolve();
  });
}


function findByQueryUrl(queryParams) {
    return new Promise((resolve, reject) => {
      console.log(queryParams)// logs correct for price, but doesn't resolve
    // Filter products based on query parameters
    const filteredProducts = products.filter(product => {
      for (const key in queryParams) {
        if (product[key].toString() !== queryParams[key]) {
          return false;
        }
      }
      return true;
    });
    resolve(filteredProducts);
  });
}

module.exports = { findById, findAll, findByQueryUrl, create, update, remove };
