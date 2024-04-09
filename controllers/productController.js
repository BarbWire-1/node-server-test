
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
    if (req.url.includes('?')) {
      const queryParams = req.url.split('?')[1];
      const params = new URLSearchParams(queryParams);
        const queryObj = {};
        console.log(params,queryObj)
      for (const [key, value] of params.entries()) {
        queryObj[key] = value;
      }
      const filteredProducts = await Product.findByQueryUrl(queryObj);
      resHead(res, 200);
      resEnd(res, filteredProducts);
    } else {
      const products = await Product.findAll();
      resHead(res, 200);
      resEnd(res, products);
    }
  } catch (error) {
    console.log(error);
  }
}
// @desc    Gets product by id (number)
// @route   GET /api/products/id
async function getProduct(req, res, id) {
  try {
    const product = await Product.findById(id);
console.log(product)
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
            const { name, description, price } = JSON.parse(body);
            const productData = {
                name: name || product.name,
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

// @desc    Remove a product
// @route   DELETE /api/products/id
async function removeProduct(req, res, id) {
  try {
    const product = await Product.findById(id);

    if (!product) {
      resHead(res, 404);
      resEnd(res, { message: "Product Not Found" });
    } else {
        await Product.remove(id)
      resHead(res, 200);

      resEnd(res, {message: `Product ${id} has been removed`});
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getProduct, getProducts, createProduct, updateProduct, removeProduct };
