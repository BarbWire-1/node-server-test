
const server = require('./server/myServer');

// usage of server.internal, an instance of InternalRequestHandler
const requestParams = {
	method: 'GET',
    path: '/api/products/id/2',
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

		if (Array.isArray(result))
            result.forEach((r) => console.log('id: ', r.id));

	})
	.catch((error) => {
		console.error(error);
	});
