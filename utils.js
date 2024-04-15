const fs = require("fs");

function writeDataToFile(fileName, content) {
  fs.writeFile(fileName, JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function getPostData(req) {
	console.log('getPostData (12):', req); //getPostData (12): { url: '/api/products/id/1', method: 'PUT', data: { price: 89.99 } } eg, but THROWS on PUT
	return new Promise((resolve, reject) => {
		try {
			let body = '';
			req.on('data', (chunk) => {
				body += chunk.toString();
			});
			req.on('end', () => {
				resolve(body);
			});
		} catch (error) {
            //reject(error)
            console.log("\nI think I'm trying something weird and circular here.\nLike handling the own response after having bypassed the handling")
		}
	});
}

let DEBUG = true; // or false

function customLog(message) {
	if (DEBUG) {
		console.log(message);
	}
}
function setDebugMode(value) {
	DEBUG = value;
}


module.exports = { writeDataToFile, getPostData, customLog, setDebugMode };
