const http = require('http');
const { customLog, setDebugMode } = require('../../utils');

setDebugMode(true);
// making a request and passing req,res to server.handleRequest
class InternalRequestHandler {
	constructor(server) {
		this.server = server;
	}

	async makeRequest(requestOptions) {
		const { path, method, data } = requestOptions;

		// Define request details
		const options = {
			hostname: this.server.host,
			port: this.server.port,
			method: method,
			path: path,
			data: data,
			headers: {
			    'Content-Type': 'application/json',
			},
		};
		customLog('Should log here!'); // WTF- this does not log
		customLog(
			`Internal makeRequest (27) options(?) ${JSON.stringify(options) || 'no options here'}`
		);
let responseData = '';
		try {
			// Make the HTTP request
			responseData = await new Promise((resolve, reject) => {
				const req = http.request(options, (res) => {


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

				//if (data) req.write(JSON.stringify(data));

				req.end();
			});

			// Pass the response data to the server's handleRequest method
			await this.server.handleRequest(
				{
					url: path,
					method: method,
					data: data,
				},
				responseData
			);
			customLog(
				`internal (44) responseData: ${JSON.stringify(responseData) || 'no response here!'}`
			);
			//return responseData;
		} catch (error) {
			console.error('Internal request error:', error);
			throw error;
		}
	}
}

module.exports = InternalRequestHandler;
