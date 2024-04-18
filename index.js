const server = require('./server/myServer');
//TODO - internalRequest totally messes up all handling now by sending a "fakeRequest"
// I THINK, I got it!!! using internal the controller must know about req (???) to handle incoming data (???)
// and consuming server._result for now, but breaks for sending data!!!!

const requestParams = {
	method: 'GET',
	path: '/api/products/id/2',
	//data: { price: 489.99 }, // only if required - on POST or PUT (what about PATCH in general?)
};

server.internal
	.makeRequest(requestParams) // I FIRST need to have the response passed the server's handleRequest I think...
	.then(() => {
		let data = server.response; // just for testing using the initial private prop
        let message = 'Yeah! I made it!';

		if (data?.length) {
			data.forEach((r) => console.log('id: ', r.id));
		} else {
			message =
				"That either didn't find a match, or more serious didn't WORK!";

		}
console.log("statusCode: " + server.statusCode)// undefined!
		console.log(message, server.statusCode,server.response);
	})
	.catch((error) => {
		console.error(error);
	});
