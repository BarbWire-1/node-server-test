const http = require('http');
const InternalRequestHandler = require('./InternalRequestHandler');
const { customLog, setDebugMode } = require('../../utils');

setDebugMode(false);


class Server {
    constructor (controllers, internal = true) {
        this.port = null;
		this.controllers = controllers;
		this.middlewares = [];
        this._response = null;
        this.internal = internal ? new InternalRequestHandler() : null;
	}

	get response() {
		return this._response;
	}

	async handleRequest(req, res) {
		customLog(req.url, req.method);
		// Apply middleware
		for (const middleware of this.middlewares) {
			try {
				await middleware(req, res);
			} catch (error) {
				console.error('Middleware error:', error);
				// Respond with error message
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ message: 'Internal Server Error' }));
				return;
			}
		}

		const url = req.url;

		for (const c of this.controllers) {
			const route = url.startsWith(`${c.apiUrl}`) && url !== c.apiUrl;
			const routeParameters = url.slice(c.apiUrl.length);
			const id =
				routeParameters.split('/')[0] === 'id'
					? routeParameters.split('/')[1]
					: null;

			switch (req.method) {
				case 'GET':
					customLog('should GET');
					if (url === c.apiUrl) {
						customLog('should GET All');
						await c.getAll(req, res);
						customLog(res);
					} else if (route) {
						await c.getAll(req, res, routeParameters);
					}
					break;
				case 'POST':
					await c.createRecord(req, res);
					break;
				case 'PUT':
					if (route) {
						await c.updateRecord(req, res, id);
					}
					break;
				case 'DELETE':
					if (route) {
						await c.deleteRecord(req, res, id);
					}
					break;
			}
			this._response = c.response;
            customLog(c.response);
		}
	}

	start(port) {
		const server = http.createServer(this.handleRequest.bind(this));
        server.listen(port, () => {
            this.port = port
            console.log(`Server running on port ${port}`)
        }
		);
	}

	use(middleware) {
		this.middlewares.push(middleware);
	}
}

module.exports = Server;
