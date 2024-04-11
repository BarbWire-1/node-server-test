//TODO- add querySearch
const path = require('path');

const JSONDatabase = require('./LocalJSONModel');
const { getPostData } = require('../../utils');
const contentType = { 'Content-Type': 'application/json' };

class JSONDataController {
    constructor (filePath, apiUrl) {

		this.resource = new JSONDatabase(filePath);
		this.apiUrl = apiUrl;
		this.itemId = null;
		this.statusCode = null;
		this.response = null;
		this.createSchema = {};
		this.updateSchema = {};

	}

	async initialize() {
		await this.resource.initialize();
	}
    createAbsolutePaths(file, baseRoute) {
const absoluteFilePath = path.resolve(__dirname, file);
        const absoluteApiUrl = baseRoute;
        return {absoluteFilePath, absoluteApiUrl}
}
	async getAll(req, res, route) {
		// working
		try {
			if (route) {
				const queryObj = {};

				// Split the params string into an array of paths and create key:value pairs
				const paths = route.split('&');
				for (const path of paths) {
					const keyValuePairs = path.split('/');

					for (let i = 0; i < keyValuePairs.length; i += 2) {
						const key = keyValuePairs[i];
						const value = keyValuePairs[i + 1];
						queryObj[key] = value;

						if (key === 'id') this.itemId = value;
					}
				}

				const filteredItems = await this.resource.findByQuery(queryObj);
				console.log({ filteredItems });
				if (filteredItems.length === 0) {
					this.statusCode = 404;
					this.response = { message: 'No Match Found' };
				} else {
					this.statusCode = 200;
					this.response = filteredItems;
				}
			} else {
				const items = await this.resource.findAll();
				this.statusCode = 200;
				this.response = items;
			}
			this.respond(res);
		} catch (error) {
			console.log(error);
		}
	}

	async getItem(req, res, id) {
		try {
			const product = await this.resource.findById(this.itemId);
			console.log('ID: ', this.itemId);

			if (!product) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Product Not Found' }));
			} else {
				res.writeHead(200, contentType);
				res.end(JSON.stringify(product));
			}
		} catch (error) {
			console.log(error);
		}
	}

	async createItem(req, res) {
		// working
		console.log('url', req.url);
		if (req.url !== this.apiUrl) {
			this.statusCode = 404;
			this.response = { message: `POST only on ${this.apiUrl} ` };
		} else {
			try {
				let body = await getPostData(req);

				const { title, description, price } = JSON.parse(body);
				const product = {
					title,
					description,
					price,
				};

				const newProduct = await this.resource.create(product);
				this.statusCode = 201;
				this.response = newProduct;
			} catch (error) {
				console.log(error);
			}
		}

		this.respond(res);
	}

	async updateItem(req, res, id) {
		try {
			const item = await this.resource.findById(id);
			if (!item) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Product Not Found' }));
				return;
			}

			// Parse the incoming data from the request body
			let body = await getPostData(req);
			const requestData = JSON.parse(body);

			try {
				const filteredData = this.filterDataAgainstSchema(
					requestData,
					this.updateSchema
				);
				// filteredData now contains only the valid fields according to the update schema
				const updItem = await this.resource.update(id, {
					...item,
					...filteredData,
				});
				this.statusCode = 200;
				this.response = updItem;
				// Now you can use filteredData to update the item
			} catch (error) {
				this.statusCode = 400;
				this.response = { message: 'Invalid request' };
				// Handle invalid keys
				console.error(error.message);
			}

			this.respond(res);
		} catch (error) {
			console.log(error);
			return;
		}
	}
	//TEST
	filterDataAgainstSchema(requestData, schema) {
		const filteredData = {};
//console.log(schema)// TODO check against schema for all settings of value
		for (const key in requestData) {
            if (schema[ key ]) {
				console.log(schema[key]); // updating price: { type: 'number', errorMessage: 'Price must be a number' }
				filteredData[key] = requestData[key];
			} else {
				throw new Error(`Invalid key: ${key}`);
			}
		}

		return filteredData;
	}

	async deleteItem(req, res, id) {
		try {
			console.log(id);
			const product = await this.resource.findById(id);

			if (!product) {
				this.statusCode = 404;
				this.response = { message: 'Item Not Found' };
			} else {
				await this.resource.remove(id);
				this.statusCode = 200;
				this.response = { message: `Item ${id} has been removed` };
				this.respond(res);
			}
		} catch (error) {
			console.log(error);
		}
	}

	respond(res) {
		res.writeHead(this.statusCode, contentType);
		return res.end(JSON.stringify(this.response));
	}
}

module.exports = JSONDataController;
