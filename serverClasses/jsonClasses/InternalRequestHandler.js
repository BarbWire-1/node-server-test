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

				// When response is complete, resolve with the data
				res.on('end', () => {
					resolve(responseData);
				});
			});

			// Handle errors
			req.on('error', (error) => {
				reject(error);
			});

			// Write data to the request body if present
			if (data) {
				req.write(JSON.stringify(data));
			}

			// End the request
			req.end();
		});
	}
}

module.exports = InternalRequestHandler;
