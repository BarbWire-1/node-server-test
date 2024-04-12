const http = require('http');
const Products = require('./controllers/productsController');
const Server = require('./serverClasses/jsonClasses/Server');

const server = new Server([Products]); // the controllers for potentially multiple resources

server.use(async (req, res) => {
	// Your authentication logic
});

server.use(async (req, res) => {
	// Your authorization logic
});

const PORT = process.env.PORT || 3000;
server.start(PORT);
//console.log(server.response)

// // Define the request type and URL you want to test


// Define the request parameters
const method = 'GET';
const path = '/api/products/';
const data = null; // No data for a GET request
const hostname = 'localhost'; // Assuming your server is running locally
const port = 3000; // Assuming your server is running on port 3000

// Call the makeRequest method
server.internal.makeRequest(method, path, data, hostname, port)
  .then((responseData) => {
      let data = JSON.parse(responseData);
      console.log("Got Data", data);
      data.forEach(r => console.log(r.id))

  })
  .catch((error) => {
    // Handle any errors that occur during the request
    console.error(error);
  });



const requestParams = {
	method: 'GET',
	path: '/api/products/',
	data: null, // default to null in class
	// pass these two from the consuming server-instance??
	hostname: 'localhost',
	port: 3000,
};


server.internal.makeRequest(requestParams)
  .then((responseData) => {
      let data = JSON.parse(responseData);
      console.log("Got Data!", data);
      data.forEach(r => console.log(r.id));
  })
  .catch((error) => {

    console.error(error);
  });
