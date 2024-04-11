const http = require('http');

class Server {
	constructor(controllers) {
		this.controllers = controllers;
		this._response = null;
	}
	get response() {
		return this._response;
	}

	async handleRequest(req, res) {
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
					if (url === c.apiUrl) {
						await c.getAll(req, res);
					} else if (route) {
						await c.getAll(req, res, routeParameters);
					}
					break;
				case 'POST':
					await c.createItem(req, res);
					break;
				case 'PUT':
					if (route) {
						await c.updateItem(req, res, id);
					}
					break;
				case 'DELETE':
					if (route) {
						await c.deleteItem(req, res, id);
					}
					break;
				default:
					res.writeHead(404, { 'Content-Type': 'application/json' });
					res.end(JSON.stringify({ message: 'Route not found' }));
					return;
			}
			// does this make any sense in real world application???
			this._response = c.response;
			console.log(c.response);
		}
	}

	start(port) {
		const server = http.createServer(this.handleRequest.bind(this));
		server.listen(port, () =>
			console.log(`Server running on port ${port}`)
		);
	}
}

module.exports = Server;
