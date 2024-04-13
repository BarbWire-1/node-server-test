const http = require('http');

class InternalRequestHandler {
	constructor(host, port) {
        this.host = host;
        this.port = port;

    }

	async makeRequest(requestOptions) {
		return new Promise((resolve, reject) => {
			const { hostname = this.host, path, method, data } = requestOptions;

			// Define request details
            const options = {
                hostname: hostname,
                port: this.port,
				...requestOptions,
				headers: {
					'Content-Type': 'application/json', // Assuming JSON data
				},
            };
            //console.log(options)

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

	async makeInternalRequest(requestOptions) {
		try {
			// Make the internal request
			const responseData = await this.makeRequest(requestOptions);
			// Pass the response data to the server's handleRequest method
			const fakeResponse = {
				writeHead: () => {},
				end: () => {},
			}; // Create a mock response object
			await this.server.handleRequest(
				{ url: requestOptions.path, method: requestOptions.method },
				fakeResponse
			);
		} catch (error) {
			console.error('Internal request error:', error);
		}
	}
}

module.exports = InternalRequestHandler;
