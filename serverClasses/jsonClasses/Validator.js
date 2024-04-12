const customLog = require('../../utils')

class Validator {
	constructor() {
		this.message = '';
	}

	// Validate a single field against its schema
	validateField(key, value, fieldSchema) {
		if (fieldSchema.required && !value) {
			this.message += `'${key}' is required. `;
			return false;
		}

		if (fieldSchema.type && typeof value !== fieldSchema.type) {
			this.message += `'${key}' must be of type ${fieldSchema.type}. `;
			return false;
		}

		if (
			typeof value === 'string' &&
			((fieldSchema.minLength && value.length < fieldSchema.minLength) ||
				(fieldSchema.maxLength && value.length > fieldSchema.maxLength))
		) {
			this.message += `'${key}' must be between ${fieldSchema.minLength} and ${fieldSchema.maxLength} characters long. `;
			return false;
		}

		return true;
	}

	validateData(data, schema) {
		const filteredData = {};

		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				if (!schema.hasOwnProperty(key)) {
					// Throw an error immediately if an unexpected key is encountered
					throw new Error(`Unexpected key '${key}' found in data.`);
				}

				const fieldSchema = schema[key];
				const value = data[key];

				if (!this.validateField(key, value, fieldSchema)) {
					// Validation failed for this field
					throw new Error(`Validation failed for field '${key}'.`);
				}

				// Field passed validation, add it to the filtered data
				filteredData[key] = value;
			}
		}

		// Return the filtered data if all validation passes
		return filteredData;
	}
}

// Example usage:
// const validator = new Validator();
// const requestData = {
// 	title: 'Example Title',
// 	description: 'Example Description',
// 	price: 10,
// };
// const filteredData = validator.validateData(requestData, baseSchema);
//
// if (filteredData) {
// 	console.log('Filtered data:', filteredData);
// } else {
// 	console.error('Validation error:', validator.message);
// }

module.exports = Validator;