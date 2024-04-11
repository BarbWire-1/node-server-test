// TODO - crashed itemById in get/post/delete
const http = require('http');
const Products = require('./controllers/productsController');
//console.log(Products)

// array of controller instances
const controllers = [Products];

const server = http.createServer(async (req, res) => {
	const url = req.url;

	for (const c of controllers) {
		//console.log(c);
		//const apiUrl = c.apiUrl.trim();
		//const itemIDUrl = url.match(new RegExp(`${apiUrl}/([0-9]+)`));
		const route = url.startsWith(`${c.apiUrl}`) && url !== c.apiUrl;
		const routeParameters = url.slice(c.apiUrl.length); // Extract params after apiUrl
		const id =
			routeParameters.split('/')[0] === 'id'
				? routeParameters.split('/')[1]
				: null;
		//console.log("Server: ", { id })
		//console.log({ route }, routeParameters);

		switch (req.method) {
			case 'GET':
				if (url === c.apiUrl) {
					await c.getAll(req, res);
				} else if (route) {
					await c.getAll(req, res, routeParameters); // TODO change to get routeMatch?
				}
				// } else if (itemIDUrl) {
				// 	await c.getItem(req, res, id);
				// }
				break;
			case 'POST':
				//if (url === apiUrl) {
				await c.createItem(req, res);
				//}
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
	}
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port... ${PORT}`));
