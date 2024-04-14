/* This code snippet is setting up a server using a custom server class and a products controller. Here
is a breakdown of what each part of the code is doing: */
const Products = require('./controllers/productsController');
const Server = require('../serverLib/jsonClasses/Server');

const server = new Server([Products]); // the controllers for potentially multiple resources

// server.use(async (req, res) => {
// 	// Your authentication logic
// });
//
// server.use(async (req, res) => {
// 	// Your authorization logic
// });

server.start();
//console.log(server.response)

// // Define the request type and URL you want to test

module.exports = server;
