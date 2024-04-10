// TODO - crashed itemById in get/post/delete
const http = require('http');
const ResourceController = require('./controllers/LocalJSONController');

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


	for (const c of controllers) {
		const apiUrl = c.apiUrl.trim();
		//const itemIDUrl = url.match(new RegExp(`${apiUrl}/([0-9]+)`));
		const route = url.startsWith(`${apiUrl}/`);
		const routeParameters = url.slice(apiUrl.length + 1); // Extract params after apiUrl
        const id =
			routeParameters.split('/')[0] === 'id'
				? routeParameters.split('/')[1]
				: null;
        console.log("Server: ",{id})

		switch (req.method) {
			case 'GET':
				if (url === apiUrl) {
					await c.getAll(req, res);
                } else if (route) {
                    console.log(routeParameters)
					await c.getAll(req, res, routeParameters);
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
