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

	/**
	 * The create function asynchronously adds a new item to the data array, assigns a unique id to it,
	 * saves the updated data to a file, and then returns the newly created item.
	 * @param item - The `item` parameter is an object that contains the data to be added to the `data`
	 * array. It is spread into a new object along with a generated `id` using the `v4()` function from an external library.
	 * @returns The `create` method is returning the newly created item after adding it to the `data`
	 * array and saving it to a file asynchronously.
	 */
	async create(item) {
		const newItem = { id: v4(), ...item };
		this.data.push(newItem);
		await this.#saveToFile();
		return newItem;
	}

	/**
	 * The update function finds an item in the data array by id, updates it with new data, saves the
	 * changes to a file, and returns the updated item.
	 * @param id - The `id` parameter is the unique identifier of the item that needs to be updated in the data array.
	 * @param newData - The `newData` parameter in the `update` method represents the updated information that you want to replace in the item with the specified `id`. It could include any new values or changes that you want to apply to the existing item in the data array.
	 * @returns The `update` method is returning the updated item from the `data` array after updating it with the new data provided.
	 */
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
