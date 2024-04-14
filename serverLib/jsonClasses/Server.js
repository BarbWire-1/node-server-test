/* The Server class in the JavaScript code handles HTTP requests by routing them to controllers based
on the request method and URL, with the ability to apply middleware and manage responses. */
const http = require('http');
const InternalRequestHandler = require('./InternalRequestHandler');
const { customLog, setDebugMode } = require('../../utils');

//TODO use .env
//TODO1 - implement serving static files? support for multiple mimeTypes like:
/*
const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            ...

        would need to change internal and request logic
        OR create different serverType-extensions?? options??
*/

setDebugMode(false);

class Server {
	constructor(controllers, internal = true, port = 3000, host = 'localhost') {
		this.port = port;
		this.host = host;
		this.controllers = controllers;
		this.middlewares = [];
		this._response = null;
		this.internal = internal ? new InternalRequestHandler(this) : null;
	}

	get response() {
		return this._response;
	}

	async handleRequest(req, res) {
		customLog(req.url, req.method);
		// Apply middleware - not in use til now
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

		/* This part of the code is iterating over the controllers defined in the Server class and handling different HTTP request methods (GET, POST, PUT, DELETE) based on the request method and URL. */
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

	start() {
		const server = http.createServer(this.handleRequest.bind(this));
		server.listen(this.port, () => {
			console.log(`Server running on port ${this.port}`);
		});
	}

	use(middleware) {
		this.middlewares.push(middleware);
	}
}

module.exports = Server;
