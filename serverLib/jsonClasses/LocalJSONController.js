/* The JSONDataController class handles CRUD operations for a JSON database, including creating,
reading, updating, and deleting records. */
//TODO- add querySearch "apiUrl?key=value&....."

const path = require('path');
const Validator = require('./Validator');

const JSONDatabase = require('./LocalJSONModel');
const { getPostData } = require('../../utils');
const contentType = { 'Content-Type': 'application/json' };

class JSONDataController {
	constructor(filePath, apiUrl) {
		this.resource = new JSONDatabase(filePath);
		this.apiUrl = apiUrl;
		this.recordId = null;
		this.statusCode = null;
		this.response = null;
		this.message = null;
		this.createSchema = {};
		this.updateSchema = {};

		// TODO - not yet implemented, running own method instead
		this.validator = new Validator();
	}

	/**
	 * The `initialize` function is an asynchronous method that initializes a resource.
	 */
	async initialize() {
		await this.resource.initialize();
	}
	/**
	 * The function creates absolute file paths based on the provided file and base route.
	 * @param file - The `file` parameter is the relative path of the file you want to create an absolute path for.
	 * @param baseRoute - The `baseRoute` parameter typically refers to the base URL or route of an API
	 * endpoint. It is used as a base for constructing the complete API URL.
	 * @returns The function `createAbsolutePaths` returns an object with two properties:
	 * `absoluteFilePath` which is the absolute path of the `file` parameter resolved using `__dirname`, and `absoluteApiUrl` which is the value of the `baseRoute` parameter.
	 */
	createAbsolutePaths(file, baseRoute) {
		const absoluteFilePath = path.resolve(__dirname, file);
		const absoluteApiUrl = baseRoute;
		return { absoluteFilePath, absoluteApiUrl };
	}

	// TOD= - split this? - or at least rename to multiple?
	/* The `getAll` method in the `JSONDataController` class is responsible for handling the retrieval
    of records from the JSON database. It accepts three parameters: `req` (request), `res`
    (response), and an optional `paramRoute` which contains query parameters for filtering records. */
	async getAll(req, res, paramRoute) {
		// working
		try {
			/* This block is responsible for parsing and processing query parameters that are passed in the `paramRoute`
            variable. */
			if (paramRoute) {
				const queryObj = {};

				// Split the params string into an array of paths and create key:value pairs
				const paths = paramRoute.split('&');
				for (const path of paths) {
					const keyValuePairs = path.split('/');

					for (let i = 0; i < keyValuePairs.length; i += 2) {
						const key = keyValuePairs[i];
						const value = keyValuePairs[i + 1];
						queryObj[key] = value;
						console.log(typeof key, typeof value);

						if (key === 'id') this.recordId = value;
					}
				}

				const filteredRecords =
					await this.resource.findByQuery(queryObj);
				//console.log({filteredRecords });
				if (filteredRecords.length === 0) {
					this.statusCode = 404;
					this.response = { message: 'No Match Found' };
				} else {
					this.statusCode = 200;
					this.response = filteredRecords;
				}
			} else {
				const records = await this.resource.findAll();
				this.statusCode = 200;
				this.response = records;
			}
			this.respond(res);
		} catch (error) {
			console.log(error);
		}
	}

	async getRecord(req, res) {
		try {
			const record = await this.resource.findById(this.recordId);
			console.log('ID: ', this.recordId);

			if (!record) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'Record Not Found' }));
			} else {
				res.writeHead(200, contentType);
				res.end(JSON.stringify(record));
			}
		} catch (error) {
			console.log(error);
		}
	}

	async createRecord(req, res) {
		this.message = '';
		try {
			// Ensure the request URL matches the expected API URL
			if (req.url !== this.apiUrl) {
				this.statusCode = 404;
				this.response = { message: `POST only on ${this.apiUrl} ` };
			} else {
				// Parse request body
				const body = await getPostData(req);
				const requestData = JSON.parse(body);

				// validation
				const newRecord = this.filterDataAgainstSchema(
					requestData,
					this.createSchema
				);


				const createdRecord = await this.resource.create(newRecord);


				this.statusCode = 201;
				this.response = createdRecord;
			}
		} catch (error) {
			// Handle any errors that occur during validation or record creation
			console.log(error);
			this.statusCode = 500;

			this.response = {
				message: `Internal server error. ${this.message}`,
			};
		}


		this.respond(res);
	}

	async updateRecord(req, res, id) {
		try {
			const record = await this.resource.findById(id);
			if (!record) {
				res.writeHead(404, contentType);
				res.end(JSON.stringify({ message: 'record Not Found' }));
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
				const updRecord = await this.resource.update(id, {
					...record,
					...filteredData,
				});
				this.statusCode = 200;
				this.response = updRecord;
				// Now you can use filteredData to update the record
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
	/**
	 * The function `filterDataAgainstSchema` validates and filters request data based on a specified
	 * schema.
	 * @param requestData - The data that you want to filter based on a specified schema set up in the controller. This data typically comes in the form of an object.
	 * @param schema - The `schema` parameter defines the structure and validation rules for the data that is expected in the `requestData`. It contains keys that represent the fields expected in the data and their corresponding validation rules.
	 * Mismatches for key or rule trigger corresponding error messages
	 * @returns  an object containing the filtered data that matches the schema provided as input.
	 */
	filterDataAgainstSchema(requestData, schema) {
		const filteredData = {};

		for (const key in schema) {
			if (schema.hasOwnProperty(key)) {
				const fieldSchema = schema[key];

				// Check if the field is required but missing in the request data
				if (fieldSchema.required && !requestData.hasOwnProperty(key)) {
					this.message += `'${key}' is required`;
					throw new Error(this.message);
				}

				// Check if the field exists in the request data
				if (requestData.hasOwnProperty(key)) {
					const value = requestData[key];

					// Check if the field value matches the specified type
					if (typeof value !== fieldSchema.type) {
						this.message += `'${key}' must be of type ${fieldSchema.type}`;
						throw new Error(this.message);
					}

					// Add the validated field to the filtered data
					filteredData[key] = value;
				}
			}
		}

		return filteredData;
	}

	async deleteRecord(req, res, id) {
		try {
			//console.log(id);
			const record = await this.resource.findById(id);

			if (!record) {
				this.statusCode = 404;
				this.response = { message: 'Record Not Found' };
			} else {
				await this.resource.remove(id);
				this.statusCode = 200;
				this.response = {
					message: `Record with id ${id} has been removed`,
				};
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
