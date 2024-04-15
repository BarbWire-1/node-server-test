const server = require('./server/myServer');
//TODO - internalRequest totally messes up all handling now by sending a "fakeRequest"
// It works in a way but triggers wrong response data (code/message)
const requestParams = {
	method: 'GET',
    path: '/api/products/id/4',

	//data: {"price": 22.22}, // only if required - on POST or PUT (what about PATCH in general?)
	// pass these two from the consuming server-instance??
	//hostname: server.host,
	//port: server.port,
};

server.internal
	.makeRequest(requestParams) // I FIRST need to have the response passed the server's handleRequest I think...
	.then(() => {
		let result = server._response;// just for testing using the initial private prop
		let message = '';
        if (result?.length) {
            message = "Yeah! I made it!"
            result.forEach((r) => console.log('id: ', r.id));
        }
            // } else {
            //     message =
            //         "That either didn't find a match, or more serious didn't WORK!";
            //     // also logs message: 'No Match Found"} from controller.getAll()
            // }

		console.log(message, server._response);
	})
	.catch((error) => {
		console.error(error);
	});



    // server.internal
	// 	.makeInternalRequest(requestParams)
	// 	.then(() => {
	// 		console.log('Internal request sent to server', server.response);
	// 	})
	// 	.catch((error) => {
	// 		console.error(error);
	// 	});
