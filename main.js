
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
server.start();
//console.log(server.response)

// // Define the request type and URL you want to test

const requestParams = {
	method: 'GET',
    path: '/api/products/price/49.99', 
	//data: null, // default to null in class
	// pass these two from the consuming server-instance??
	 hostname: 'localhost',
	 port: 3000,
};

server.internal
	.makeRequest(requestParams)
	.then((responseData) => {
		let result = JSON.parse(responseData);
		console.log('Got Data from internal request!', result);
        if (Array.isArray(result)) result.forEach((r) => console.log("id: ", r.id));

	})
	.catch((error) => {
		console.error(error);
    });
