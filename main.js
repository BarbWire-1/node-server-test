
const Products = require('./controllers/productsController');
const Server = require('./serverClasses/jsonClasses/Server');

const server = new Server([ Products ]);// the controllers for potentially multiple resources
const PORT = process.env.PORT || 3000;
server.start(PORT); 
//console.log(server.response)
