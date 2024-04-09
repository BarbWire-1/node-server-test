
// controls the dataFLOW
const Product = require("../models/productModel");
const { getPostData } = require("../utils");
const contentType = { "Content-Type": "application/json" };

const resHead = (res, status) => res.writeHead(status, contentType);
const resEnd = (res, data) => res.end(JSON.stringify(data));

// @desc    Gets All products
// @route   GET /api/products
async function getProducts(req, res) {
  try {
    const products = await Product.findAll();
    resHead(res, 200);
    resEnd(res, products);
  } catch (error) {
    console.log(error);
  }
}
// @desc    Gets product by id (number)
// @route   GET /api/products/id
async function getProduct(req, res, id) {
  try {
    const product = await Product.findById(id);

    if (!product) {
      resHead(res, 404);
      resEnd(res, { message: "Product Not Found" });
    } else {
      resHead(res, 200);

      resEnd(res, product);
    }
  } catch (error) {
    console.log(error);
  }
}

// @desc    Create new product
// @route   POST /api/products
async function createProduct(req, res) {
  try {
    let body = await getPostData(req);
    const { title, description, price } = JSON.parse(body);
    const product = {
      title,
      description,
      price,
    };

    const newProduct = await Product.create(product);
    resHead(res, 201);
    return resEnd(res, newProduct);
  } catch (error) {
    console.log(error);
  }
}

// @desc    Update a product
// @route   PUT /api/products/id
async function updateProduct(req, res, id) {
    try {
        const product = await Product.findById(id)
        if (!product) {
            resHead(res, 404);
            resEnd(res, { message: "Product Not Found" });
        } else {
            let body = await getPostData(req);
            const { title, description, price } = JSON.parse(body);
            const productData = {
                title: title || product.title,
                description: description || product.description,
                price: price || product.price,
            };

            const updProduct = await Product.update(id,productData);
            resHead(res, 200);
            return resEnd(res, updProduct);
        }
    } catch (error) {
    console.log(error);
  }
}

module.exports = { getProduct, getProducts, createProduct, updateProduct };

