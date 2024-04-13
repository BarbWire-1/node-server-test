//TODO- add querySearch
const path = require('path');
const Validator = require('./Validator')

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

		// Instantiate a Validator object
		this.validator = new Validator();
	}

	async initialize() {
		await this.resource.initialize();
	}
	createAbsolutePaths(file, baseRoute) {
		const absoluteFilePath = path.resolve(__dirname, file);
		const absoluteApiUrl = baseRoute;
		return { absoluteFilePath, absoluteApiUrl };
	}
	async getAll(req, res, paramRoute) {
		// working
		try {
			if (paramRoute) {
				const queryObj = {};

				// Split the params string into an array of paths and create key:value pairs
				const paths = paramRoute.split('&');
				for (const path of paths) {
					const keyValuePairs = path.split('/');

					for (let i = 0; i < keyValuePairs.length; i += 2) {
						const key = keyValuePairs[i];
						const value = keyValuePairs[i + 1];
                        queryObj[ key ] = value;
                        console.log(typeof key, typeof value)

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

				// Validate request data against create schema
				const newRecord = this.filterDataAgainstSchema(
					requestData,
					this.createSchema
				);

				// Create new record using validated data
				const createdRecord = await this.resource.create(newRecord);

				// Set response status code and data
				this.statusCode = 201;
				this.response = createdRecord;
			}
		} catch (error) {
			// Handle any errors that occur during validation or record creation
			console.log(error);
            this.statusCode = 500;

			this.response = { message: `Internal server error. ${this.message}`};
		}

		// Send response
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
				this.response = { message: `Record with id ${id} has been removed` };
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
