/* The LocalJSONModel class is a JavaScript model that interacts with a local JSON database file by
providing methods for CRUD operations and data manipulation. */
const fs = require('fs').promises;
const path = require('path');
const { v4 } = require('uuid');
const { writeDataToFile } = require('../../utils.js');

class LocalJSONModel {
	constructor(filePath) {
		this.filePath = filePath;
		this.data = [];
	}

	/**
	 * The function `initialize` reads a JSON file asynchronously and parses its content into an object,
	 * handling any errors that may occur.
	 */
	async initialize() {
		try {
			const absolutePath = path.resolve(__dirname, this.filePath);
			const jsonData = await fs.readFile(absolutePath, 'utf8');
			this.data = JSON.parse(jsonData);
		} catch (error) {
			console.error('Error initializing JSON database:', error);
		}
	}

	async findAll() {
		return this.data;
	}

	async findById(id) {
		// console.log('Model: ', { id });
		// console.log(this.data.find((item) => item.id === id));
		return this.data.find((item) => item.id === id);
	}

	async create(item) {
		const newItem = { id: v4(), ...item };
		this.data.push(newItem);
		await this.#saveToFile();
		return newItem;
	}

	
	async update(id, newData) {
		const index = this.data.findIndex((item) => item.id === id);
		if (index === -1) {
			throw new Error(`Item with id ${id} not found.`);
		}
		this.data[index] = { id, ...newData };
		await this.#saveToFile();
		return this.data[index];
	}

	async remove(id) {
		//console.log(id);
		this.data = this.data.filter((item) => item.id !== id);
		await this.#saveToFile();
	}

	/**
	 * The `findByQuery` function filters data based on the provided query parameters.
	 * @param queryParams -  The `queryParams` object contains key-value pairs that are used to filter the data.
	 * The function iterates over each item in the data array and checks if all the key-value pairs in the `queryParams` object match the
	 * @returns An array of items that match the query parameters is being returned.
	 * in the array matches all the key-value pairs in the `queryParams`. If an item does not match any of the query parameters, it is filtered out.
	 */
	async findByQuery(queryParams) {
		return this.data.filter((item) => {
			for (const key in queryParams) {
				if (item[key]?.toString() !== queryParams[key]) {
					return false;
				}
			}
			return true;
		});
	}

	/**
	 * an asynchronous method that saves data to a file using the `writeDataToFile`
	 * function.
	 */
	async #saveToFile() {
		await writeDataToFile(
			path.resolve(__dirname, this.filePath),
			this.data
		);
	}
}

module.exports = LocalJSONModel;
