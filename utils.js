const fs = require("fs");

function writeDataToFile(fileName, content) {
  fs.writeFile(fileName, JSON.stringify(content), "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function getPostData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            req.on('data', chunk => {
                body += chunk.toString()
            })
            req.on('end', ()=> {
                resolve(body)
            })
        } catch (error) {
        reject(error)
        }
    })
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
