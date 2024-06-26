/* This code snippet is setting up a resource controller for managing products data. Here is a
breakdown of what each part of the code is doing: */
const ResourceController = require('../../serverLib/jsonClasses/LocalJSONController');
const path = require('path');
const absoluteFilePath = path.resolve(__dirname, '../data/products.json');
const absoluteApiUrl = '/api/products/';

// Initialize the ResourceController with the absolute file path and API URL
const Products = new ResourceController(
	absoluteFilePath, 
	absoluteApiUrl
);
Products.initialize();

// SCHEMATA
const baseSchema = {
	title: {
		type: 'string',
		minLength: 3,
		maxLength: 100,
		errorMessage:
			'Title must be a string with a length between 3 and 100 characters',
	},
	description: {
		type: 'string',
		minLength: 3,
		maxLength: 500,
		errorMessage:
			'Description must be a string with a length between 3 and 500 characters',
	},
	price: { type: 'number', errorMessage: 'Price must be a number' },
};

// create schemata for create and update from base
Object.entries(baseSchema).forEach(([key, value]) => {
	Products.createSchema[key] = { ...value, required: true };
	Products.updateSchema[key] = { ...value };
});

module.exports = Products;
