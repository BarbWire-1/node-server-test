
const server = require('./server/myServer');
//TODO - why this sometimes work and sometimes not???
// there must be an issue in timing


//api/products/ or '/api/proDucts/[key]/[value]
// routes actually like flattened path, arrays not included, not tested for deeply nested - might need flattening the JSON directly when in (?)
// usage of server.internal, an instance of InternalRequestHandler
const requestParams = {
	method: 'GET',
    path: '/api/products/'
	//data: null, // only if required - on POST or PUT (what about PATCH in general?)
	// pass these two from the consuming server-instance??
	//hostname: server.host,
	//port: server.port,
};



    server.internal
        .makeRequest(requestParams)
        .then((responseData) => {
            let result = JSON.parse(responseData);
            console.log('Got Data from internal request!', result);

            if (Array.isArray(result))
                result.forEach((r) => console.log('id: ', r.id));

        })
        .catch((error) => {
            console.error(error);
        });
