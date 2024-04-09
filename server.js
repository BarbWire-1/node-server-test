// https://www.youtube.com/watch?v=_1xa8Bsho6A
// https://github.com/bradtraversy/vanilla-node-rest-api



const http = require("http");
const {getProduct, getProducts, createProduct, updateProduct} = require('./controllers/productController');


const server = http.createServer((req, res) => {

    const productsUrl = req.url === "/api/products";
    const prodIDUrl = req.url.match(/\/api\/products\/([0-9]+)/)

  //console.log(req.url)
    if (productsUrl && req.method == "GET") {
        getProducts(req, res)

    } else if (prodIDUrl && req.method === "GET") {

        const id = req.url.split("/")[ 3 ];
        //console.log(id)
        getProduct(req, res, id)

    } else if (productsUrl && req.method === "POST") {

        createProduct(req, res)
    } else if (prodIDUrl && req.method === "PUT") {
        const id = req.url.split("/")[ 3 ];
        updateProduct(req, res, id)

    } else {

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port... ${PORT}`));
