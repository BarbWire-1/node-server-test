/* This code snippet is setting up a server using a custom server class and a products controller. Here
is a breakdown of what each part of the code is doing: */
const Products = require('./controllers/productsController');
const Server = require('../serverLib/jsonClasses/Server');

const server = new Server([Products]); // the controllers for potentially multiple resources
//TODO - look up "middleware" - validator also middleware?
// server.use(async (req, res) => {
// 	// eg autentication, authorisation....
// });

server.start();


module.exports = server;
