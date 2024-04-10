const JSONDatabase = require('../models/JSONDatabase');
const { getPostData } = require('../utils');
const contentType = { 'Content-Type': 'application/json' };

class JSONDataController {
	constructor(filePath, apiUrl) {
		this.resource = new JSONDatabase(filePath);
		this.apiUrl = apiUrl;
		console.log(this.resource);
	}

	async initialize() {
		await this.resource.initialize();
	}

	async getAll(req, res) {
		try {
			if (req.url.includes('?')) {
				const queryParams = req.url.split('?')[1];
				const params = new URLSearchParams(queryParams);
				const queryObj = {};

				for (const [key, value] of params.entries()) {
					queryObj[key] = value;
				}

				const filteredProducts =
					await this.resource.findByQuery(queryObj);
				res.writeHead(200, contentType);
				res.end(JSON.stringify(filteredProducts));
			} else {
				const products = await this.resource.findAll();
				res.writeHead(200, contentType);
				res.end(JSON.stringify(products));
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getItem(req, res, id) {
		try {
            const product = await this.resource.findById(id);
            console.log("ID: ",id)

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

			const newProduct = await this.productsDB.create(product);
			res.writeHead(201, contentType);
			return res.end(JSON.stringify(newProduct));
		} catch (error) {
			console.log(error);
		}
	}

	async updateItem(req, res, id) {
		try {
			const product = await this.productsDB.findById(id);
			if (!product) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Product Not Found' }));
			} else {
				let body = await getPostData(req);
				const { title, description, price } = JSON.parse(body);
				const productData = {
					title: title || product.title,
					description: description || product.description,
					price: price || product.price,
				};

				const updProduct = await this.productsDB.update(
					id,
					productData
				);
				res.writeHead(200, contentType);
				return res.end(JSON.stringify(updProduct));
			}
		} catch (error) {
			console.log(error);
		}
	}

	async deleteItem(req, res, id) {
		try {
			const product = await this.productsDB.findById(id);

			if (!product) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Product Not Found' }));
			} else {
				await this.productsDB.remove(id);
				res.writeHead(200, contentType);
				res.end(
					JSON.stringify({
						message: `Product ${id} has been removed`,
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = JSONDataController;
