const http = require('http');
// InternalRequestHandler.js
class InternalRequestHandler {
	constructor() {}

	async makeRequest(requestOptions) {
		return new Promise((resolve, reject) => {
			const { hostname, port, path, method, data } = requestOptions;

			// Define request details
			const options = {
				...requestOptions,
				headers: {
					'Content-Type': 'application/json', // Assuming JSON data
				},
			};

			// Create the request
			const req = http.request(options, (res) => {
				let responseData = '';

				// Collect response data
				res.on('data', (chunk) => {
					responseData += chunk;
				});
				res.on('end', () => {
                    resolve(responseData);

				});
			});


			req.on('error', (error) => {
				reject(error);
			});


			if (data) req.write(JSON.stringify(data));



			req.end();
		});
	}
}

module.exports = InternalRequestHandler;
