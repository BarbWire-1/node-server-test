
const http = require('http');
// making a request and passing req,res to server.handleRequest
class InternalRequestHandler {
	constructor(server) {
		this.server = server;
	}

	async makeRequest(requestOptions) {
		const { path, method, data } = requestOptions;
		let requestDataJSON = null;

		// If data is provided, parse it as JSON
		if (data) {
			try {
				requestDataJSON = JSON.parse(data);
			} catch (error) {
				console.error('Error parsing request data as JSON:', error);
				throw error;
			}
		}

		// Define request details
		const options = {
			hostname: this.server.host,
			port: this.server.port,
			...requestOptions,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			// Make the HTTP request
			const responseData = await new Promise((resolve, reject) => {
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

				// Write request data to the request body if it exists
				if (requestDataJSON) {
					req.write(JSON.stringify(requestDataJSON));
				}

				req.end();
			});

			// Pass the request and response data to the server's handleRequest method
			const fakeResponse = {
				// Create a mock response object with minimal functionality
				writeHead: () => {},
				end: () => {},
			};
			await this.server.handleRequest(
				{ url: path, method, data: requestDataJSON },
				fakeResponse
			);

			return responseData;
		} catch (error) {
			console.error('Internal request error:', error);
			throw error;
		}
	}
}

module.exports = InternalRequestHandler;
