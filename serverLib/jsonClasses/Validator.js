/* The Validator class in JavaScript provides methods to validate data fields against a
schema specified in the corresponding controller*/

const { customLog } = require('../../utils');
// TODO add other types - date objects etc

class Validator {
	constructor() {
		this.message = '';
	}

	// Validate a single field against its schema
    validateField(key, value, fieldSchema) {


        const { required, type, minLength, maxLength } = fieldSchema;
		if (required && !value) {
			this.message += `'${key}' is required. `;
			return false;
		}
        if(type === 'number') value = +value
		if (type && typeof value !== type) {
			this.message += `'${key}' must be of type ${type}. `;
			return false;
		}

		if (
			type === 'string' &&
			((minLength && value.length < minLength) ||
				(maxLength && value.length > maxLength))
		) {
			this.message += `'${key}' must be between ${minLength} and ${maxLength} characters long. `;
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
                    console.warn(this.message)
					// Validation failed for this field
					throw new Error(`Validation failed for field '${key}'.`);
				}


				filteredData[key] = value;
			}
		}


		return filteredData;
	}
}

module.exports = Validator;
