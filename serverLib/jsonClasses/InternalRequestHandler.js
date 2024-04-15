
const http = require('http');
const { customLog, setDebugMode } = require('../../utils');

setDebugMode(true)
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
        data: data ,
        headers: {
            'Content-Type': 'application/json',
        },
    };
        customLog("Should log here!")
        customLog(options)

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
                    console.log('Response data:', responseData); // Log response data
                    resolve(responseData);
                });
                customLog({ responseData });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) req.write(JSON.stringify(data));

            req.end();
        });

        // Pass the response data to the server's handleRequest method
        await this.server.handleRequest(
            { url: requestOptions.path, method: requestOptions.method },
            null
        );
        return responseData;
    } catch (error) {
        console.error('Internal request error:', error);
        throw error;
    }
}

}

module.exports = InternalRequestHandler;
