const https = require('https');
const debug = false;

function prettyPrintJson (jsonObject) {
    return JSON.stringify(jsonObject, null, 2);
}

function randomOrgApiPromise (requestOptions, postData) {
	return new Promise((resolve, reject) => {
		const request = https.request(requestOptions, response => {
            const chunks = []; // Hold intermediate pieces of overall response.
            if (debug) {
                console.log(`STATUS: ${response.statusCode}`);
                console.log(`HEADERS: ${prettyPrintJson(response.headers)}`);
            }
            response.setEncoding('utf8');

            response.on('data', chunk => {
                // Got some data - hold on to it until we're all done. 
                if (debug) {
                    console.log(`CHUNK: ${prettyPrintJson(JSON.parse(chunk))}`);
                }
                chunks.push(chunk);
            });
            response.on('end', () => {
                // That's it for new data; here, just print out all the chunks.
                const content = chunks.join('');
                resolve(content);
            });
        });
		request.on('error', reject);
		request.write(JSON.stringify(postData));
	    request.end();
	});
}

const randomOrgRequestOptions = {
	hostname: 'api.random.org',
	method: 'POST',
	path: '/json-rpc/2/invoke',
 	headers: { 'Content-Type': 'application/json' }
};

 const generateIntegersPostData = {
	"jsonrpc": "2.0",
	"method": "generateIntegers",
	"params": {
		"apiKey": "ccba1f8a-21ab-48c6-b62d-e8d34bb19c36",
		"n": 5,
		"min": 1,
		"max": 100
	},
	"id": 1 
};




randomOrgApiPromise(randomOrgRequestOptions, generateIntegersPostData)
	.then(content => console.log(`CONTENT (Promise):\n${prettyPrintJson(JSON.parse(content))}`))
	.catch(error => console.log(`BUMMER: ${error}`));  

