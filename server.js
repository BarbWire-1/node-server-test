// https://www.youtube.com/watch?v=_1xa8Bsho6A
// https://github.com/bradtraversy/vanilla-node-rest-api



const http = require("http");
const {getProduct, getProducts, createProduct, updateProduct, removeProduct} = require('./controllers/productController');


const server = http.createServer((req, res) => {

    const productsUrl = req.url === "/api/products";
    const prodIDUrl = req.url.match(/\/api\/products\/([0-9]+)/);

    const urlQuery = req.url.startsWith('/api/products?')
    const params =req.url.split('?')[1]
const id = req.url.split("/")[ 3 ];

    switch (req.method) {
    case 'GET':
      if (productsUrl) {
        getProducts(req, res);
      } else if (prodIDUrl) {

        getProduct(req, res, id);
      } else if (urlQuery) {
          //console.log("query-params: ", params)// logs id=1
          getProducts(req, res, params);
      }
      break;
    case 'POST':
      if (productsUrl) {
        createProduct(req, res);
      }
      break;
    case 'PUT':
            if (prodIDUrl) {

        updateProduct(req, res, id);
      }
        break;
        case 'DELETE':

            if (prodIDUrl) {

        removeProduct(req, res, id);
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Route not found' }));
  }
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port... ${PORT}`));
