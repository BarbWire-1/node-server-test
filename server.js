// TODO - crashed itemById in get/post/delete
const http = require('http');
const ResourceController = require('./controllers/JSONDataController');

// init with the path to json and the base api-url
const Products = new ResourceController(
	'../data/products.json',
	'/api/products'
);
Products.initialize();

// array of controller instances
const controllers = [Products];

const server = http.createServer(async (req, res) => {
	const url = req.url;
	const method = req.method;

	for (const c of controllers) {
		const apiUrl = c.apiUrl;
		const itemIDUrl = url.match(new RegExp(`${apiUrl}/([0-9]+)`));
		const urlQuery = url.startsWith(`${apiUrl}?`);
		const params = req.url.split('?')[1];
		const id = itemIDUrl ? itemIDUrl[1] : null;

		switch (req.method) {
			case 'GET':
				if (url === apiUrl) {
					await c.getAll(req, res, id);
				} else if (urlQuery) {
					await c.getAll(req, res, params, id);
				} else if (itemIDUrl) {
					await c.getItem(req, res, id);
				}
				break;
			case 'POST':
				if (url === apiUrl) {
					await c.createItem(req, res);
				}
				break;
			case 'PUT':
				if (itemIDUrl) {
					await c.updateItem(req, res, id);
				}
				break;
			case 'DELETE':
				if (itemIDUrl) {
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
