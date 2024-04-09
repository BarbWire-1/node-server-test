// handle data
const products = require("../data/products.json");
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

module.exports = { findById, findAll, create, update };
