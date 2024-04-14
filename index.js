const server = require('./server/myServer');
//TODO - why this sometimes work and sometimes not???
// there must be an issue in timing

//api/products/ or '/api/products/[key]/[value]
// routes actually like flattened path, arrays not included, not tested for deeply nested - might need flattening the JSON directly when in (?)
// usage of server.internal, an instance of InternalRequestHandler

//TODO there is something really badly wrong! Internal should only fake the request not handle response in any way - so sometimes needs to run rs several times to get the data...that is :(
const requestParams = {
	method: 'GET',
	path: '/api/products/price/89.99',
	//data: null, // only if required - on POST or PUT (what about PATCH in general?)
	// pass these two from the consuming server-instance??
	//hostname: server.host,
	//port: server.port,
};

server.internal
	.makeRequest(requestParams) // I FIRST need to have the response passed the server's handleRequest I think...
	.then((responseData) => {
		let result = JSON.parse(responseData);
		let message = '';

		if (result.length) {
			message = `Got Data from internal request!`;
			result.forEach((r) => console.log('id: ', r.id));
		} else {
			message =
                "That either didn't find a match, or more serious didn't WORK!";
            // also logs message: 'No Match Found"} from controller.getAll()
		}
		console.log(message, result);
	})
	.catch((error) => {
		console.error(error);
	});
