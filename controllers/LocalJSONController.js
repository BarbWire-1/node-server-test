//TODO- change query to apiUrl/key/value

const JSONDatabase = require('../models/LocalJSONModel');
const { getPostData } = require('../utils');
const contentType = { 'Content-Type': 'application/json' };

class JSONDataController {
	constructor(filePath, apiUrl) {
		this.resource = new JSONDatabase(filePath);
		this.apiUrl = apiUrl;
        this.itemId = null;
        this.statusCode = null;
        this.response = null;
		//console.log(this.resource);
	}

	async initialize() {
		await this.resource.initialize();
	}

	async getAll(req, res, params) {
		try {
			if (params) {
				const queryObj = {};

				// Split the params string into an array of paths and create key:value pairs
				const paths = params.split('&');
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
                    this.response = filteredItems

				}
			} else {
                const items = await this.resource.findAll();
                this.statusCode = 200;
                this.response = items

            }
            res.writeHead(this.statusCode, contentType);
			res.end(JSON.stringify(this.response));
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
		try {
			let body = await getPostData(req);
			const { title, description, price } = JSON.parse(body);
			const product = {
				title,
				description,
				price,
			};

			const newProduct = await this.resource.create(product);
			res.writeHead(201, contentType);
			return res.end(JSON.stringify(newProduct));
		} catch (error) {
			console.log(error);
		}
	}

	async updateItem(req, res, id) {
		try {
			const product = await this.resource.findById(id);
			if (!product) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Product Not Found' }));
			} else {
				let body = await getPostData(req);
				//TODO - add schema to resource
				const { title, description, price } = JSON.parse(body);
				const productData = {
					title: title || product.title,
					description: description || product.description,
					price: price || product.price,
				};

				const updProduct = await this.resource.update(id, productData);
				res.writeHead(200, contentType);
				return res.end(JSON.stringify(updProduct));
			}
		} catch (error) {
			console.log(error);
		}
	}

	async deleteItem(req, res, id) {
		try {
			console.log(id);
			const product = await this.resource.findById(id);

			if (!product) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Item Not Found' }));
			} else {
				await this.resource.remove(id);
				res.writeHead(200, contentType);
				res.end(
					JSON.stringify({
						message: `Item ${id} has been removed`,
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = JSONDataController;
